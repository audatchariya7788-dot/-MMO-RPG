#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
PORT="${PORT:-8000}"

echo "=========================================="
echo " MMA : RPG - Codespaces Launcher"
echo "=========================================="
echo "Root : $ROOT"
echo "Port : $PORT"
echo "Files:"
printf '  %s\n' index.html style.css phaseC.css app.js animation.js phaseC.js

echo
if [ ! -f "$ROOT/index.html" ] || [ ! -f "$ROOT/style.css" ] || [ ! -f "$ROOT/app.js" ]; then
  echo "ERROR: MMA : RPG files are missing from the repository root."
  exit 1
fi

echo "Open: http://localhost:${PORT}/"
echo "In Codespaces: Ports -> ${PORT} -> Open in Browser"
echo "Press Ctrl+C to stop the server."
echo
exec python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$ROOT"
