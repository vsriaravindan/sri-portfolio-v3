#!/usr/bin/env bash
# setup-server.sh — One-time VPS setup for sri-portfolio
# Run this once on a fresh Oracle Cloud Ubuntu 24.04 instance

set -euo pipefail

echo "=== Updating system ==="
sudo apt-get update -qq && sudo apt-get upgrade -y -qq

echo "=== Installing Docker ==="
sudo apt-get install -y -qq ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -qq && sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu

echo "=== Installing Nginx ==="
sudo apt-get install -y -qq nginx

echo "=== Setting up swap ==="
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

echo "=== Creating app directory ==="
sudo mkdir -p /opt/sri-portfolio
sudo chown ubuntu:ubuntu /opt/sri-portfolio

echo "=== Setup complete ==="
echo "Next: deploy code to /opt/sri-portfolio and run: docker compose up -d"
