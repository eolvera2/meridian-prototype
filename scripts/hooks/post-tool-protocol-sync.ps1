# post-tool-protocol-sync.ps1 — Copilot CLI postToolUse hook
# After editing cosmos_repository.py or protocols.py, check for protocol drift

$Input = [Console]::In.ReadToEnd()

try {
    $data = $Input | ConvertFrom-Json
    $toolName = $data.toolName
    $toolArgs = $data.toolArgs
} catch {
    exit 0
}

if ($toolName -in @('edit', 'editFiles')) {
    if ($toolArgs -match '(cosmos_repository\.py|protocols\.py)') {
        Write-Host "ℹ️ Repository file edited. Reminder: ensure RepositoryProtocol and CosmosRepository methods stay in sync." -ForegroundColor Cyan
        Write-Host "   Run: grep 'async def' src/meridian/services/protocols.py src/meridian/services/cosmos_repository.py" -ForegroundColor DarkGray
    }
}

exit 0
