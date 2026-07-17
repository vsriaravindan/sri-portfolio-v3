#!/usr/bin/env bash
# deploy.sh — Pull latest Docker image and restart
set -euo pipefail

APP_DIR="/opt/sri-portfolio"
IMAGE="ghcr.io/vsriaravindan/sri-portfolio-v3:latest"

cd "$APP_DIR"

echo "→ Pulling latest image: $IMAGE"
docker pull "$IMAGE"

echo "→ Restarting container"
docker compose up -d --force-recreate

echo "→ Cleaning up old images"
docker image prune -f

echo "✓ Deploy complete"
