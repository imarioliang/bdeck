-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text,
  updated_at timestamp with time zone default now(),
  
  constraint username_length check (char_length(email) >= 3)
);

-- Row Level Security (RLS) for Profiles
alter table profiles enable row level security;

-- Policies for Profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
  on profiles for select 
  using ( auth.uid() = id );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" 
  on profiles for insert 
  with check ( auth.uid() = id );

-- User Settings Table (for theme, etc.)
create table if not exists user_settings (
  user_id uuid references auth.users not null primary key,
  theme text default 'amber',
  font_size text default 'standard',
  active_category text default 'ALL SYSTEMS',
  updated_at timestamp with time zone default now()
);

alter table user_settings enable row level security;

-- Policies for User Settings
drop policy if exists "Users can view own settings" on public.user_settings;
create policy "Users can view own settings" on user_settings for select using (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on public.user_settings;
create policy "Users can update own settings" on user_settings for update using (auth.uid() = user_id);

drop policy if exists "Users can insert own settings" on public.user_settings;
create policy "Users can insert own settings" on user_settings for insert with check (auth.uid() = user_id);

-- Links Table
create table if not exists links (
  id text not null, -- using text to match local storage IDs (e.g. 'link-123')
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  category text,
  tags text[], -- added tags support
  is_pinned boolean default false,
  position integer, -- for sorting
  updated_at timestamp with time zone default now(),
  
  primary key (id, user_id) -- composite key
);

alter table links enable row level security;

-- Policies for Links
drop policy if exists "Users can view own links" on public.links;
create policy "Users can view own links" on links for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own links" on public.links;
create policy "Users can insert own links" on links for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own links" on public.links;
create policy "Users can update own links" on links for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own links" on public.links;
create policy "Users can delete own links" on links for delete using (auth.uid() = user_id);

-- Todos Table
create table if not exists todos (
  id text not null,
  user_id uuid references auth.users not null,
  text text,
  done boolean default false,
  level integer default 0,
  position integer,
  updated_at timestamp with time zone default now(),
  
  primary key (id, user_id)
);

alter table todos enable row level security;

-- Policies for Todos
drop policy if exists "Users can view own todos" on public.todos;
create policy "Users can view own todos" on todos for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own todos" on public.todos;
create policy "Users can insert own todos" on todos for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own todos" on public.todos;
create policy "Users can update own todos" on todos for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own todos" on public.todos;
create policy "Users can delete own todos" on todos for delete using (auth.uid() = user_id);

-- Notes Table (supports multiple notes per user)
create table if not exists notes (
  id text not null, -- Unique ID for each note
  user_id uuid references auth.users not null,
  content text,
  position integer, -- For sorting
  updated_at timestamp with time zone default now(),
  
  primary key (id, user_id) -- Composite key
);

alter table notes enable row level security;

-- Policies for Notes
drop policy if exists "Users can view own notes" on public.notes;
create policy "Users can view own notes" on notes for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own notes" on public.notes;
create policy "Users can insert own notes" on notes for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own notes" on public.notes;
create policy "Users can update own notes" on notes for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own notes" on public.notes;
create policy "Users can delete own notes" on notes for delete using (auth.uid() = user_id);

-- Timers Table
create table if not exists timers (
  id text not null,
  user_id uuid references auth.users not null,
  name text,
  time integer default 0,
  is_active boolean default false,
  session_start_time bigint default 0,
  position integer,
  updated_at timestamp with time zone default now(),
  
  primary key (id, user_id)
);

alter table timers enable row level security;

-- Policies for Timers
drop policy if exists "Users can view own timers" on public.timers;
create policy "Users can view own timers" on timers for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own timers" on public.timers;
create policy "Users can insert own timers" on timers for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own timers" on public.timers;
create policy "Users can update own timers" on timers for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own timers" on public.timers;
create policy "Users can delete own timers" on timers for delete using (auth.uid() = user_id);

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  
  insert into public.user_settings (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();