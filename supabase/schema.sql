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
create policy "own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "own entitlements" on public.entitlements;
create policy "own entitlements" on public.entitlements for select using (auth.uid() = user_id);
drop policy if exists "insert own events" on public.events;
create policy "insert own events" on public.events for insert with check (user_id is null or auth.uid() = user_id);

-- Functions the browser may call
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.claim_session(p_session text) returns void
language sql security definer set search_path = '' as $$
  insert into public.active_sessions (user_id, session_id, updated_at)
  values (auth.uid(), p_session, now())
  on conflict (user_id) do update set session_id = excluded.session_id, updated_at = now();
$$;

create or replace function public.is_active_session(p_session text) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select session_id = p_session from public.active_sessions where user_id = auth.uid()), true);
$$;

revoke all on function public.claim_session(text) from anon;
revoke all on function public.is_active_session(text) from anon;

-- Admin dashboard numbers (admins only)
create or replace function public.admin_stats() returns json
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return json_build_object(
    'users', (select count(*) from public.profiles),
    'users_today', (select count(*) from public.profiles where created_at > now() - interval '1 day'),
    'sales', (select count(*) from public.entitlements where payment_id is not null),
    'revenue_paise', (select coalesce(sum(amount_paise), 0) from public.entitlements where payment_id is not null),
    'sales_by_paper', (select coalesce(json_object_agg(paper, n), '{}'::json) from (select paper, count(*) n from public.entitlements group by paper) x),
    'logins_today', (select count(*) from public.active_sessions where updated_at > now() - interval '1 day'),
    'recent', (select coalesce(json_agg(r), '[]'::json) from (
      select p.email, e.paper, e.amount_paise, e.payment_id, e.created_at
      from public.entitlements e join public.profiles p on p.id = e.user_id
      order by e.created_at desc limit 50) r)
  );
end $$;
