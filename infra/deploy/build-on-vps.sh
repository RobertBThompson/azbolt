#!/usr/bin/env bash
# Build one AZBOLT static app on the VPS itself and publish it.
#
#   bash infra/deploy/build-on-vps.sh chief
#   bash infra/deploy/build-on-vps.sh chief my-branch
#
# This is the path to use until GitHub Actions has its deploy secrets and a
# `deploy` user. It clones or updates the repo in place, builds, and syncs the
# output into the directory Caddy serves. Safe to re-run.
set -euo pipefail

APP="${1:-chief}"
REF="${2:-main}"
REPO_DIR="${AZBOLT_REPO_DIR:-/srv/azbolt}"
WEB_ROOT="${AZBOLT_WEB_ROOT:-/var/www/azbolt}"
CLONE_URL="https://github.com/RobertBThompson/azbolt"

case "$APP" in
	chief|chaim|peace|tithe) ;;
	lip) echo "lip is a node app; use infra/deploy/deploy.sh" >&2; exit 1 ;;
	*)   echo "unknown app: $APP" >&2; exit 1 ;;
esac

if [ ! -d "$REPO_DIR/.git" ]; then
	echo "==> cloning into $REPO_DIR"
	mkdir -p "$(dirname "$REPO_DIR")"
	git clone "$CLONE_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"
echo "==> fetching $REF"
git fetch --prune origin
# Discard local drift: this directory is a build workspace, not somewhere to
# edit. Anything committed here would be lost on the next run anyway.
git checkout -B "$REF" "origin/$REF"
git reset --hard "origin/$REF"
echo "    at $(git log --oneline -1)"

command -v pnpm >/dev/null || { echo "pnpm not found on PATH" >&2; exit 1; }

echo "==> installing dependencies"
pnpm install --frozen-lockfile

echo "==> building $APP"
pnpm --filter "@azbolt/$APP" build

SRC="$REPO_DIR/apps/$APP/build/"
[ -d "$SRC" ] || { echo "no build output at $SRC" >&2; exit 1; }

echo "==> publishing to $WEB_ROOT/$APP"
mkdir -p "$WEB_ROOT/$APP"
# --delete clears the previous build's hashed assets. Without it, orphaned
# files linger and stale service workers keep resolving against them.
rsync -a --delete "$SRC" "$WEB_ROOT/$APP/"

echo "==> done: $APP built from $REF"
echo "    hard-refresh or use a private window; the service worker caches aggressively."
