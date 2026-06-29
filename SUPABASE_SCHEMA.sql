-- Run this in your Supabase SQL editor to set up the schema
-- for when you migrate from localStorage to the database.

-- Obligations are seeded from the app's obligations-data.ts,
-- but you can also store them in the DB for multi-tenant use.

create table if not exists organisation_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Organisation',
  is_sdf boolean not null default false,
  industry text,
  created_at timestamptz default now()
);

create table if not exists obligation_statuses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organisation_profile(id) on delete cascade,
  obligation_id text not null,
  status text not null default 'pending' check (status in ('pending','in_progress','done','not_applicable')),
  notes text,
  assignee text,
  updated_at timestamptz default now(),
  unique(org_id, obligation_id)
);

create table if not exists breach_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organisation_profile(id) on delete cascade,
  title text not null,
  description text,
  date_discovered date not null,
  date_notified_board date,
  date_notified_principals date,
  principals_affected integer default 0,
  status text not null default 'discovered' check (status in ('discovered','notified_board','notified_principals','closed')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table organisation_profile enable row level security;
alter table obligation_statuses enable row level security;
alter table breach_log enable row level security;
