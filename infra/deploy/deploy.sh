#!/usr/bin/env bash
# Deploy one AZBOLT app to the VPS.
#
#   ./deploy.sh chief            # static app
#   ./deploy.sh lip              # node app, restarts the service
#
# Requires SSH access as a user that can write /var/www/azbolt and (for lip)
# run `sudo systemctl restart azbolt-lip`.
set -euo pipefail

APP="${1:-}"
HOST="${AZBOLT_SSH_HOST:-deploy@155.138.24.74}"
REMOTE_ROOT="/var/www/azbolt"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

case "$APP" in
	chief|chaim|peace|tithe) MODE=static ;;
	lip)                     MODE=node ;;
	"")  echo "usage: deploy.sh <chief|chaim|lip|peace|tithe>" >&2; exit 1 ;;
	*)   echo "unknown app: $APP" >&2; exit 1 ;;
esac

echo "==> building $APP"
pnpm --filter "@azbolt/$APP" build

SRC="$REPO_ROOT/apps/$APP/build/"
[ -d "$SRC" ] || { echo "no build output at $SRC" >&2; exit 1; }

echo "==> syncing to $HOST:$REMOTE_ROOT/$APP"
# --delete removes files from the previous build; without it, orphaned
# hashed assets accumulate and old service workers keep resolving.
rsync -az --delete --human-readable \
	-e ssh \
	"$SRC" "$HOST:$REMOTE_ROOT/$APP/"

if [ "$MODE" = node ]; then
	echo "==> installing production deps and restarting service"
	# adapter-node output needs no node_modules unless the app imports
	# externalised packages; restart is what matters.
	ssh "$HOST" "sudo systemctl restart azbolt-$APP && sleep 1 && systemctl is-active azbolt-$APP"
fi

echo "==> done: https://$APP.155.138.24.74.nip.io"
