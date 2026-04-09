-- Run this in your Supabase SQL Editor

-- Profiles table (one per user)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  business_name text default '',
  name text default '',
  industry text default 'Business',
  niche text default '',
  location text default '',
  email text default '',
  phone text default '',
  website text default '',
  bio text default '',
  social_instagram text default '',
  social_tiktok text default '',
  social_youtube text default '',
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can only read/write their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Leads table (many per user)
create table if not exists public.leads (
  id text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  handle text,
  avatar_url text,
  location text default '',
  lead_type text default 'B2C',
  phone text,
  email text,
  profile_url text,
  outreach_channel text default '',
  instagram text,
  twitter text,
  facebook text,
  linkedin text,
  tiktok text,
  source text default '',
  intent_signal text default '',
  posted_at text,
  status text default 'Warm',
  intent_score integer default 50,
  urgency_score integer default 50,
  why_they_need_you text default '',
  suggested_first_message text default '',
  business_type text default '',
  market text default '',
  created_at timestamp with time zone default now(),
  primary key (id, user_id)
);

alter table public.leads enable row level security;

create policy "Users can manage own leads" on public.leads
  for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
