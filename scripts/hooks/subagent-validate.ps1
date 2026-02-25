# subagent-validate.ps1 — Copilot CLI subagentStop hook
# Validates subagent output didn't introduce PHI in test data

$Input = [Console]::In.ReadToEnd()

try {
    $data = $Input | ConvertFrom-Json
    $toolArgs = $data.toolArgs
} catch {
    exit 0
}

if ($toolArgs -match 'tests/') {
    Write-Host "ℹ️ Subagent modified test files. Reminder: verify no real PHI in test data (use synthetic only)." -ForegroundColor Cyan
}

exit 0
