#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(CDPATH="" cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

JSON_MODE=false
FEATURE_INPUT=""

usage() {
    cat <<'EOF'
Usage: select-feature.sh [--json] specs/<number>-<name>

Validate an existing Spec Kit feature directory and persist it as the active
feature in .specify/feature.json. This command does not modify Git state.
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        --*)
            echo "ERROR: Unknown option: $1" >&2
            usage >&2
            exit 1
            ;;
        *)
            if [[ -n "$FEATURE_INPUT" ]]; then
                echo "ERROR: Provide exactly one feature directory." >&2
                usage >&2
                exit 1
            fi
            FEATURE_INPUT="$1"
            shift
            ;;
    esac
done

if [[ -z "$FEATURE_INPUT" ]]; then
    echo "ERROR: Missing feature directory." >&2
    usage >&2
    exit 1
fi

REPO_ROOT=$(get_repo_root)

if [[ "$FEATURE_INPUT" == /* ]]; then
    if [[ "$FEATURE_INPUT" != "$REPO_ROOT/"* ]]; then
        echo "ERROR: Feature directory must be inside the current Spec Kit project." >&2
        exit 1
    fi
    FEATURE_RELATIVE="${FEATURE_INPUT#"$REPO_ROOT/"}"
else
    FEATURE_RELATIVE="${FEATURE_INPUT#./}"
fi

if [[ ! "$FEATURE_RELATIVE" =~ ^specs/[0-9]{3,}-[a-z0-9][a-z0-9-]*$ ]]; then
    echo "ERROR: Expected specs/<number>-<name>, got: $FEATURE_INPUT" >&2
    exit 1
fi

FEATURE_PATH="$REPO_ROOT/$FEATURE_RELATIVE"
if [[ ! -d "$FEATURE_PATH" ]]; then
    echo "ERROR: Feature directory not found: $FEATURE_PATH" >&2
    exit 1
fi
if [[ ! -f "$FEATURE_PATH/spec.md" ]]; then
    echo "ERROR: spec.md not found in: $FEATURE_PATH" >&2
    exit 1
fi

CANONICAL_PATH=$(CDPATH="" cd -- "$FEATURE_PATH" && pwd)
if [[ "$CANONICAL_PATH" != "$REPO_ROOT/specs/"* ]]; then
    echo "ERROR: Feature directory resolves outside $REPO_ROOT/specs." >&2
    exit 1
fi
FEATURE_RELATIVE="${CANONICAL_PATH#"$REPO_ROOT/"}"

_persist_feature_json "$REPO_ROOT" "$FEATURE_RELATIVE"

if $JSON_MODE; then
    printf '{"feature_directory":"%s"}\n' "$(json_escape "$FEATURE_RELATIVE")"
else
    printf 'Active Spec Kit feature: %s\n' "$FEATURE_RELATIVE"
fi
