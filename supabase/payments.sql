-- GATE A–Z payments. Run AFTER schema.sql: Supabase → SQL Editor → paste → Run.

create table if not exists public.orders (
  id text primary key,                       -- Razorpay order id
  user_id uuid not null references auth.users(id) on delete cascade,
  paper text not null,
  edition text not null default 'GATE 2027',
  amount_paise int not null,
  status text not null default 'created',    -- created | paid
  payment_id text,
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
drop policy if exists "own orders" on public.orders;
create policy "own orders" on public.orders for select using (auth.uid() = user_id);

create table if not exists public.webhook_events (
  id text primary key,                       -- x-razorpay-event-id, processed once
  received_at timestamptz not null default now()
);
alter table public.webhook_events enable row level security;  -- no policies: server only

-- Grants a paper. Idempotent: the same payment can never grant twice.
-- Only callable with the service key (Edge Functions), never from the browser.
create or replace function public.grant_paper(p_order text, p_payment text, p_amount int, p_expires timestamptz)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.orders%rowtype;
begin
  select * into o from public.orders where id = p_order for update;
  if not found or o.amount_paise <> p_amount then return false; end if;
  update public.orders set status = 'paid', payment_id = p_payment where id = p_order;
  insert into public.entitlements (user_id, paper, edition, expires_at, payment_id, amount_paise)
  values (o.user_id, o.paper, o.edition, p_expires, p_payment, p_amount)
  on conflict (user_id, paper, edition) do update set expires_at = greatest(public.entitlements.expires_at, excluded.expires_at);
  return true;
end $$;

revoke all on function public.grant_paper(text, text, int, timestamptz) from public, anon, authenticated;
