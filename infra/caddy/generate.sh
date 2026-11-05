#!/usr/bin/env bash
# Regenerate the per-app Caddy fragments from the template.
#
# The host lives here, in one place. Editing each .caddy file by hand is
# how the IP drifts out of sync — which has already happened once.
#
#   ./generate.sh                      # uses the default host below
#   AZBOLT_HOST=example.com ./generate.sh
set -euo pipefail

HOST="${AZBOLT_HOST:-155.138.240.74.nip.io}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# lip is deliberately excluded: it is the one reverse-proxied Node app and
# has its own hand-maintained fragment.
for slug in chief chaim peace tithe; do
	sed -e "s|{{SLUG}}|$slug|g" \
		-e "s|155\.138\.240\.74\.nip\.io|$HOST|g" \
		"$DIR/static-app.caddy.template" > "$DIR/$slug.caddy"
	echo "wrote $slug.caddy -> $slug.$HOST"
done

echo
echo "Reminder: lip.caddy is maintained separately. If the host changed,"
echo "update it, packages/lib/src/app.js, and README.md too."
