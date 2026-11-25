param([string]$Lesson="--list", [Parameter(ValueFromRemainingArguments=$true)][string[]]$LessonArgs)
$ErrorActionPreference="Stop"
$runtime=Join-Path $PSScriptRoot "../.tools/node-v26.13.1-win-x64/node.exe"
if (-not (Test-Path -LiteralPath $runtime)) { $runtime=(Get-Command node).Source }
$version=& $runtime --version
if ($version -ne "v26.13.1") { throw "Select Node.js 26.13.1 with your version manager first." }
$previousPath=$env:PATH
Push-Location -LiteralPath $PSScriptRoot
try { $env:PATH=(Split-Path $runtime)+";"+$env:PATH; & $runtime tools/run.mjs $Lesson @LessonArgs } finally { $env:PATH=$previousPath; Pop-Location }
