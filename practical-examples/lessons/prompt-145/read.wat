(module
(import "wasi_snapshot_preview1" "path_open" (func $open (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
(import "wasi_snapshot_preview1" "fd_read" (func $read (param i32 i32 i32 i32) (result i32)))
(import "wasi_snapshot_preview1" "fd_write" (func $write (param i32 i32 i32 i32) (result i32)))
(import "wasi_snapshot_preview1" "fd_close" (func $close (param i32) (result i32)))
(memory (export "memory") 1)
(data (i32.const 0) "hello.txt")
(func (export "_start")
(call $open (i32.const 3) (i32.const 0) (i32.const 0) (i32.const 9) (i32.const 0) (i64.const 2) (i64.const 0) (i32.const 0) (i32.const 16)) drop
(i32.store (i32.const 32) (i32.const 128)) (i32.store (i32.const 36) (i32.const 128))
(call $read (i32.load (i32.const 16)) (i32.const 32) (i32.const 1) (i32.const 48)) drop
(i32.store (i32.const 64) (i32.const 128)) (i32.store (i32.const 68) (i32.load (i32.const 48)))
(call $write (i32.const 1) (i32.const 64) (i32.const 1) (i32.const 80)) drop
(call $close (i32.load (i32.const 16))) drop))
