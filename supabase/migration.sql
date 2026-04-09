-- Run this in your Supabase SQL Editor if you already ran schema.sql
-- Adds new columns for bot naming, goals, plan, and setup tracking

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bot_name text DEFAULT 'Nova',
  ADD COLUMN IF NOT EXISTS goal text DEFAULT '',
  ADD COLUMN IF NOT EXISTS plan text DEFAULT 'starter',
  ADD COLUMN IF NOT EXISTS setup_complete boolean DEFAULT false;

-- Create the TiquanDoh owner account with permanent plan
-- (Run AFTER creating the account via Supabase Auth → Users → Add User)
-- Replace the UUID below with the actual user ID from Auth → Users
-- UPDATE public.profiles SET plan = 'permanent', setup_complete = true WHERE id = 'PASTE-USER-UUID-HERE';
