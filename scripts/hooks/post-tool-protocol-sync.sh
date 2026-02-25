#!/bin/bash
# post-tool-protocol-sync.sh — Copilot CLI postToolUse hook
# After editing cosmos_repository.py or protocols.py, check for protocol drift

set -e
INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('toolName',''))" 2>/dev/null || echo "")
TOOL_ARGS=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('toolArgs',''))" 2>/dev/null || echo "")

# Only check after edit operations on repository files
if [ "$TOOL_NAME" = "edit" ] || [ "$TOOL_NAME" = "editFiles" ]; then
    if echo "$TOOL_ARGS" | grep -qiE "(cosmos_repository\.py|protocols\.py)"; then
        echo "ℹ️ Repository file edited. Reminder: ensure RepositoryProtocol and CosmosRepository methods stay in sync." >&2
        echo "   Run: grep 'async def' src/meridian/services/protocols.py src/meridian/services/cosmos_repository.py" >&2
    fi
fi

exit 0
