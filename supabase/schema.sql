create type app_role as enum ('technician', 'supervisor', 'admin');

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_id text,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key,
  full_name text not null,
  email text unique not null,
  role app_role not null default 'technician',
  company_id uuid references companies(id),
  created_at timestamptz not null default now()
);

create table if not exists technicians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users(id) on delete cascade,
  hourly_cost numeric(10,2),
  active boolean not null default true
);

create table if not exists supervisors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users(id) on delete cascade,
  area text
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  name text not null,
  legal_name text,
  contact_name text,
  contact_email text,
  phone text,
  city text,
  sector text,
  sla_hours integer default 8,
  hourly_rate numeric(10,2),
  created_at timestamptz not null default now()
);

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
    extract(epoch from ((end_time::interval) - (start_time::interval))) / 60
  ) stored,
  reason text not null,
  work_done text not null,
  solution text,
  observations text,
  status_id uuid references work_statuses(id),
  customer_signature_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  user_id uuid not null references users(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table users enable row level security;
alter table work_reports enable row level security;

create policy "Users can read themselves"
on users for select
using (auth.uid() = id);

create policy "Technicians can read own reports"
on work_reports for select
using (
  exists (
    select 1
    from technicians t
    where t.id = work_reports.technician_id
      and t.user_id = auth.uid()
  )
);
