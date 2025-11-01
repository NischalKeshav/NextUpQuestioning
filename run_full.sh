#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[run] starting backend..."
cd "$BASE_DIR/Backend"
if [ ! -d node_modules ]; then
  echo "[run] installing backend deps..."
  npm install
fi

node server.js &
SERVER_PID=$!

cleanup() {
  echo
  echo "[run] stopping backend (pid $SERVER_PID)..."
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

sleep 1

echo "[run] opening clients..."
if command -v open >/dev/null 2>&1; then
  open "$BASE_DIR/SenderClient/index.html"
  open "$BASE_DIR/RecieverClient/index.html"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$BASE_DIR/SenderClient/index.html" || true
  xdg-open "$BASE_DIR/RecieverClient/index.html" || true
else
  echo "[run] please open these files in your browser:"
  echo "  $BASE_DIR/SenderClient/index.html"
  echo "  $BASE_DIR/RecieverClient/index.html"
fi

echo "[run] server running at ws://localhost:8080 (pid $SERVER_PID)"
echo "[run] press Ctrl+C to stop"

wait "$SERVER_PID"


