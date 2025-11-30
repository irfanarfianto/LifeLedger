-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Drop existing policies to ensure a clean slate and avoid conflicts
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;
drop policy if exists "Users can manage their own profile" on public.profiles;

-- Create a comprehensive policy that allows users to perform ALL actions (SELECT, INSERT, UPDATE, DELETE)
-- on their own profile rows.
create policy "Users can manage their own profile"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- Ensure the profiles table exists and has the fcm_token column (idempotent)
create table if not exists public.profiles (
  id uuid references auth.users(id) not null primary key,
  fcm_token text
);

do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'fcm_token') then
    alter table public.profiles add column fcm_token text;
  end if;
end $$;
