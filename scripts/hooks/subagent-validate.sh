#!/bin/bash
# subagent-validate.sh — Copilot CLI subagentStop hook
# Validates subagent output didn't introduce PHI in test data

set -e
INPUT=$(cat)

# Check if any test files were modified
TOOL_ARGS=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('toolArgs',''))" 2>/dev/null || echo "")

if echo "$TOOL_ARGS" | grep -qiE "tests/"; then
    echo "ℹ️ Subagent modified test files. Reminder: verify no real PHI in test data (use synthetic only)." >&2
fi

exit 0
