# Caddy configuration

Four of the five apps (`chief`, `chaim`, `peace`, `tithe`) are static — Caddy
serves their `build/` directory directly. `lip` runs as a Node process and is
reverse-proxied.

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
