-- ============================================================
-- Migration 002: City Slots + Social Tokens
-- Run in: Supabase SQL Editor (https://supabase.com/dashboard)
-- Safe: all additive — no existing tables/columns altered
-- ============================================================

-- ── 1. city_slots table ────────────────────────────────────────────────────────
create table if not exists public.city_slots (
  city_slug    text primary key,          -- normalized: "miami-fl", "dallas-tx"
  city_display text not null,             -- "Miami, FL"
  active_count integer not null default 0,
  max_slots    integer not null default 30,
  created_at   timestamp with time zone default now()
);

-- Only service role can insert/update city_slots (admin-only writes)
alter table public.city_slots enable row level security;
create policy "Anyone can read city slots" on public.city_slots
  for select using (true);
create policy "Service role can manage city slots" on public.city_slots
  for all using (auth.role() = 'service_role');

-- ── 2. social_tokens table ─────────────────────────────────────────────────────
create table if not exists public.social_tokens (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete cascade not null,
  platform          text not null,        -- 'facebook', 'instagram', 'twitter', 'tiktok'
  access_token      text not null,
  refresh_token     text,
  expires_at        timestamp with time zone,
  platform_user_id  text,
  platform_username text,
  page_id           text,                 -- Facebook Page ID (for Messenger/Instagram)
  page_name         text,
  page_access_token text,                 -- Facebook Page-level token (separate from user token)
  created_at        timestamp with time zone default now(),
  updated_at        timestamp with time zone default now(),
  unique(user_id, platform)
);

alter table public.social_tokens enable row level security;
create policy "Users can view own tokens" on public.social_tokens
  for select using (auth.uid() = user_id);
create policy "Users can delete own tokens" on public.social_tokens
  for delete using (auth.uid() = user_id);
-- Inserts/updates only via service role (OAuth callbacks run server-side)
create policy "Service role manages tokens" on public.social_tokens
  for all using (auth.role() = 'service_role');

-- ── 3. New columns on profiles ─────────────────────────────────────────────────
alter table public.profiles
  add column if not exists city_slug       text    default '',
  add column if not exists last_lead_run   timestamp with time zone,
  add column if not exists lead_run_count  integer default 0;

-- ── 4. RPC: claim_city_slot (atomic) ───────────────────────────────────────────
-- Called from /api/city/claim — prevents race conditions at 30-seat cap
create or replace function public.claim_city_slot(
  p_city_slug    text,
  p_city_display text,
  p_user_id      uuid,
  p_max_slots    integer default 30
)
returns json
language plpgsql
security definer
as $$
declare
  v_count   integer;
  v_already boolean;
begin
  -- Idempotent: if user already claimed this city, succeed quietly
  select (city_slug = p_city_slug) into v_already
  from public.profiles where id = p_user_id;

  if v_already then
    return json_build_object('success', true, 'message', 'Already claimed');
  end if;

  -- Upsert row so we can lock it
  insert into public.city_slots (city_slug, city_display, active_count, max_slots)
  values (p_city_slug, p_city_display, 0, p_max_slots)
  on conflict (city_slug) do nothing;

  -- Lock the row for this transaction
  select active_count into v_count
  from public.city_slots
  where city_slug = p_city_slug
  for update;

  if v_count >= p_max_slots then
    return json_build_object('success', false, 'message', 'City is full', 'spotsLeft', 0);
  end if;

  -- Claim the slot
  update public.city_slots
  set active_count = active_count + 1
  where city_slug = p_city_slug;

  -- Stamp the user's profile
  update public.profiles
  set city_slug = p_city_slug
  where id = p_user_id;

  return json_build_object(
    'success', true,
    'spotsLeft', p_max_slots - v_count - 1,
    'message', 'Slot claimed'
  );
end;
$$;
