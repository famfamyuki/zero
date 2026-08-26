begin;

create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.architecture_review_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_key text not null check (plan_key = 'architecture_review_individual_monthly_v0'),
  stripe_subscription_id text unique not null,
  stripe_price_id text not null,
  stripe_status text not null,
  cancel_at_period_end boolean not null default false,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  sync_state text not null check (sync_state in ('healthy', 'degraded')),
  last_stripe_event_id text,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (current_period_end > current_period_start)
);

create table if not exists public.architecture_review_usage_periods (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text not null,
  period_start timestamptz not null,
  period_end timestamptz not null,
  quota_limit_snapshot integer not null check (quota_limit_snapshot > 0),
  consumed_count integer not null default 0 check (consumed_count >= 0),
  reserved_count integer not null default 0 check (reserved_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, stripe_subscription_id, period_start, period_end),
  check (period_end > period_start),
  check (consumed_count + reserved_count <= quota_limit_snapshot)
);

create table if not exists public.architecture_review_usage_attempts (
  request_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_period_id bigint not null references public.architecture_review_usage_periods(id) on delete restrict,
  stripe_subscription_id text not null,
  state text not null check (state in ('reserved', 'consumed', 'released')),
  provider_started_at timestamptz,
  reservation_expires_at timestamptz not null,
  provider_outcome text,
  review_version text,
  evidence_version text,
  reviewer_version text,
  provider_id text,
  model_id text,
  input_token_count integer check (input_token_count is null or input_token_count >= 0),
  output_token_count integer check (output_token_count is null or output_token_count >= 0),
  total_token_count integer check (total_token_count is null or total_token_count >= 0),
  preflight_cost_estimate_micro_usd bigint check (preflight_cost_estimate_micro_usd is null or preflight_cost_estimate_micro_usd >= 0),
  post_call_cost_estimate_micro_usd bigint check (post_call_cost_estimate_micro_usd is null or post_call_cost_estimate_micro_usd >= 0),
  cost_profile_version text,
  cost_estimate_status text check (cost_estimate_status is null or cost_estimate_status in ('estimated', 'unknown')),
  failure_category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists architecture_review_one_reserved_per_user
  on public.architecture_review_usage_attempts(user_id) where state = 'reserved';
create index if not exists architecture_review_attempt_cleanup_idx
  on public.architecture_review_usage_attempts(state, updated_at);

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  state text not null check (state in ('processing', 'processed', 'failed')),
  event_created_at timestamptz not null,
  processed_at timestamptz,
  failure_category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.billing_customers enable row level security;
alter table public.architecture_review_entitlements enable row level security;
alter table public.architecture_review_usage_periods enable row level security;
alter table public.architecture_review_usage_attempts enable row level security;
alter table public.stripe_webhook_events enable row level security;

revoke all on public.billing_customers from anon, authenticated;
revoke all on public.architecture_review_entitlements from anon, authenticated;
revoke all on public.architecture_review_usage_periods from anon, authenticated;
revoke all on public.architecture_review_usage_attempts from anon, authenticated;
revoke all on public.stripe_webhook_events from anon, authenticated;
grant select, insert, update, delete on public.billing_customers to service_role;
grant select, insert, update, delete on public.architecture_review_entitlements to service_role;
grant select, insert, update, delete on public.architecture_review_usage_periods to service_role;
grant select, insert, update, delete on public.architecture_review_usage_attempts to service_role;
grant select, insert, update, delete on public.stripe_webhook_events to service_role;
grant usage, select on sequence public.architecture_review_usage_periods_id_seq to service_role;

create or replace function public.reserve_architecture_review(
  p_user_id uuid,
  p_request_id uuid,
  p_quota_limit integer,
  p_review_version text,
  p_evidence_version text,
  p_reviewer_version text,
  p_provider_id text,
  p_model_id text,
  p_preflight_cost_estimate_micro_usd bigint,
  p_cost_profile_version text
) returns table(outcome text, usage_period_id bigint)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_ent public.architecture_review_entitlements%rowtype;
  v_period public.architecture_review_usage_periods%rowtype;
  v_existing public.architecture_review_usage_attempts%rowtype;
  v_stale public.architecture_review_usage_attempts%rowtype;
begin
  if p_quota_limit <= 0 then raise exception 'invalid_quota_limit'; end if;
  select * into v_existing from public.architecture_review_usage_attempts
    where request_id = p_request_id and user_id = p_user_id for update;
  if found then return query select v_existing.state, v_existing.usage_period_id; return; end if;

  select * into v_ent from public.architecture_review_entitlements
    where user_id = p_user_id for update;
  if not found or v_ent.sync_state <> 'healthy' then return query select 'entitlement_unavailable'::text, null::bigint; return; end if;
  if v_ent.stripe_status <> 'active' or v_ent.current_period_start > now() or v_ent.current_period_end <= now() then
    return query select 'billing_inactive'::text, null::bigint; return;
  end if;

  for v_stale in select * from public.architecture_review_usage_attempts
    where user_id = p_user_id and state = 'reserved' and reservation_expires_at <= now() for update
  loop
    update public.architecture_review_usage_attempts set state='released',
      provider_outcome=case when v_stale.provider_started_at is null then 'stale_before_provider' else 'unknown_after_provider_start' end,
      failure_category=case when v_stale.provider_started_at is null then 'stale_before_provider' else 'unknown_after_provider_start' end,
      cost_estimate_status=case when v_stale.provider_started_at is null then cost_estimate_status else 'unknown' end,
      updated_at=now() where request_id=v_stale.request_id and state='reserved';
    update public.architecture_review_usage_periods set reserved_count=greatest(0,reserved_count-1),updated_at=now()
      where id=v_stale.usage_period_id;
  end loop;

  insert into public.architecture_review_usage_periods(user_id,stripe_subscription_id,period_start,period_end,quota_limit_snapshot)
    values(p_user_id,v_ent.stripe_subscription_id,v_ent.current_period_start,v_ent.current_period_end,p_quota_limit)
    on conflict(user_id,stripe_subscription_id,period_start,period_end) do nothing;
  select * into v_period from public.architecture_review_usage_periods
    where user_id=p_user_id and stripe_subscription_id=v_ent.stripe_subscription_id
      and period_start=v_ent.current_period_start and period_end=v_ent.current_period_end for update;
  if v_period.consumed_count + v_period.reserved_count >= v_period.quota_limit_snapshot then
    return query select 'quota_exhausted'::text, v_period.id; return;
  end if;
  if exists(select 1 from public.architecture_review_usage_attempts where user_id=p_user_id and state='reserved') then
    return query select 'reserved'::text, v_period.id; return;
  end if;
  insert into public.architecture_review_usage_attempts(
    request_id,user_id,usage_period_id,stripe_subscription_id,state,reservation_expires_at,
    review_version,evidence_version,reviewer_version,provider_id,model_id,
    preflight_cost_estimate_micro_usd,cost_profile_version,cost_estimate_status
  ) values (
    p_request_id,p_user_id,v_period.id,v_ent.stripe_subscription_id,'reserved',now()+interval '15 minutes',
    p_review_version,p_evidence_version,p_reviewer_version,p_provider_id,p_model_id,
    p_preflight_cost_estimate_micro_usd,p_cost_profile_version,'estimated'
  );
  update public.architecture_review_usage_periods set reserved_count=reserved_count+1,updated_at=now() where id=v_period.id;
  return query select 'new'::text, v_period.id;
end $$;

create or replace function public.mark_architecture_review_provider_started(p_user_id uuid,p_request_id uuid)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
  update public.architecture_review_usage_attempts set provider_started_at=coalesce(provider_started_at,now()),updated_at=now()
    where request_id=p_request_id and user_id=p_user_id and state='reserved';
  return found;
end $$;

create or replace function public.finalize_architecture_review_attempt(
  p_user_id uuid,p_request_id uuid,p_terminal_state text,p_provider_outcome text,p_failure_category text,
  p_input_tokens integer default null,p_output_tokens integer default null,p_total_tokens integer default null,
  p_post_call_cost_estimate_micro_usd bigint default null,p_cost_estimate_status text default null
) returns text language plpgsql security definer set search_path=public,pg_temp as $$
declare v_attempt public.architecture_review_usage_attempts%rowtype;
begin
  if p_terminal_state not in ('consumed','released') then raise exception 'invalid_terminal_state'; end if;
  select * into v_attempt from public.architecture_review_usage_attempts
    where request_id=p_request_id and user_id=p_user_id for update;
  if not found then return 'missing'; end if;
  if v_attempt.state <> 'reserved' then return v_attempt.state; end if;
  update public.architecture_review_usage_attempts set state=p_terminal_state,provider_outcome=p_provider_outcome,
    failure_category=p_failure_category,input_token_count=p_input_tokens,output_token_count=p_output_tokens,
    total_token_count=p_total_tokens,post_call_cost_estimate_micro_usd=p_post_call_cost_estimate_micro_usd,
    cost_estimate_status=coalesce(p_cost_estimate_status,cost_estimate_status),updated_at=now()
    where request_id=p_request_id;
  update public.architecture_review_usage_periods set reserved_count=greatest(0,reserved_count-1),
    consumed_count=consumed_count+case when p_terminal_state='consumed' then 1 else 0 end,updated_at=now()
    where id=v_attempt.usage_period_id;
  return p_terminal_state;
end $$;

create or replace function public.cleanup_architecture_review_operational_metadata(p_before timestamptz default now()-interval '180 days')
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare v_count integer;
begin
  delete from public.stripe_webhook_events where state in ('processed','failed') and updated_at < p_before;
  delete from public.architecture_review_usage_attempts where state in ('consumed','released') and updated_at < p_before;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

revoke all on function public.reserve_architecture_review(uuid,uuid,integer,text,text,text,text,text,bigint,text) from public,anon,authenticated;
revoke all on function public.mark_architecture_review_provider_started(uuid,uuid) from public,anon,authenticated;
revoke all on function public.finalize_architecture_review_attempt(uuid,uuid,text,text,text,integer,integer,integer,bigint,text) from public,anon,authenticated;
revoke all on function public.cleanup_architecture_review_operational_metadata(timestamptz) from public,anon,authenticated;
grant execute on function public.reserve_architecture_review(uuid,uuid,integer,text,text,text,text,text,bigint,text) to service_role;
grant execute on function public.mark_architecture_review_provider_started(uuid,uuid) to service_role;
grant execute on function public.finalize_architecture_review_attempt(uuid,uuid,text,text,text,integer,integer,integer,bigint,text) to service_role;
grant execute on function public.cleanup_architecture_review_operational_metadata(timestamptz) to service_role;

commit;
