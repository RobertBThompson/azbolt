# Chief's PocketBase

The schema lives in `migrations/` as numbered files. PocketBase applies
any it has not seen when it starts, so a schema change travels with the
code that needs it and nobody has to remember to run anything.

## Running one locally

Each working copy gets its own instance, with its own port and its own
data folder, so two checkouts never share a database or fight over a
schema:

```bash
pocketbase serve \
  --http=127.0.0.1:8092 \
  --dir=C:\dev\pocketbase\chief8171 \
  --migrationsDir=C:\dev\azbolt_C\infra\pocketbase\migrations
```

Then point that checkout's dev server at it, in `apps/chief/.env.local`:

```
DEV_PORT=8171
PB_URL=http://127.0.0.1:8092
```

Chief proxies `/api` and `/_/` to it, exactly as Caddy does in
production, so the browser client needs no base URL either place.

Two things worth knowing:

- With `--migrationsDir` pointed at the repo, a collection you change in
  the dashboard writes a new migration file into the repo. That is
  usually what you want — the change becomes a commit — but it does mean
  the dashboard edits your working tree. `--automigrate=0` turns it off.
- A migration skips a collection that already exists rather than failing,
  so an instance built by hand before these files existed still starts.
  It also means such an instance keeps whatever shape it was given;
  `check-schema.mjs` says whether it matches.

## Checking an instance

```bash
node infra/pocketbase/check-schema.mjs http://127.0.0.1:8092
node infra/pocketbase/check-isolation.mjs http://127.0.0.1:8092
```

The first says whether the collections match what the client expects.
The second signs in as two accounts and tries to read each other's
records, including by guessed id, and fails loudly if either succeeds.

### A whole account

```
node infra/pocketbase/check-account.mjs http://127.0.0.1:8092
```

Writes one record in every collection as a throwaway account, checks a
second account can see none of it, then deletes the first the way the
app's "Delete account and data" does and looks for anything left
behind. Run it after any new migration: it is the quickest way to find
out that a migration did not apply or that the app and the server
disagree about a field.

## Before someone else uses it

Three things are set on the server, not in the app, and are still open
while Chief is being tested:

- **Sign-up is open.** Anyone who can reach the server can make an
  account. To close it, open `users` in the admin page, API Rules, and
  clear the Create rule (leave it locked). Accounts are then made by
  you, in the admin page.
- **Password reset needs mail.** "Forgot password" asks the server to
  send a link. It can only do that once Settings → Mail settings has an
  SMTP server.
- **The admin page is public.** `/_/` should be reachable only from
  your own address. In Caddy, wrap it in a `remote_ip` matcher.

## Backups

```bash
PB_SUPERUSER=… PB_PASSWORD=… \
  infra/pocketbase/backup.sh https://chief.155.138.240.74.nip.io /srv/backups/chief
```

It asks PocketBase for a consistent archive rather than copying a live
SQLite file, fetches it, checks it is not an empty file, and keeps 14
days. A line in the server's crontab runs it nightly:

```
17 3 * * * PB_SUPERUSER=… PB_PASSWORD=… /var/www/azbolt/infra/pocketbase/backup.sh https://chief.155.138.240.74.nip.io /srv/backups/chief >> /var/log/chief-backup.log 2>&1
```

**A backup nobody has restored is not a backup.** To test one, run a
second PocketBase on another port with an empty data folder, upload the
archive on its `/_/` backups page, restore it, and sign in. Do that
once before the first real figure goes in, and again whenever the
schema changes shape.
