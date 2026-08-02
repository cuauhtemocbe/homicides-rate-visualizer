#!/bin/bash
# Verifies every package.json script is mentioned in CLAUDE.md, so the
# "Stack & Key Commands" table doesn't silently drift out of sync (issue #32).

set -euo pipefail
cd "$(dirname "$0")/.."

SCRIPTS=$(node -e "console.log(Object.keys(require('./package.json').scripts).join('\n'))")

missing=0
while IFS= read -r script; do
  if ! grep -qF -- "$script" CLAUDE.md; then
    echo "❌ package.json script not mentioned in CLAUDE.md: $script"
    missing=1
  fi
done <<<"$SCRIPTS"

if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo "✅ CLAUDE.md mentions every package.json script"
exit 0
