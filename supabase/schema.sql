-- GATE A–Z database. Paste this whole file into Supabase → SQL Editor → Run (once).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE.

-- 1. Profiles (one per user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  blocked boolean not null default false
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Paid access per paper (written only by the payment server function)
create table if not exists public.entitlements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  paper text not null,
  edition text not null default 'GATE 2027',
  expires_at timestamptz not null,
  payment_id text unique,
  amount_paise int not null default 31000,
  created_at timestamptz not null default now(),
  unique (user_id, paper, edition)
);

-- 3. One active login per account
create table if not exists public.active_sessions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  session_id text not null,
  updated_at timestamptz not null default now()
);

-- 4. First-party analytics events (for the admin page)
create table if not exists public.events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  paper text,
  topic text,
  created_at timestamptz not null default now()
);

-- 5. Admins
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);

-- Row Level Security: users only ever see their own rows; nobody can write entitlements from the browser.
alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.active_sessions enable row level security;
alter table public.events enable row level security;
alter table public.admins enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using ((select auth.uid()) = id);
drop policy if exists "own entitlements" on public.entitlements;
create policy "own entitlements" on public.entitlements for select using ((select auth.uid()) = user_id);
-- events are written only by server functions (get_topic_videos); the browser can't insert.
drop policy if exists "insert own events" on public.events;
create index if not exists events_user_id_idx on public.events(user_id);

-- Functions the browser may call
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- The session id is read from the caller's own token, never trusted from the browser.
create or replace function public.claim_session(p_session text) returns void
language plpgsql security definer set search_path = '' as $$
declare sid text := auth.jwt() ->> 'session_id';
begin
  if auth.uid() is null or sid is null then return; end if;
  insert into public.active_sessions (user_id, session_id, updated_at)
  values (auth.uid(), sid, now())
  on conflict (user_id) do update set session_id = excluded.session_id, updated_at = now();
end $$;

create or replace function public.is_active_session(p_session text) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select session_id = coalesce(auth.jwt() ->> 'session_id', p_session)
                   from public.active_sessions where user_id = auth.uid()), true);
$$;


-- Admin dashboard numbers (admins only)
create or replace function public.admin_stats() returns json
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return json_build_object(
    'users', (select count(*) from public.profiles),
    'users_today', (select count(*) from public.profiles where created_at > now() - interval '1 day'),
    'sales', (select count(*) from public.orders where status = 'paid'),
    'revenue_paise', (select coalesce(sum(amount_paise), 0) from public.orders where status = 'paid'),
    'sales_by_paper', (select coalesce(json_object_agg(paper, n), '{}'::json) from (select paper, count(*) n from public.entitlements group by paper) x),
    'logins_today', (select count(*) from public.active_sessions where updated_at > now() - interval '1 day'),
    'recent', (select coalesce(json_agg(r), '[]'::json) from (
      select u.email, o.paper, o.amount_paise, o.payment_id, o.created_at
      from public.orders o join auth.users u on u.id = o.user_id
      where o.status = 'paid'
      order by o.created_at desc limit 50) r)
  );
end $$;

-- Postgres lets PUBLIC (so also anon) execute every new function by default. Only signed-in users may call these.
revoke execute on function public.claim_session(text), public.is_active_session(text), public.is_admin(), public.admin_stats() from public, anon;
grant execute on function public.claim_session(text), public.is_active_session(text), public.is_admin(), public.admin_stats() to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- RLS already blocks browser writes; also remove the table-level write grants as a second lock.
revoke insert, update, delete, truncate on public.profiles, public.entitlements, public.events, public.admins from anon, authenticated;
revoke all on public.active_sessions, public.admins from anon, authenticated;

-- Profiles for accounts created before the trigger existed.
insert into public.profiles (id, email) select id, email from auth.users on conflict do nothing;
