-- GATE A–Z paid content (the real lock). Run after schema.sql: SQL Editor → paste → Run.

create table if not exists public.topic_videos (
  paper text not null,
  topic_id text not null,
  videos jsonb not null,             -- [{id, title, channel}]
  primary key (paper, topic_id)
);
alter table public.topic_videos enable row level security;   -- no policies: never readable directly

-- Returns a topic's videos only if the caller owns the paper (not expired)
-- AND this request comes from their one active login.
-- Not STABLE: it records a topic_view event, and Postgres forbids INSERT inside STABLE functions.
create or replace function public.get_topic_videos(p_paper text, p_topic text) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare v jsonb;
begin
  if auth.uid() is null then raise exception 'sign in required'; end if;
  if not exists (
    select 1 from public.entitlements e
    where e.user_id = auth.uid() and e.paper = p_paper and e.expires_at > now()
  ) then raise exception 'not purchased'; end if;
  if exists (
    select 1 from public.active_sessions s
    where s.user_id = auth.uid() and s.session_id <> coalesce(auth.jwt() ->> 'session_id', '')
  ) then raise exception 'signed in elsewhere'; end if;
  select t.videos into v from public.topic_videos t where t.paper = p_paper and t.topic_id = p_topic;
  -- One view per person and topic per 30 minutes, so repeated calls can't flood the table.
  if not exists (
    select 1 from public.events e
    where e.user_id = auth.uid() and e.topic = p_topic and e.name = 'topic_view' and e.created_at > now() - interval '30 minutes'
  ) then
    insert into public.events (user_id, name, paper, topic) values (auth.uid(), 'topic_view', p_paper, p_topic);
  end if;
  return coalesce(v, '[]'::jsonb);
end $$;

create index if not exists events_user_topic_idx on public.events(user_id, topic, created_at desc);

revoke execute on function public.get_topic_videos(text, text) from public, anon;
grant execute on function public.get_topic_videos(text, text) to authenticated;
revoke all on public.topic_videos from anon, authenticated;
