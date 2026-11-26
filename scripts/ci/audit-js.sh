#!/usr/bin/env bash
# ==============================================================
# Audits the JavaScript packages
#
#   scripts/ci/audit-js.sh
#
# Vite bundles every package at build time, so the audit covers all groups.
# Only high and critical advisories fail the run.
# ==============================================================
# shellcheck source=scripts/ci/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

yarn --version
yarn audit --level high
