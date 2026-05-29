#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Starting Prelegal..."
docker compose up -d --build

echo ""
echo "Prelegal is running:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
