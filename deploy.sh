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

# Build and deploy
echo "🔨 Building Docker image..."
docker-compose build bi-dashboard

echo "🔄 Deploying new version..."
docker-compose up -d bi-dashboard

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
