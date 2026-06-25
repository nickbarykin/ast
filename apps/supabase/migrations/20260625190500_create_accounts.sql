create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  account_type text not null default 'personal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounts_account_type_check check (account_type in ('personal', 'team'))
);

create table public.account_members (
  account_id uuid not null references public.accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (account_id, user_id),
  constraint account_members_role_check check (role in ('owner', 'member'))
);

create index profiles_email_idx on public.profiles (email);
create index accounts_owner_user_id_idx on public.accounts (owner_user_id);
create unique index accounts_one_personal_per_owner_idx
  on public.accounts (owner_user_id)
  where account_type = 'personal';
create index account_members_user_id_idx on public.account_members (user_id);

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.account_members enable row level security;

create function public.is_account_member(target_account_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.account_members
    where account_id = target_account_id
      and user_id = auth.uid()
  );
$$;

create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Members can view their accounts"
  on public.accounts
  for select
  using (public.is_account_member(id));

create policy "Owners can update their accounts"
  on public.accounts
  for update
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

create policy "Members can view account members"
  on public.account_members
  for select
  using (public.is_account_member(account_id));

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  personal_account_id uuid;
  profile_name text;
begin
  profile_name := coalesce(
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'User'
  );

  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    profile_name,
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.accounts (owner_user_id, name, account_type)
  values (new.id, profile_name, 'personal')
  returning id into personal_account_id;

  insert into public.account_members (account_id, user_id, role)
  values (personal_account_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
