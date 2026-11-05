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

## Note on nip.io and TLS

Caddy will try to issue a Let's Encrypt certificate for each
`*.155.138.240.74.nip.io` name. nip.io resolves fine, so HTTP-01 works, but
Let's Encrypt rate-limits per registered domain and `nip.io` is shared
across everyone using it — issuance can fail for reasons that have nothing
to do with this server. If that happens, use Caddy's internal CA
(`tls internal`) for the test sites, and move to a real domain before
anything public.
