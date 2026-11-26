#!/usr/bin/env bash
# ==============================================================
# Runs the code checks: formatting, lint, type check, unit tests
#
#   scripts/ci/test.sh
#
# Needs Node and the installed packages (yarn install --frozen-lockfile).
# ==============================================================
# shellcheck source=scripts/ci/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

group "Check the formatting"
yarn -s format:check
endgroup

group "Lint"
yarn -s lint
endgroup

group "Type check"
yarn -s typecheck
endgroup

group "Unit tests"
yarn -s test
endgroup
