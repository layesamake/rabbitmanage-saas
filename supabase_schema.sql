-- SQL Schema for Supabase - Lapin Manager SaaS

-- 1. Create Profiles Table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  farm_name text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  trial_end timestamptz default now() + interval '14 days',
  updated_at timestamptz default now()
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Utilisateurs authentifiés peuvent lire leur propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Utilisateurs authentifiés peuvent modifier leur propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, farm_name, plan, trial_end)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Éleveur'),
    coalesce(new.raw_user_meta_data->>'farmName', 'Mon Élevage'),
    coalesce(new.raw_user_meta_data->>'plan', 'free'),
    now() + interval '14 days'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create Races Table
create table public.races (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

alter table public.races enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs propres races"
  on public.races for all using (auth.uid() = user_id);


-- 3. Create Expense Categories Table
create table public.expense_categories (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

alter table public.expense_categories enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs propres categories de depenses"
  on public.expense_categories for all using (auth.uid() = user_id);


-- 4. Create Income Categories Table
create table public.income_categories (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

alter table public.income_categories enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs propres categories de revenus"
  on public.income_categories for all using (auth.uid() = user_id);


-- 5. Create Animals Table (Cheptel)
create table public.animals (
  id text primary key, -- ex: F-012, M-004
  user_id uuid references auth.users on delete cascade not null,
  name text,
  gender text check (gender in ('M', 'F')),
  status text not null default 'Disponible',
  type text,
  location text,
  badge_color text,
  image text,
  robe text,
  age text,
  weight text,
  naissance text,
  origine text,
  cage text,
  observations text,
  created_at timestamptz default now()
);

alter table public.animals enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs propres animaux"
  on public.animals for all using (auth.uid() = user_id);


-- 6. Create Saillies Table (Reproduction)
create table public.saillies (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  female text not null,
  male text not null,
  status text not null,
  status_badge_color text,
  date text not null,
  expected_date text,
  has_control_today boolean default false,
  type text,
  created_at timestamptz default now()
);

alter table public.saillies enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs saillies"
  on public.saillies for all using (auth.uid() = user_id);


-- 7. Create Portees Table
create table public.portees (
  id text primary key, -- ex: P-014
  user_id uuid references auth.users on delete cascade not null,
  female text not null,
  status text not null default 'En cours',
  age text,
  effectif text,
  sevrage text,
  badge_color text,
  date_mise_bas text,
  total_nes integer default 0,
  nes_vivants integer default 0,
  morts_nes integer default 0,
  cage text,
  observations text,
  created_at timestamptz default now()
);

alter table public.portees enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs portees"
  on public.portees for all using (auth.uid() = user_id);


-- 8. Create Soins Table (Santé)
create table public.soins (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  animal_id text not null,
  type text not null,
  category text,
  status text not null,
  status_color text,
  date text,
  is_today boolean default false,
  is_late boolean default false,
  created_at timestamptz default now()
);

alter table public.soins enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs soins"
  on public.soins for all using (auth.uid() = user_id);


-- 9. Create Transactions Table (Finance)
create table public.transactions (
  id text primary key, -- ex: T-001 or UUID
  user_id uuid references auth.users on delete cascade not null,
  date text not null,
  type text check (type in ('INCOME', 'EXPENSE')) not null,
  category text not null,
  amount numeric not null,
  description text,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs transactions"
  on public.transactions for all using (auth.uid() = user_id);


-- 10. Create Alertes Table
create table public.alertes (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text,
  type_color text,
  subject text,
  title text not null,
  subtitle text,
  icon text,
  time text,
  primary_action text,
  secondary_action text,
  primary_color text,
  description text,
  created_at timestamptz default now()
);

alter table public.alertes enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs alertes"
  on public.alertes for all using (auth.uid() = user_id);


-- 11. Create Team Members Table (Enterprise Collaboration)
create table public.team_members (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null, -- Farm owner id
  name text not null,
  email text not null,
  role text not null check (role in ('Propriétaire', 'Gérant', 'Ouvrier')),
  status text default 'En attente' check (status in ('Actif', 'En attente')),
  created_at timestamptz default now()
);

alter table public.team_members enable row level security;
create policy "Utilisateurs peuvent tout faire sur leurs collaborateurs"
  on public.team_members for all using (auth.uid() = user_id);
