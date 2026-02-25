#!/bin/bash
# pre-tool-phi-guard.sh — Copilot CLI preToolUse hook
# Reads JSON from stdin with toolName, toolArgs, cwd
# Returns permissionDecision JSON to block HIPAA/PHI violations

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('toolName',''))" 2>/dev/null || echo "")
TOOL_ARGS=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('toolArgs',''))" 2>/dev/null || echo "")

# Check for FHIR write attempts - detect HTTP write method calls, not just keywords
# Previous pattern used broad create.*fhir which caused false positives when
# create and fhir appeared independently (e.g., in test file mapping tables)
if [ "$TOOL_NAME" = "edit" ] || [ "$TOOL_NAME" = "create" ]; then
    if echo "$TOOL_ARGS" | grep -qi "fhir"; then
        if echo "$TOOL_ARGS" | grep -qiP "(requests?\.(post|put|patch|delete)|\.post\s*\(|\.put\s*\(|\.patch\s*\(|\.delete\s*\(|method\s*=\s*['\x22]?(POST|PUT|PATCH|DELETE)|httpx\.(post|put|patch|delete))"; then
            echo '{"permissionDecision":"deny","permissionDecisionReason":"HIPAA: FHIR is read-only. Writing to EHR is not allowed."}'
            exit 0
        fi
    fi
fi

# Check for PHI logging patterns
if [ "$TOOL_NAME" = "edit" ] || [ "$TOOL_NAME" = "create" ]; then
    if echo "$TOOL_ARGS" | grep -qiE "(log|print|console).*(patient[._]?name|first_name|last_name|ssn|mrn|date_of_birth)"; then
        echo '{"permissionDecision":"deny","permissionDecisionReason":"HIPAA: Do not log PHI (patient name, MRN, SSN, DOB). Use anonymized identifiers instead."}'
        exit 0
    fi
fi

# Check for audio persistence
if [ "$TOOL_NAME" = "edit" ] || [ "$TOOL_NAME" = "create" ]; then
    if echo "$TOOL_ARGS" | grep -qiE "\.(wav|mp3|ogg|flac|aac|m4a)" || echo "$TOOL_ARGS" | grep -qiE "(save|write|persist|store).*audio"; then
        echo '{"permissionDecision":"deny","permissionDecisionReason":"HIPAA: Audio must NEVER be persisted to disk or blob storage."}'
        exit 0
    fi
fi

exit 0
