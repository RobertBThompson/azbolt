#!/usr/bin/env bash
# A nightly copy of Chief's PocketBase, off the machine it runs on.
#
# PocketBase keeps everything in one SQLite database, so a copy of the
# data directory is the whole backup — but copying a live SQLite file
# can catch it mid-write. PocketBase's own backup endpoint makes a
# consistent archive, which is what this fetches.
#
#   infra/pocketbase/backup.sh https://chief.155.138.240.74.nip.io /srv/backups/chief
#
# Needs PB_SUPERUSER and PB_PASSWORD in the environment. Keeps 14 days.
set -euo pipefail

BASE="${1:?usage: backup.sh <base-url> <destination-dir>}"
DEST="${2:?usage: backup.sh <base-url> <destination-dir>}"
: "${PB_SUPERUSER:?set PB_SUPERUSER}"
: "${PB_PASSWORD:?set PB_PASSWORD}"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$DEST"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
NAME="chief-${STAMP}.zip"

TOKEN="$(curl -sS -X POST "${BASE}/api/collections/_superusers/auth-with-password" \
  -H 'Content-Type: application/json' \
  -d "{\"identity\":\"${PB_SUPERUSER}\",\"password\":\"${PB_PASSWORD}\"}" \
  | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')"
[ -n "$TOKEN" ] || { echo "could not sign in to ${BASE}" >&2; exit 1; }

# Ask PocketBase to make the archive, then fetch it.
curl -sS -X POST "${BASE}/api/backups" \
  -H "Authorization: ${TOKEN}" -H 'Content-Type: application/json' \
  -d "{\"name\":\"${NAME}\"}" >/dev/null

curl -sS -f -o "${DEST}/${NAME}" \
  -H "Authorization: ${TOKEN}" \
  "${BASE}/api/backups/${NAME}"

# Leave the server holding only the newest; this machine keeps the history.
curl -sS -X DELETE "${BASE}/api/backups/${NAME}" -H "Authorization: ${TOKEN}" >/dev/null || true

SIZE="$(wc -c < "${DEST}/${NAME}")"
[ "$SIZE" -gt 1000 ] || { echo "backup ${NAME} is only ${SIZE} bytes" >&2; exit 1; }

find "$DEST" -name 'chief-*.zip' -type f -mtime "+${KEEP_DAYS}" -delete
echo "${DEST}/${NAME} (${SIZE} bytes)"
