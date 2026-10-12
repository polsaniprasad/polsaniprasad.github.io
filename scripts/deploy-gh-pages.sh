#!/usr/bin/env bash
# Build a static copy of the site and publish it to the gh-pages branch (GitHub Pages).
# Usage: npm run deploy
set -euo pipefail

cd "$(dirname "$0")/.."
REMOTE_URL=$(git config --get remote.origin.url)
SLUG=$(echo "$REMOTE_URL" | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')
OWNER=${SLUG%%/*}
REPO=${SLUG##*/}
OWNER_LC=$(echo "$OWNER" | tr '[:upper:]' '[:lower:]')

echo "• building static site for https://$OWNER_LC.github.io/$REPO/"
rm -rf out
STATIC_EXPORT=1 \
NEXT_PUBLIC_BASE_PATH="/$REPO" \
NEXT_PUBLIC_SITE_URL="https://$OWNER_LC.github.io/$REPO" \
  npx next build

# GitHub Pages runs Jekyll by default, which hides folders starting with "_" (like _next)
touch out/.nojekyll

echo "• publishing to the gh-pages branch"
cd out
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" \
  commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -q -f "$REMOTE_URL" gh-pages
cd .. && rm -rf out

echo "• done — live in a minute at https://$OWNER_LC.github.io/$REPO/"
