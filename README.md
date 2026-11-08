# AZBOLT

Monorepo for five SvelteKit progressive web apps. One repository, one
dependency tree, one design system — five independently deployable apps.

| App     | Subdomain                   | Adapter | Dev port |
| ------- | --------------------------- | ------- | -------- |
| `chief` | chief.155.138.240.74.nip.io | static  | 5171     |
| `chaim` | chaim.155.138.240.74.nip.io | static  | 5172     |
| `lip`   | lip.155.138.240.74.nip.io   | node    | 5173     |
| `peace` | peace.155.138.240.74.nip.io | static  | 5174     |
| `tithe` | tithe.155.138.240.74.nip.io | static  | 5175     |

## Layout

```
apps/           one SvelteKit app per subdomain; folder name == subdomain
packages/
  ui/           shared Svelte components (shipped as source, not built)
  lib/          Supabase clients, shared app constants
  pwa/          manifest factory, workbox caching rules, icon generator
  config/       shared tsconfig base and design tokens
infra/
  caddy/        per-subdomain Caddy fragments
  deploy/       systemd unit, deploy script, VPS bootstrap notes
docs/<app>/     per-app concept, wireframes, and the rules the code must honor
```

## Getting started

```bash
pnpm install
pnpm dev                        # every app at once, each on its own port
pnpm --filter @azbolt/lip dev   # just one
pnpm build                      # all five
pnpm --filter @azbolt/chief build
```

Node 20+ and pnpm 10+.

## Design decisions worth knowing before you change things

**Shared components ship as source.** `@azbolt/ui` points its `svelte`
export condition at raw `.svelte` files. Each app's Vite build compiles
them. There is no build step in `packages/ui` and no watch-mode lag — edit
a shared component and every running dev server hot-reloads it.

**Each app owns its accent; Chief also owns a design language.**
`packages/config/tokens.css` defines the shared system — neutrals, the
semantic `--tone-*` scale, type, space and shape — and each app overrides
`--app-accent` in its own `app.css`. For four of the five apps that is the
only override, and a second one probably belongs in the shared file.

Chief is the exception, deliberately. It has a full design spec of its own
(`docs/chief/`) that names a warmer surface palette, a three-family type
system and a context language, so `apps/chief/src/app.css` overrides those
too. None of it is proven on the other apps yet, which is why it is scoped
to Chief rather than promoted. If Chaim or Peace adopt the same language,
move that block into `packages/config/tokens.css` rather than copying it.

The semantic tones are shared even though only Chief uses them today:
they answer "what is this screen asking of you" — arranging, committing,
an AI moment, attention required — which is a system-level question rather
than an app-level one, and they are additive, so an app that ignores them
is unaffected.

**Four static, one node.** Chief, Chaim, Peace and Tithe build to flat
files that Caddy serves directly — no process to supervise, nothing to
restart, trivially cacheable. LIP uses `adapter-node` because its scoring
and attribution math must not run in the browser and its service-role
Supabase key must never reach a client bundle. Don't promote an app to
`adapter-node` until it actually has a server-side reason.

**Separate subdomains mean separate origins.** Each app gets its own
service worker scope, its own install entry, its own cache storage. The
cost is that a Supabase session on one app does not carry to another —
`createBrowserClient` takes an explicit per-app `storageKey` so the apps
never fight over the same slot. If single sign-on across the five becomes
a requirement, that needs a cookie on a shared parent domain, which needs
a real domain rather than nip.io.

**The service worker is never edge-cached.** `sw.js` and
`manifest.webmanifest` are served `no-store` (see `infra/caddy/`). A stale
service worker pins users to an old build with no recovery short of
clearing site data.

## Deploying

See `infra/deploy/bootstrap-vps.md` for one-time VPS setup, then:

```bash
./infra/deploy/deploy.sh chief
./infra/deploy/deploy.sh lip     # also restarts azbolt-lip.service
```

CI builds every app on push; `.github/workflows/deploy.yml` deploys only
the apps whose files actually changed. A change under `packages/`
deliberately redeploys all five.

## Icons

`packages/pwa/bin/gen-icons.js` generates placeholder PNG icons at build
time so no binaries are committed and no app ships without a valid
manifest. **Replace them with real artwork before launch** — they are
solid-color squares.
