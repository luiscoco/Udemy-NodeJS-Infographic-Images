$ErrorActionPreference="Stop"
& "$env:WASI_SDK_PATH/bin/clang.exe" --target=wasm32-wasip1 -O2 -o read.wasm read.c
