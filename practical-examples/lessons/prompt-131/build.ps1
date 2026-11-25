$ErrorActionPreference="Stop"
npm exec -- node-gyp rebuild --directory $PSScriptRoot
if ($LASTEXITCODE -ne 0) { throw "Native build failed" }
