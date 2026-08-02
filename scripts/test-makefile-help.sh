#!/bin/bash
# Verifies that `make help` documents every target required by issue #28.

set -euo pipefail
cd "$(dirname "$0")/.."

REQUIRED_TARGETS=(up down dev test lint typecheck build validate coverage)

HELP_OUTPUT="$(make help | sed -E 's/\x1b\[[0-9;]*m//g')"
DEFAULT_OUTPUT="$(make | sed -E 's/\x1b\[[0-9;]*m//g')"

if [ "$HELP_OUTPUT" != "$DEFAULT_OUTPUT" ]; then
  echo "❌ 'make' with no arguments does not match 'make help' output"
  exit 1
fi

missing=0
for target in "${REQUIRED_TARGETS[@]}"; do
  if ! grep -qE "^${target}[[:space:]]" <<<"$HELP_OUTPUT"; then
    echo "❌ Missing target in 'make help' output: $target"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo "✅ make help documents all required targets"
exit 0
