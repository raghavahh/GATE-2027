-- GATE A–Z topic notes (locked like videos). Run after schema.sql: SQL Editor → paste → Run.

create table if not exists public.topic_notes (
  topic_id text primary key,         -- e.g. cs-operating-system--deadlock, ga-verbal-aptitude--tenses
  sample boolean not null default false,
  notes jsonb not null               -- {s, p[], f[[formula, note]], m[], q}
);
alter table public.topic_notes enable row level security;   -- no policies: never readable directly

-- Free sample topics: anyone. Everything else: owner of the paper, from their one active login.
-- General Aptitude (ga-*) topics belong to every paper.
create or replace function public.get_topic_notes(p_paper text, p_topic text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare r public.topic_notes%rowtype;
begin
  select * into r from public.topic_notes t where t.topic_id = p_topic;
  if not found then return null; end if;
  if r.sample then return r.notes; end if;
  if auth.uid() is null then raise exception 'sign in required'; end if;
  -- Plain prefix comparison (no LIKE wildcards): a topic belongs to its paper, GA topics to every paper.
  if not (starts_with(p_topic, p_paper || '-') or starts_with(p_topic, 'ga-')) then raise exception 'wrong paper'; end if;
  if not exists (
    select 1 from public.entitlements e
    where e.user_id = auth.uid() and e.paper = p_paper and e.expires_at > now()
  ) then raise exception 'not purchased'; end if;
  if exists (
    select 1 from public.active_sessions s
    where s.user_id = auth.uid() and s.session_id <> coalesce(auth.jwt() ->> 'session_id', '')
  ) then raise exception 'signed in elsewhere'; end if;
  return r.notes;
end $$;

grant execute on function public.get_topic_notes(text, text) to anon, authenticated;   -- anon: free sample topics
revoke all on public.topic_notes from anon, authenticated;
