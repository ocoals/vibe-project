-- whenwemeet phase 1: events / responses (spec.md section 5) + RLS for anon

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  dates date[] not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now()
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  participant_name text not null,
  available_slots jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint responses_event_id_participant_name_key unique (event_id, participant_name)
);

-- 테이블이 예전 스키마로만 있을 때 unique 보강
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'responses_event_id_participant_name_key'
      and conrelid = 'public.responses'::regclass
  ) then
    alter table public.responses
      add constraint responses_event_id_participant_name_key unique (event_id, participant_name);
  end if;
end $$;

alter table public.events enable row level security;
alter table public.responses enable row level security;

drop policy if exists events_anon_select on public.events;
drop policy if exists events_anon_insert on public.events;
drop policy if exists responses_anon_select on public.responses;
drop policy if exists responses_anon_insert on public.responses;
drop policy if exists responses_anon_update on public.responses;

create policy events_anon_select
  on public.events
  for select
  to anon
  using (true);

create policy events_anon_insert
  on public.events
  for insert
  to anon
  with check (true);

create policy responses_anon_select
  on public.responses
  for select
  to anon
  using (true);

create policy responses_anon_insert
  on public.responses
  for insert
  to anon
  with check (true);

create policy responses_anon_update
  on public.responses
  for update
  to anon
  using (true)
  with check (true);
