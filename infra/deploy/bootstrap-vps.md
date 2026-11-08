# VPS bootstrap (one time)

```bash
# Directories
sudo mkdir -p /var/www/azbolt/{chief,chaim,lip,peace,tithe}
sudo mkdir -p /etc/caddy/azbolt /etc/azbolt /var/log/caddy
# The caddy user must own the log dir, or `systemctl reload caddy` fails
# with "permission denied" WHILE `caddy validate` still reports success —
# validation parses config without touching the filesystem.
sudo chown caddy:caddy /var/log/caddy
sudo chown -R deploy:www-data /var/www/azbolt

# Caddy fragments
sudo cp infra/caddy/*.caddy /etc/caddy/azbolt/
# Add to /etc/caddy/Caddyfile, once:
#   import /etc/caddy/azbolt/*.caddy
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy

# LIP service
sudo cp infra/deploy/azbolt-lip.service /etc/systemd/system/
printf 'PUBLIC_SUPABASE_URL=...\nPUBLIC_SUPABASE_ANON_KEY=...\nSUPABASE_SERVICE_ROLE_KEY=...\n' \
  | sudo tee /etc/azbolt/lip.env >/dev/null
sudo chmod 600 /etc/azbolt/lip.env
sudo chown www-data:www-data /etc/azbolt/lip.env
sudo systemctl daemon-reload
sudo systemctl enable --now azbolt-lip
```

## PocketBase for Chief (one time)

Chief's backend is a second PocketBase instance on 127.0.0.1:8091, kept
separate from the one already on 8090 — the two have no reason to share a
database, a backup schedule or an admin account, and an instance costs
about 40MB.

```bash
# Binary
sudo mkdir -p /var/lib/azbolt/chief-pb
cd /tmp
curl -sSL -o pb.zip https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_linux_amd64.zip
sudo unzip -o pb.zip pocketbase -d /usr/local/bin/
sudo chmod +x /usr/local/bin/pocketbase
sudo chown -R deploy:www-data /var/lib/azbolt/chief-pb

# Service
sudo cp infra/deploy/azbolt-chief-pb.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now azbolt-chief-pb
systemctl is-active azbolt-chief-pb

# Caddy fragment now proxies /api and /_/ to it
./infra/caddy/generate.sh
sudo cp infra/caddy/*.caddy /etc/caddy/azbolt/
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Then create the superuser and import the collections:

1. Open `https://chief.155.138.240.74.nip.io/_/` and create the superuser
   account. This is PocketBase's own admin login, separate from any app
   user.
2. Settings → Import collections → paste
   `infra/pocketbase/chief-collections.json` → review the diff → Import.

The import is a diff, so it will say exactly what it is about to create.
Read it before confirming: these collection definitions have not been
applied against a running instance, only validated against the SDK's
collection schema. If a field type is rejected, fix it in the JSON and
re-import rather than hand-editing the collection, so the file stays the
source of truth.

### API rules

Every collection carries explicit list/view/create/update/delete rules
scoped to `owner = @request.auth.id`, written per collection rather than
left open. Chief's original Firestore had rules on exactly one collection
and nothing else, which is the mistake this is guarding against. A new
collection with blank rules is superuser-only, not public — but do not
rely on that as the policy; write the rules.

## Note on nip.io and TLS

Caddy will try to issue a Let's Encrypt certificate for each
`*.155.138.240.74.nip.io` name. nip.io resolves fine, so HTTP-01 works, but
Let's Encrypt rate-limits per registered domain and `nip.io` is shared
across everyone using it — issuance can fail for reasons that have nothing
to do with this server. If that happens, use Caddy's internal CA
(`tls internal`) for the test sites, and move to a real domain before
anything public.
