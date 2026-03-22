create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum (
      'draft',
      'approved',
      'hold',
      'needs_revision',
      'posted',
      'archived'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'content_format_type') then
    create type public.content_format_type as enum (
      'carousel',
      'single_image',
      'short_video',
      'article',
      'infographic'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'channel_key') then
    create type public.channel_key as enum (
      'instagram',
      'threads',
      'linkedin',
      'blog'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'channel_copy_status') then
    create type public.channel_copy_status as enum (
      'generated',
      'posted'
    );
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  full_name text not null,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Hospital SNS Admin'),
    'admin'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  target_audience text not null,
  format_type public.content_format_type not null,
  core_message text not null,
  hooks_preview text[] not null default array[]::text[],
  body_draft text not null,
  ctas_preview text[] not null default array[]::text[],
  production_guide text not null,
  expected_reaction_points text not null,
  status public.content_status not null default 'draft',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create table if not exists public.content_hooks (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  hook_text text not null,
  position smallint not null check (position between 1 and 3),
  unique (content_item_id, position)
);

create table if not exists public.content_ctas (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  cta_text text not null,
  position smallint not null check (position between 1 and 2),
  unique (content_item_id, position)
);

create table if not exists public.content_tags (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  tag text not null,
  unique (content_item_id, tag)
);

create table if not exists public.channel_copies (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  channel public.channel_key not null,
  copy_text text not null,
  hashtags text[] not null default array[]::text[],
  call_to_action text not null,
  status public.channel_copy_status not null default 'generated',
  generated_at timestamptz not null default timezone('utc', now()),
  posted_at timestamptz,
  unique (content_item_id, channel)
);

create table if not exists public.content_assets (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  label text not null,
  asset_type text not null check (asset_type in ('image', 'video', 'document')),
  url text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.approval_logs (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  from_status public.content_status,
  to_status public.content_status not null,
  note text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.performance_metrics (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  channel public.channel_key not null,
  impressions bigint not null default 0 check (impressions >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  saves bigint not null default 0 check (saves >= 0),
  shares bigint not null default 0 check (shares >= 0),
  comments bigint not null default 0 check (comments >= 0),
  conversions bigint not null default 0 check (conversions >= 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (content_item_id, channel)
);

create table if not exists public.generation_settings (
  id text primary key,
  tone_of_voice text not null,
  content_cadence_per_week integer not null check (content_cadence_per_week between 1 and 7),
  target_channels text[] not null default array['instagram', 'threads', 'linkedin', 'blog'],
  hashtags_per_post integer not null default 4 check (hashtags_per_post between 0 and 15),
  default_audience text not null,
  approval_required boolean not null default true,
  prompt_guardrails text[] not null default array[]::text[],
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();

drop trigger if exists performance_metrics_set_updated_at on public.performance_metrics;
create trigger performance_metrics_set_updated_at
before update on public.performance_metrics
for each row execute function public.set_updated_at();

drop trigger if exists generation_settings_set_updated_at on public.generation_settings;
create trigger generation_settings_set_updated_at
before update on public.generation_settings
for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.content_items enable row level security;
alter table public.content_hooks enable row level security;
alter table public.content_ctas enable row level security;
alter table public.content_tags enable row level security;
alter table public.channel_copies enable row level security;
alter table public.content_assets enable row level security;
alter table public.approval_logs enable row level security;
alter table public.performance_metrics enable row level security;
alter table public.generation_settings enable row level security;

drop policy if exists "Admins can read users" on public.users;
create policy "Admins can read users"
on public.users for select
using (public.is_admin_user());

drop policy if exists "Admins can update users" on public.users;
create policy "Admins can update users"
on public.users for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can read content items" on public.content_items;
create policy "Admins can read content items"
on public.content_items for select
using (public.is_admin_user());

drop policy if exists "Admins can insert content items" on public.content_items;
create policy "Admins can insert content items"
on public.content_items for insert
with check (public.is_admin_user());

drop policy if exists "Admins can update content items" on public.content_items;
create policy "Admins can update content items"
on public.content_items for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can delete content items" on public.content_items;
create policy "Admins can delete content items"
on public.content_items for delete
using (public.is_admin_user());

drop policy if exists "Admins can read hooks" on public.content_hooks;
create policy "Admins can read hooks"
on public.content_hooks for select
using (public.is_admin_user());

drop policy if exists "Admins can manage hooks" on public.content_hooks;
create policy "Admins can manage hooks"
on public.content_hooks for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can read ctas" on public.content_ctas;
create policy "Admins can read ctas"
on public.content_ctas for select
using (public.is_admin_user());

drop policy if exists "Admins can manage ctas" on public.content_ctas;
create policy "Admins can manage ctas"
on public.content_ctas for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can read tags" on public.content_tags;
create policy "Admins can read tags"
on public.content_tags for select
using (public.is_admin_user());

drop policy if exists "Admins can manage tags" on public.content_tags;
create policy "Admins can manage tags"
on public.content_tags for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can read channel copies" on public.channel_copies;
create policy "Admins can read channel copies"
on public.channel_copies for select
using (public.is_admin_user());

drop policy if exists "Admins can insert channel copies for approved content" on public.channel_copies;
create policy "Admins can insert channel copies for approved content"
on public.channel_copies for insert
with check (
  public.is_admin_user()
  and exists (
    select 1
    from public.content_items ci
    where ci.id = channel_copies.content_item_id
      and ci.status in ('approved', 'posted')
  )
);

drop policy if exists "Admins can update channel copies" on public.channel_copies;
create policy "Admins can update channel copies"
on public.channel_copies for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can delete channel copies" on public.channel_copies;
create policy "Admins can delete channel copies"
on public.channel_copies for delete
using (public.is_admin_user());

drop policy if exists "Admins can read assets" on public.content_assets;
create policy "Admins can read assets"
on public.content_assets for select
using (public.is_admin_user());

drop policy if exists "Admins can manage assets" on public.content_assets;
create policy "Admins can manage assets"
on public.content_assets for all
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can read approval logs" on public.approval_logs;
create policy "Admins can read approval logs"
on public.approval_logs for select
using (public.is_admin_user());

drop policy if exists "Admins can insert approval logs" on public.approval_logs;
create policy "Admins can insert approval logs"
on public.approval_logs for insert
with check (public.is_admin_user());

drop policy if exists "Admins can read metrics" on public.performance_metrics;
create policy "Admins can read metrics"
on public.performance_metrics for select
using (public.is_admin_user());

drop policy if exists "Admins can manage posted metrics" on public.performance_metrics;
create policy "Admins can manage posted metrics"
on public.performance_metrics for all
using (public.is_admin_user())
with check (
  public.is_admin_user()
  and exists (
    select 1
    from public.content_items ci
    where ci.id = performance_metrics.content_item_id
      and ci.status = 'posted'
  )
);

drop policy if exists "Admins can read generation settings" on public.generation_settings;
create policy "Admins can read generation settings"
on public.generation_settings for select
using (public.is_admin_user());

drop policy if exists "Admins can manage generation settings" on public.generation_settings;
create policy "Admins can manage generation settings"
on public.generation_settings for all
using (public.is_admin_user())
with check (public.is_admin_user());

