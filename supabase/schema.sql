create extension if not exists pgcrypto;

create type app_role as enum ('technician', 'supervisor', 'admin');
create type membership_status as enum ('invited', 'active', 'suspended');
create type notification_type as enum ('success', 'error', 'warning', 'info');
create type notification_category as enum ('report', 'review', 'signature', 'billing', 'system', 'team');
create type presence_status as enum ('online', 'away', 'offline');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  billing_email text,
  plan_name text not null default 'starter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  email text not null unique,
  full_name text not null,
  role app_role not null default 'technician',
  job_title text,
  department text,
  phone text,
  avatar_url text,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role app_role not null,
  status membership_status not null default 'active',
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  legal_name text,
  tax_id text,
  city text,
  sector text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  sla_policy text default '8h',
  hourly_rate numeric(10,2) not null default 50,
  monthly_hours integer not null default 0,
  recurring_issues integer not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  role_label text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  label text not null,
  color text default '#0ea5e9',
  created_at timestamptz not null default now(),
  unique (organization_id, label)
);

create table if not exists public.work_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  report_number text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  technician_profile_id uuid not null references public.profiles(id) on delete restrict,
  reviewer_profile_id uuid references public.profiles(id) on delete set null,
  work_date date not null,
  work_type text not null,
  category_name text not null,
  priority text not null check (priority in ('Alta', 'Media', 'Baja')),
  status text not null check (status in ('Pendiente', 'Resuelto', 'En seguimiento', 'Cerrado')),
  start_time time not null,
  end_time time not null,
  duration_hours numeric(8,2) not null default 0,
  reason text not null,
  work_done text not null,
  solution text,
  observations text,
  has_signature boolean not null default false,
  client_signature_name text,
  client_signature_data_url text,
  signed_at timestamptz,
  attachments_count integer not null default 0,
  hourly_rate numeric(10,2) not null default 50,
  maintenance_included boolean not null default true,
  tags jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_report_status_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.work_reports(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references public.profiles(id),
  changed_at timestamptz not null default now(),
  note text
);

create table if not exists public.work_report_comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.work_reports(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.work_reports(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  file_name text not null,
  file_path text not null,
  mime_type text,
  file_size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null unique references public.work_reports(id) on delete cascade,
  signer_name text not null,
  signer_role text,
  signed_at timestamptz not null default now(),
  signature_data_url text
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  report_id uuid references public.work_reports(id) on delete set null,
  invoice_number text not null unique,
  status text not null default 'draft',
  currency text not null default 'EUR',
  subtotal numeric(10,2) not null default 0,
  tax_total numeric(10,2) not null default 0,
  grand_total numeric(10,2) not null default 0,
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(10,2) not null default 0,
  line_total numeric(10,2) not null default 0
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  recipient_user_id uuid not null references public.profiles(id) on delete cascade,
  actor_user_id uuid references public.profiles(id) on delete set null,
  type notification_type not null,
  category notification_category not null,
  title text not null,
  message text not null,
  link text,
  email_fallback_due_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_reads (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (notification_id, user_id)
);

create table if not exists public.user_presence (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status presence_status not null default 'offline',
  last_seen_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  favorite_view text not null default '/app/dashboard',
  reduced_motion boolean not null default true,
  compact_tables boolean not null default false,
  saved_filters jsonb not null default '[]'::jsonb,
  recent_client_ids jsonb not null default '[]'::jsonb,
  recent_report_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_filters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scope text not null,
  name text not null,
  query jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.recent_activity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_user_id uuid references public.profiles(id) on delete set null,
  actor_name text not null,
  event_type text not null,
  entity_type text not null,
  entity_id text not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  entity_type text not null,
  entity_id text not null,
  ip_address inet,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sla_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  priority text not null,
  response_minutes integer not null,
  resolution_minutes integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.report_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id),
  name text not null,
  category_name text,
  default_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create trigger organizations_set_updated_at before update on public.organizations for each row execute procedure public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger clients_set_updated_at before update on public.clients for each row execute procedure public.set_updated_at();
create trigger reports_set_updated_at before update on public.work_reports for each row execute procedure public.set_updated_at();
create trigger invoices_set_updated_at before update on public.invoices for each row execute procedure public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.clients enable row level security;
alter table public.work_reports enable row level security;
alter table public.work_report_comments enable row level security;
alter table public.notifications enable row level security;
alter table public.user_presence enable row level security;
alter table public.user_preferences enable row level security;
alter table public.recent_activity enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_same_org"
on public.profiles for select
using (
  id = auth.uid()
  or organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

create policy "profiles_manage_self"
on public.profiles for all
using (id = auth.uid())
with check (id = auth.uid());

create policy "members_select_same_org"
on public.organization_members for select
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

create policy "clients_same_org"
on public.clients for all
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid() and status = 'active'
  )
)
with check (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

create policy "reports_same_org"
on public.work_reports for all
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid() and status = 'active'
  )
)
with check (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

create policy "comments_same_org"
on public.work_report_comments for all
using (
  exists (
    select 1
    from public.work_reports wr
    where wr.id = report_id
      and wr.organization_id in (
        select organization_id
        from public.organization_members
        where user_id = auth.uid() and status = 'active'
      )
  )
)
with check (author_id = auth.uid());

create policy "notifications_self"
on public.notifications for select
using (recipient_user_id = auth.uid());

create policy "notifications_update_self"
on public.notifications for update
using (recipient_user_id = auth.uid())
with check (recipient_user_id = auth.uid());

create policy "presence_same_org"
on public.user_presence for all
using (
  user_id = auth.uid()
  or user_id in (
    select user_id
    from public.organization_members
    where organization_id in (
      select organization_id
      from public.organization_members
      where user_id = auth.uid() and status = 'active'
    )
  )
)
with check (user_id = auth.uid());

create policy "preferences_self"
on public.user_preferences for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "activity_same_org"
on public.recent_activity for select
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

create policy "audit_admin_only"
on public.audit_logs for select
using (
  exists (
    select 1
    from public.organization_members
    where user_id = auth.uid()
      and status = 'active'
      and role = 'admin'
      and organization_id = audit_logs.organization_id
  )
);
