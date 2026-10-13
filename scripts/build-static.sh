#!/usr/bin/env bash
# Build the static site into out/ exactly as GitHub Pages will serve it.
# Usage: npm run build:static   (deploy-gh-pages.sh and CI both call this)
set -euo pipefail

cd "$(dirname "$0")/.."
REMOTE_URL=$(git config --get remote.origin.url)
SLUG=$(echo "$REMOTE_URL" | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')
OWNER=${SLUG%%/*}
REPO=${SLUG##*/}
OWNER_LC=$(echo "$OWNER" | tr '[:upper:]' '[:lower:]')

# A repo named <owner>.github.io is served from the domain root; any other repo from /<repo>/.
if [ "$(echo "$REPO" | tr '[:upper:]' '[:lower:]')" = "$OWNER_LC.github.io" ]; then
  BASE_PATH=""
else
  BASE_PATH="/$REPO"
fi
SITE_URL="https://$OWNER_LC.github.io$BASE_PATH"

# Old addresses that should keep working (e.g. links already printed on a résumé).
LEGACY_PATHS=("prasad-portfolio")

echo "• building static site for $SITE_URL/"
rm -rf out
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH="$BASE_PATH" NEXT_PUBLIC_SITE_URL="$SITE_URL" npx next build

# GitHub Pages runs Jekyll by default, which hides folders starting with "_" (like _next)
touch out/.nojekyll

if [ -z "$BASE_PATH" ]; then
  for legacy in "${LEGACY_PATHS[@]}"; do
    mkdir -p "out/$legacy"
    cat > "out/$legacy/index.html" <<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved — Prasad Rao</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="$SITE_URL/">
<meta http-equiv="refresh" content="0; url=$SITE_URL/">
<script>location.replace("$SITE_URL/")</script>
</head>
<body><p>This page has moved to <a href="$SITE_URL/">$SITE_URL/</a>.</p></body>
</html>
HTML
    # keep the old résumé download link alive too
    cp public/resume.pdf "out/$legacy/resume.pdf"
  done
fi
