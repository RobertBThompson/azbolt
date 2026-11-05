# Caddy configuration

Four of the five apps (`chief`, `chaim`, `peace`, `tithe`) are static — Caddy
serves their `build/` directory directly. `lip` runs as a Node process and is
reverse-proxied.

The four static fragments are **generated** — run `./generate.sh` after
changing `static-app.caddy.template` or the host, rather than editing each
`.caddy` file by hand. `lip.caddy` is maintained separately because it is
the one reverse-proxied Node app.

Import these fragments from the main `/etc/caddy/Caddyfile`:

```
import /etc/caddy/azbolt/*.caddy
```

The existing Caddy → Apache → Nextcloud chain is untouched; these are
separate subdomain blocks.

## Service worker caveat

`sw.js` and `manifest.webmanifest` must never be cached at the edge. A stale
service worker pins users to an old build with no way to recover short of
clearing site data. The `@no-cache` matchers below handle this.

## Testing without a domain

`lip-test.caddy` serves LIP on `:8080` over plain HTTP — no hostname, no
certificate, no ACME. Reach it at `http://155.138.240.74:8080`.

Keep only one of `lip.caddy` and `lip-test.caddy` in `/etc/caddy/azbolt/`
at a time; both answer for the same upstream.

Service workers require a secure context, so the PWA layer (install
prompt, offline caching) stays inert over plain HTTP. The app works; only
that layer is disabled until there is real HTTPS.

## The log directory is a reload footgun

Blocks that write a per-site access log need `/var/log/caddy` to exist and
be owned by the `caddy` user. If it isn't, `caddy validate` still reports
**Valid configuration** — validation never touches the filesystem — and
`systemctl reload caddy` fails with `permission denied`.

```bash
sudo mkdir -p /var/log/caddy && sudo chown caddy:caddy /var/log/caddy
```
