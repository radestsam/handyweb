#!/usr/bin/env bash
# ==============================================================
# Installs the packages through an npm mirror, for a build during an
# outage of the international internet.
#
#   scripts/install-mirror.sh [mirror-url]
#
# Yarn 1 downloads each package from the URL in yarn.lock. This script
# rewrites those URLs to the mirror, installs, and then restores the
# original yarn.lock, so the repository never holds the mirror URL.
# yarn.lock keeps a checksum for each package, so a mirror cannot change
# the code without failing the install.
#
# The default mirror is the one in the starter kit (docker/mirrors.env).
# ==============================================================
set -Eeuo pipefail

MIRROR="${1:-https://mirror.kargadan.ir/repository/yarn-group}"
cd "$(dirname "${BASH_SOURCE[0]}")/.."

BACKUP="$(mktemp)"
cp yarn.lock "$BACKUP"
trap 'cp "$BACKUP" yarn.lock; rm -f "$BACKUP"' EXIT

sed "s#https://registry.yarnpkg.com#${MIRROR%/}#g" "$BACKUP" >yarn.lock
yarn install --frozen-lockfile --non-interactive --network-timeout 300000
echo "Installed through ${MIRROR}. yarn.lock is restored."
