#!/bin/sh
set -eu
cd "$(dirname "$0")"
case "$(uname -s)" in Darwin) cc -dynamiclib -o mylib.dylib add.c ;; *) cc -shared -fPIC -o mylib.so add.c ;; esac
