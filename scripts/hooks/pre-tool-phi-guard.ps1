# pre-tool-phi-guard.ps1 — Copilot CLI preToolUse hook
# Reads JSON from stdin with toolName, toolArgs, cwd
# Returns permissionDecision JSON to block HIPAA/PHI violations

$ErrorActionPreference = "Stop"

try {
    $rawInput = [Console]::In.ReadToEnd()
    $data = $rawInput | ConvertFrom-Json
    $toolName = $data.toolName
    $toolArgs = if ($data.toolArgs) { $data.toolArgs } else { "" }
} catch {
    exit 0
}

# Check for FHIR write attempts — detect HTTP write method calls, not just keywords
# Previous pattern used broad `create.*fhir` which caused false positives when
# "create" and "fhir" appeared independently (e.g., in test file mapping tables)
if ($toolName -in @('edit', 'create')) {
    if ($toolArgs -match '(?i)fhir') {
        # Match actual HTTP write operations: requests.post(), .put(), method="POST", etc.
        if ($toolArgs -match '(?i)(requests?\.(post|put|patch|delete)|\.post\s*\(|\.put\s*\(|\.patch\s*\(|\.delete\s*\(|method\s*=\s*[''"]?(POST|PUT|PATCH|DELETE)|httpx\.(post|put|patch|delete))') {
            @{ permissionDecision = "deny"; permissionDecisionReason = "HIPAA: FHIR is read-only. Writing to EHR is not allowed." } | ConvertTo-Json -Compress
            exit 0
        }
    }
}

# Check for PHI logging patterns
if ($toolName -in @('edit', 'create')) {
    if ($toolArgs -match '(log|print|console).*\b(patient[._]?name|first_name|last_name|ssn|mrn|date_of_birth)\b') {
        @{ permissionDecision = "deny"; permissionDecisionReason = "HIPAA: Do not log PHI (patient name, MRN, SSN, DOB). Use anonymized identifiers instead." } | ConvertTo-Json -Compress
        exit 0
    }
}

# Check for audio persistence
if ($toolName -in @('edit', 'create')) {
    if ($toolArgs -match '\.(wav|mp3|ogg|flac|aac|m4a)' -or $toolArgs -match '(save|write|persist|store).*audio') {
        @{ permissionDecision = "deny"; permissionDecisionReason = "HIPAA: Audio must NEVER be persisted to disk or blob storage." } | ConvertTo-Json -Compress
        exit 0
    }
}

exit 0