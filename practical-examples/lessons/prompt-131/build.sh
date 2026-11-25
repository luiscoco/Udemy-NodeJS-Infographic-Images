#!/bin/sh
set -eu
cd "$(dirname "$0")"
npm exec -- node-gyp rebuild --directory "$PWD"
