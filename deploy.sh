#!/bin/bash
# Auto-deploy script for bi.smarterbot.cl
# Triggered by GitHub webhook via Dokploy

set -e

echo "🚀 Starting auto-deploy for bi.smarterbot.cl..."

# Navigate to app directory
cd /root/bi-smarterbot

# Pull latest changes
echo "📦 Pulling latest changes..."
git pull origin main

# Build new image
echo "🔨 Building Docker image..."
docker build -t bi-smarterbot:latest .

# Stop old container
echo "🛑 Stopping old container..."
docker stop smarteros-bi-dashboard 2>/dev/null || true
docker rm smarteros-bi-dashboard 2>/dev/null || true

# Deploy new container
echo "🚀 Starting new container..."
docker run -d \
    --name smarteros-bi-dashboard \
    --restart unless-stopped \
    --network smarteros-network \
    --network dokploy-network \
    -p 3001:3001 \
    -e NODE_ENV=production \
    -e PORT=3001 \
    bi-smarterbot:latest

# Wait for container to start
sleep 3

# Cleanup old images
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
echo "🌐 URL: https://bi.smarterbot.cl"

# Send notification to Telegram (if configured)
if [ ! -z "$TELEGRAM_BOT_TOKEN" ] && [ ! -z "$TELEGRAM_ADMIN_CHAT_ID" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_ADMIN_CHAT_ID}" \
        -d "text=✅ bi.smarterbot.cl deployed successfully!
        
📦 Commit: $(git log -1 --pretty=%B | head -1)
🕐 Time: $(date)"
fi
