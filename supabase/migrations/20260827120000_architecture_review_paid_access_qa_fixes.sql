begin;

create table if not exists public.architecture_review_billing_refresh_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  updated_at timestamptz not null default now()
);

alter table public.architecture_review_billing_refresh_limits enable row level security;
revoke all on public.architecture_review_billing_refresh_limits from anon, authenticated;
grant select, insert, update, delete on public.architecture_review_billing_refresh_limits to service_role;

create or replace function public.claim_architecture_review_billing_refresh(
  p_user_id uuid,
  p_window_seconds integer,
  p_request_limit integer
) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_limit public.architecture_review_billing_refresh_limits%rowtype;
begin
  if p_window_seconds <= 0 or p_request_limit <= 0 then raise exception 'invalid_rate_limit'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,0));
  select * into v_limit from public.architecture_review_billing_refresh_limits
    where user_id=p_user_id for update;
  if not found then
    insert into public.architecture_review_billing_refresh_limits(user_id,window_started_at,request_count)
      values(p_user_id,now(),1);
    return true;
  end if;
  if v_limit.window_started_at + make_interval(secs => p_window_seconds) <= now() then
    update public.architecture_review_billing_refresh_limits
      set window_started_at=now(),request_count=1,updated_at=now() where user_id=p_user_id;
    return true;
  end if;
  if v_limit.request_count >= p_request_limit then return false; end if;
  update public.architecture_review_billing_refresh_limits
    set request_count=request_count+1,updated_at=now() where user_id=p_user_id;
  return true;
end $$;

revoke all on function public.claim_architecture_review_billing_refresh(uuid,integer,integer) from public,anon,authenticated;
grant execute on function public.claim_architecture_review_billing_refresh(uuid,integer,integer) to service_role;

create or replace function public.cleanup_architecture_review_operational_metadata(p_before timestamptz default now()-interval '180 days')
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare v_count integer;
begin
  delete from public.architecture_review_billing_refresh_limits where updated_at < p_before;
  delete from public.stripe_webhook_events where state in ('processed','failed') and updated_at < p_before;
  delete from public.architecture_review_usage_attempts where state in ('consumed','released') and updated_at < p_before;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

commit;
