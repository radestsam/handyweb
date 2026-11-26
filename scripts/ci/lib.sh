#!/usr/bin/env bash
# ==============================================================
# Shared parts of the CI check scripts
#
# Source this file. Do not run it. It sets strict mode, moves to the
# root of the checkout to check, and holds the two things that every script needs:
#
#   - the tool images, pinned by digest, so that a new release of a tool
#     cannot fail a run by surprise. Bump a digest together with the
#     version in the comment next to it.
#   - `annotate`, which writes a message in the form that the place
#     where the script runs can show. GitHub Actions turns `::error::`
#     into an annotation on the run. A terminal shows plain text.
#
# Adapted from docker/scripts/ci/lib.sh of the starter kit.
# ==============================================================
set -Eeuo pipefail

# CI_ROOT names the checkout to check, when it is not the one that holds these
# scripts.
ROOT="${CI_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$ROOT"

# The image of shellcheck 0.11.0.
export SHELLCHECK_IMAGE='koalaman/shellcheck@sha256:61862eba1fcf09a484ebcc6feea46f1782532571a34ed51fedf90dd25f925a8d'
# The image of shfmt 3.12.0.
export SHFMT_IMAGE='mvdan/shfmt@sha256:307d265ffd25ce832899ae17c93ed5062fc3375c514bba8f52cbf52792735c4d'

# annotate <error|warning|notice> <message>
annotate() {
    if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
        printf '::%s::%s\n' "$1" "$2"
    else
        case "$1" in
            error) printf '\033[0;31m✗ %s\033[0m\n' "$2" >&2 ;;
            warning) printf '\033[1;33m! %s\033[0m\n' "$2" >&2 ;;
            *) printf '→ %s\n' "$2" ;;
        esac
    fi
}

# fail <message>: write the message as an error and stop.
fail() {
    annotate error "$1"
    exit 1
}

# group <title> ... endgroup: fold the output between them in the log of an
# Actions run. A terminal gets a heading line.
group() {
    if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
        printf '::group::%s\n' "$1"
    else
        printf '\n\033[0;34m━━ %s\033[0m\n' "$1"
    fi
}

endgroup() {
    if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
        printf '::endgroup::\n'
    fi
}
