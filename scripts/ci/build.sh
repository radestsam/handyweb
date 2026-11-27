#!/usr/bin/env bash
# ==============================================================
# Builds the static site and checks that the output is static only
#
#   scripts/ci/build.sh
#
# The output is apps/web/dist/. The check fails when the build writes a
# server entry point, because the hosts serve static files only.
# ==============================================================
# shellcheck source=scripts/ci/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

DIST=apps/web/dist

group "Build the site"
rm -rf "$DIST"
yarn -s build
endgroup

group "Check the output"
[ -f "$DIST/index.html" ] || fail "$DIST/index.html is missing."
if find "$DIST" -name 'entry.mjs' -o -name '_worker.js' | grep -q .; then
    fail "The build wrote a server entry point. The site must be static."
fi
[ -f "$DIST/_headers" ] || fail "$DIST/_headers is missing. The build runs scripts/generate-headers.mjs."
grep -q 'http-equiv="Content-Security-Policy"' "$DIST/index.html" ||
    fail "$DIST/index.html has no CSP meta tag."
annotate notice "$(find "$DIST" -type f | wc -l | tr -d ' ') files, $(du -sh "$DIST" | cut -f1) in $DIST"
endgroup

group "Check the JavaScript budget"
node scripts/check-budget.mjs "$DIST"
endgroup
