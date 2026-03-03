#!/bin/bash
# Webhook handler for Dokploy auto-deploy
# This script is called by GitHub webhook

set -e

echo "🚀 Received webhook deploy request..."

# Log the request
echo "Timestamp: $(date)" >> /var/log/bi-deploy.log
echo "Payload: $1" >> /var/log/bi-deploy.log 2>&1 || true

cd /root/bi-smarterbot

# Pull latest changes
echo "📦 Pulling latest changes..." >> /var/log/bi-deploy.log
git pull origin main >> /var/log/bi-deploy.log 2>&1

# Build new image
echo "🔨 Building Docker image..." >> /var/log/bi-deploy.log
docker build -t bi-smarterbot:latest . >> /var/log/bi-deploy.log 2>&1

# Stop old container
echo "🛑 Stopping old container..." >> /var/log/bi-deploy.log
docker stop smarteros-bi-dashboard >> /var/log/bi-deploy.log 2>&1 || true
docker rm smarteros-bi-dashboard >> /var/log/bi-deploy.log 2>&1 || true

# Deploy new container
echo "🚀 Starting new container..." >> /var/log/bi-deploy.log
docker run -d \
    --name smarteros-bi-dashboard \
    --restart unless-stopped \
    --network smarteros-network \
    --network dokploy-network \
    -p 3001:3001 \
    -e NODE_ENV=production \
    -e PORT=3001 \
    bi-smarterbot:latest >> /var/log/bi-deploy.log 2>&1

# Wait for container to start
sleep 3

# Cleanup old images
echo "🧹 Cleaning up old images..." >> /var/log/bi-deploy.log
docker image prune -f >> /var/log/bi-deploy.log 2>&1

echo "✅ Deployment complete!" >> /var/log/bi-deploy.log
echo "🌐 URL: https://bi.smarterbot.cl" >> /var/log/bi-deploy.log

# Send success response
echo "Content-Type: application/json"
echo ""
echo '{"status": "success", "message": "Deployed successfully"}'
