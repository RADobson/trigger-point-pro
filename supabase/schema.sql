-- Trigger Point Pro — Supabase Schema
-- Run this in the Supabase SQL Editor to set up all tables and policies.

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  business_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Sessions
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid references public.profiles(id) on delete cascade not null,
  client_name text,
  notes text,
  status text default 'active' check (status in ('active', 'completed')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.sessions enable row level security;

create policy "Therapists can view own sessions"
  on public.sessions for select using (auth.uid() = therapist_id);

create policy "Therapists can create sessions"
  on public.sessions for insert with check (auth.uid() = therapist_id);

create policy "Therapists can update own sessions"
  on public.sessions for update using (auth.uid() = therapist_id);

create policy "Therapists can delete own sessions"
  on public.sessions for delete using (auth.uid() = therapist_id);

-- Allow anonymous read for client view (clients access via session link)
create policy "Anyone can view session by id"
  on public.sessions for select using (true);

-- 3. Markers (trigger points placed by client)
create table public.markers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  x float not null,
  y float not null,
  view text not null check (view in ('front', 'back')),
  body_type text default 'male' check (body_type in ('male', 'female')),
  intensity text default 'moderate' check (intensity in ('mild', 'moderate', 'severe')),
  note text,
  created_at timestamptz default now()
);

alter table public.markers enable row level security;

-- Clients can insert markers (no auth required — they access via link)
create policy "Anyone can insert markers"
  on public.markers for insert with check (true);

-- Therapists can view markers for their sessions
create policy "Anyone can view markers"
  on public.markers for select using (true);

-- Allow marker deletion
create policy "Anyone can delete markers"
  on public.markers for delete using (true);

-- 4. Pressure signals (client feedback)
create table public.pressure_signals (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  signal text not null check (signal in ('more', 'less', 'good', 'stop')),
  created_at timestamptz default now()
);

alter table public.pressure_signals enable row level security;

create policy "Anyone can insert pressure signals"
  on public.pressure_signals for insert with check (true);

create policy "Anyone can view pressure signals"
  on public.pressure_signals for select using (true);

-- 5. Enable Realtime
alter publication supabase_realtime add table public.markers;
alter publication supabase_realtime add table public.pressure_signals;
alter publication supabase_realtime add table public.sessions;

-- 6. Indexes
create index idx_markers_session_id on public.markers(session_id);
create index idx_pressure_signals_session_id on public.pressure_signals(session_id);
create index idx_sessions_therapist_id on public.sessions(therapist_id);
create index idx_sessions_status on public.sessions(status);
