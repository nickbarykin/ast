# Supabase database

This folder keeps database migrations for the app.

## Current status

The first migration creates the account foundation:

- `public.profiles`: one profile per Supabase Auth user.
- `public.accounts`: a personal account/workspace owned by a user.
- `public.account_members`: membership rows for accounts.
- RLS policies so users can only read their own profile and accounts.
- A trigger on `auth.users` that creates a profile and personal account after signup.

Supabase Auth owns the real `auth.users` table. Application tables should reference it instead of creating a separate password/user table.

## Local setup

Supabase local development needs Docker and the Supabase CLI.

Docker is running, but installing the CLI with Homebrew failed because Xcode Command Line Tools are outdated. Fix that first:

```bash
xcode-select --install
```

If macOS does not offer an update, remove and reinstall Command Line Tools:

```bash
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```

Then install the CLI:

```bash
brew install supabase/tap/supabase
```

Initialize local Supabase config if it is not present yet:

```bash
supabase init
```

Start the local stack:

```bash
supabase start
```

Apply migrations to the local database:

```bash
supabase db reset
```

The local Supabase Studio usually opens at:

```text
http://localhost:54323
```

## Cloud setup

After creating a Supabase cloud project:

```bash
supabase login
supabase link
supabase db push
```

Keep frontend-safe values in `web/.env.local`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Keep backend-only secrets in `api/.env`:

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
