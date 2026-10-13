#!/usr/bin/env bash
# Build a static copy of the site and publish it to the gh-pages branch (GitHub Pages).
# Usage: npm run deploy
#   SKIP_BUILD=1   publish the out/ folder that is already there (CI builds and tests it first)
#   PUBLISH_URL    push here instead of origin (CI passes a token URL)
set -euo pipefail

cd "$(dirname "$0")/.."
[ "${SKIP_BUILD:-}" = "1" ] || bash scripts/build-static.sh
[ -d out ] || { echo "out/ is missing — run npm run build:static first" >&2; exit 1; }
REMOTE_URL=${PUBLISH_URL:-$(git config --get remote.origin.url)}

echo "• publishing to the gh-pages branch"
cd out
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" \
  commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -q -f "$REMOTE_URL" gh-pages
cd .. && rm -rf out

echo "• done — live in a minute"
