create extension if not exists pgcrypto;
create extension if not exists citext;

create type app_role as enum ('technician', 'supervisor', 'admin');
create type activity_type as enum (
  'client_created',
  'report_created',
  'report_updated',
  'report_deleted',
  'filters_updated',
  'view_changed'
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext not null unique,
  tax_id citext,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  full_name text not null,
  email citext not null,
  normalized_email citext generated always as (lower(email::text)::citext) stored,
  role app_role not null default 'technician',
  avatar_url text,
  auth_source text not null default 'supabase',
  is_active boolean not null default true,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_unique unique (normalized_email)
);

create table if not exists technicians (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  hourly_cost numeric(10,2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists supervisors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  area text,
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  name text not null,
  normalized_name citext generated always as (lower(name)::citext) stored,
  legal_name text,
  contact_name text,
  contact_email citext,
  phone text,
  city text,
  sector text,
  sla_hours integer default 8,
  hourly_rate numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists clients_org_name_unique
on clients (organization_id, normalized_name);

create table if not exists work_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

create table if not exists work_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text,
  is_closed boolean not null default false
);

create table if not exists work_reports (
  id uuid primary key default gen_random_uuid(),
  report_number text not null unique,
  organization_id uuid references organizations(id) on delete set null,
  work_date date not null,
  technician_id uuid not null references technicians(id),
  client_id uuid not null references clients(id),
  contact_name text,
  work_type text not null,
  category_id uuid references work_categories(id),
  priority text not null,
  start_time time not null,
  end_time time not null,
  duration_minutes integer generated always as (
    greatest(extract(epoch from ((end_time::interval) - (start_time::interval))) / 60, 0)
  ) stored,
  reason text not null,
  work_done text not null,
  solution text,
  observations text,
  status_id uuid references work_statuses(id),
  customer_signature_url text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists report_status_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references work_reports(id) on delete cascade,
  status_id uuid not null references work_statuses(id),
  changed_by uuid references profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references work_reports(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  mime_type text,
  uploaded_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references work_reports(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  report_id uuid unique references work_reports(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  invoice_number text not null unique,
  subtotal numeric(12,2) not null,
  tax_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  issued_at timestamptz not null default now(),
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists user_preferences (
  profile_id uuid primary key references profiles(id) on delete cascade,
  favorite_view text default '/app/dashboard',
  last_visited_route text default '/app/dashboard',
  recent_clients jsonb not null default '[]'::jsonb,
  recent_technicians jsonb not null default '[]'::jsonb,
  recent_searches jsonb not null default '[]'::jsonb,
  saved_report_filters jsonb not null default '{}'::jsonb,
  report_draft jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  organization_id uuid references organizations(id) on delete set null,
  activity_type activity_type not null,
  entity_type text not null,
  entity_id uuid,
  title text not null,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organizations_updated_at on organizations;
create trigger organizations_updated_at before update on organizations
for each row execute procedure handle_updated_at();

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at before update on profiles
for each row execute procedure handle_updated_at();

drop trigger if exists clients_updated_at on clients;
create trigger clients_updated_at before update on clients
for each row execute procedure handle_updated_at();

drop trigger if exists work_reports_updated_at on work_reports;
create trigger work_reports_updated_at before update on work_reports
for each row execute procedure handle_updated_at();

drop trigger if exists user_preferences_updated_at on user_preferences;
create trigger user_preferences_updated_at before update on user_preferences
for each row execute procedure handle_updated_at();

alter table profiles enable row level security;
alter table work_reports enable row level security;
alter table user_preferences enable row level security;
alter table activity_logs enable row level security;

create policy "Profiles can read themselves"
on profiles for select
using (auth.uid() = id);

create policy "Profiles can update own preferences"
on user_preferences for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "Users can read own activity"
on activity_logs for select
using (auth.uid() = profile_id);

create policy "Technicians can read own reports"
on work_reports for select
using (
  exists (
    select 1
    from technicians t
    where t.id = work_reports.technician_id
      and t.profile_id = auth.uid()
  )
);
