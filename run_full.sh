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
  open "http://localhost:8080/Sending"
  open "http://localhost:8080/Recieving"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:8080/Sending" || true
  xdg-open "http://localhost:8080/Recieving" || true
else
  echo "[run] please open these files in your browser:"
  echo "  http://localhost:8080/Sending"
  echo "  http://localhost:8080/Recieving"
fi

echo "[run] server running at http://localhost:8080 (pid $SERVER_PID)"
echo "[run] websocket at ws://localhost:8080/ws"
echo "[run] press Ctrl+C to stop"

wait "$SERVER_PID"


