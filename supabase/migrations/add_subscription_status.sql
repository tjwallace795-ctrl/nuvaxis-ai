-- Add subscription_status to profiles table
-- Run this in your Supabase SQL Editor

alter table public.profiles
  add column if not exists subscription_status text not null default 'free',
  add column if not exists setup_complete boolean not null default false,
  add column if not exists bot_name text default 'Nova',
  add column if not exists goal text default '';

-- subscription_status values: 'free' | 'starter' | 'pro' | 'agency'
