#!/usr/bin/env bash
# ==============================================================
# Lints what the tests do not run: the shell scripts
#
#   scripts/ci/lint.sh
#
# Every tool runs from an image pinned by digest in lib.sh. shellcheck and
# shfmt use the ones on the path when there are some. Needs Docker otherwise.
#
# The checks of the workflow files (actionlint and zizmor) are not here. They
# read .github/ and only make sense on Actions, so the workflow runs them.
# ==============================================================
# shellcheck source=scripts/ci/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

shopt -s nullglob
SHELL_FILES=(
    .githooks/pre-commit
    .githooks/pre-push
    scripts/*.sh
    scripts/ci/*.sh
)

group "Lint the shell scripts"
if command -v shellcheck >/dev/null 2>&1; then
    shellcheck --severity=warning -x "${SHELL_FILES[@]}"
else
    docker run --rm -v "$PWD:/mnt" -w /mnt "$SHELLCHECK_IMAGE" --severity=warning -x "${SHELL_FILES[@]}"
fi
endgroup

# The same flags as the pre-commit hook: 4 spaces, indented case items,
# binary operators at the start of a line.
group "Check the shell formatting"
if command -v shfmt >/dev/null 2>&1; then
    shfmt -d -i 4 -ci -bn "${SHELL_FILES[@]}"
else
    docker run --rm -v "$PWD:/mnt" -w /mnt "$SHFMT_IMAGE" -d -i 4 -ci -bn "${SHELL_FILES[@]}"
fi
endgroup
