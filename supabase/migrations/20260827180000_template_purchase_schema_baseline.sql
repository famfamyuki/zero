begin;

-- These tables predate repository-managed migrations. Bootstrap them on a new
-- project, but validate (rather than silently accepting) an existing schema.
do $$
begin
  if to_regclass('public.templates') is null then
    create table public.templates (
      id text primary key,
      title text not null,
      title_en text,
      title_ja text,
      description text not null,
      description_en text,
      description_ja text,
      category text,
      preview_nodes_count jsonb,
      graph_data jsonb not null
    );
  end if;

  if to_regclass('public.purchases') is null then
    create table public.purchases (
      stripe_session_id text primary key,
      template_id text,
      amount integer,
      customer_email text,
      created_at timestamptz not null default now()
    );
  end if;
end $$;

do $$
declare
  v_problem text;
begin
  with expected(table_name, column_name, udt_name, is_nullable) as (
    values
      ('templates', 'id', 'text', 'NO'),
      ('templates', 'title', 'text', 'NO'),
      ('templates', 'title_en', 'text', 'YES'),
      ('templates', 'title_ja', 'text', 'YES'),
      ('templates', 'description', 'text', 'NO'),
      ('templates', 'description_en', 'text', 'YES'),
      ('templates', 'description_ja', 'text', 'YES'),
      ('templates', 'category', 'text', 'YES'),
      ('templates', 'preview_nodes_count', 'jsonb', 'YES'),
      ('templates', 'graph_data', 'jsonb', 'NO'),
      ('purchases', 'stripe_session_id', 'text', 'NO'),
      ('purchases', 'template_id', 'text', 'YES'),
      ('purchases', 'amount', 'int4', 'YES'),
      ('purchases', 'customer_email', 'text', 'YES'),
      ('purchases', 'created_at', 'timestamptz', 'NO')
  )
  select string_agg(format('%I.%I expected %s nullable=%s, found %s nullable=%s',
      e.table_name, e.column_name, e.udt_name, e.is_nullable,
      coalesce(c.udt_name, '<missing>'), coalesce(c.is_nullable, '<missing>')), '; ')
    into v_problem
    from expected e
    left join information_schema.columns c
      on c.table_schema = 'public'
      and c.table_name = e.table_name
      and c.column_name = e.column_name
    where c.column_name is null
      or c.udt_name <> e.udt_name
      or c.is_nullable <> e.is_nullable;

  if v_problem is not null then
    raise exception 'template/purchase schema is incompatible: %', v_problem;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.templates'::regclass
      and contype = 'p'
      and conkey = array[(select attnum from pg_attribute where attrelid = 'public.templates'::regclass and attname = 'id')]::smallint[]
  ) then
    raise exception 'template/purchase schema is incompatible: templates.id must be the primary key';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.purchases'::regclass
      and contype = 'p'
      and conkey = array[(select attnum from pg_attribute where attrelid = 'public.purchases'::regclass and attname = 'stripe_session_id')]::smallint[]
  ) then
    raise exception 'template/purchase schema is incompatible: purchases.stripe_session_id must be the primary key';
  end if;
end $$;

alter table public.templates enable row level security;
alter table public.purchases enable row level security;

revoke all on public.templates from anon, authenticated;
revoke all on public.purchases from anon, authenticated;
grant select on public.templates to anon, authenticated;
grant select, insert, update, delete on public.templates to service_role;
grant select, insert, update, delete on public.purchases to service_role;

drop policy if exists templates_public_read on public.templates;
create policy templates_public_read on public.templates
  for select to anon, authenticated
  using (true);

commit;
