#!/bin/bash
# Compile le lanceur natif VC Premium Experience et le signe en ad-hoc.
# Usage : bash scripts/build-launcher.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/VC Premium Experience.app"
SRC="$ROOT/scripts/vc-premium-launcher.swift"
OUT="$APP/Contents/MacOS/vc-premium"

swiftc -O "$SRC" -framework Cocoa -framework WebKit -o "$OUT"
codesign --force --deep --sign - "$APP"
echo "✓ Lanceur compilé : $OUT"
