$ErrorActionPreference="Stop"
Push-Location -LiteralPath $PSScriptRoot
try { cl /LD add.c /Fe:mylib.dll; if ($LASTEXITCODE -ne 0) { throw "Native build failed" } } finally { Pop-Location }
