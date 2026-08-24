#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
PORT="${PORT:-8000}"
echo "MMA : RPG server starting on port ${PORT}..."
python3 -m http.server "$PORT" --bind 0.0.0.0
