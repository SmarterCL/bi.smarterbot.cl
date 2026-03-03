# 🚀 SmarterOS v2.1 - Complete Deployment Guide

## Overview

This guide covers the complete setup for:
1. ✅ Auto-deploy with Dokploy
2. ✅ Telegram alerts for monitoring
3. ✅ Prometheus alerting rules
4. ✅ bi.smarterbot.cl dashboard

---

## Part 1: Dokploy Auto-Deploy Setup

### Step 1: Access Dokploy
```bash
open https://dokploy.smarterbot.store
```

### Step 2: Connect GitHub
1. Login to Dokploy
2. Go to **Settings** → **GitHub**
3. Click **Connect GitHub**
4. Authorize Dokploy
5. Select repository: `SmarterCL/bi.smarterbot.cl`

### Step 3: Create Application
1. Click **New Application**
2. Select **Source: GitHub**
3. Choose repository: `bi.smarterbot.cl`
4. Branch: `main`
5. Build Type: **Dockerfile**

### Step 4: Configure Environment Variables
```bash
NODE_ENV=production
PORT=3001
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

### Step 5: Configure Domain
1. Go to **Domains** tab
2. Add domain: `bi.smarterbot.cl`
3. SSL: **Auto** (Caddy handles this)

### Step 6: Get Webhook URL
1. Go to **Settings** → **Webhooks**
2. Copy the **Deploy Webhook URL**
3. Add to GitHub Secrets:
   - Go to repo **Settings** → **Secrets and variables** → **Actions**
   - New secret: `DOKPLOY_WEBHOOK_URL`
   - Value: paste webhook URL

### Step 7: Test Auto-Deploy
```bash
cd /Users/mac/bi-smarterbot
echo "# test" >> README.md
git add . && git commit -m "test auto-deploy" && git push
```

Wait 2-3 minutes, then check:
```bash
open https://bi.smarterbot.cl
```

---

## Part 2: Telegram Bot Setup

### Step 1: Create Bot
1. Open Telegram → @BotFather
2. Send: `/newbot`
3. Follow prompts to name your bot
4. Save the **API Token**

### Step 2: Get Your Chat ID
1. Open Telegram → @userinfobot
2. Send any message
3. Save your **Chat ID** (numeric)

### Step 3: Configure Environment
Create `.env` file on server:
```bash
ssh root@89.116.23.167
cd /root/bi-smarterbot
cat > .env << EOF
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
PROMETHEUS_URL=http://smarteros-prometheus:9090
GRAFANA_URL=http://smarteros-grafana:3000
EOF
```

### Step 4: Deploy Telegram Bot
```bash
cd /root/bi-smarterbot
docker-compose up -d telegram-bot
```

### Step 5: Test Bot Commands
In Telegram, send to your bot:
- `/help` - Show commands
- `/ping` - Health check
- `/status` - System status (admin only)

---

## Part 3: Prometheus Alerts Setup

### Step 1: Copy Alert Rules
```bash
ssh root@89.116.23.167
docker cp /root/bi-smarterbot/prometheus_alerts.yml smarteros-prometheus:/etc/prometheus/
```

### Step 2: Configure Alertmanager
```bash
docker cp /root/bi-smarterbot/alertmanager.yml smarteros-alertmanager:/etc/alertmanager/
```

### Step 3: Restart Services
```bash
docker restart smarteros-prometheus
docker restart smarteros-alertmanager
```

### Step 4: Verify Alerts
Open Prometheus:
```bash
ssh -L 9090:localhost:9090 root@89.116.23.167
open http://localhost:9090/alerts
```

---

## Part 4: Testing the Full Pipeline

### Test 1: Auto-Deploy
```bash
cd /Users/mac/bi-smarterbot
# Make a change
echo "<!-- deployed at $(date) -->" >> app/page.tsx
git add . && git commit -m "deploy test" && git push

# Wait 2-3 minutes
# Check https://bi.smarterbot.cl
```

### Test 2: Telegram Alert
```bash
# SSH to server
ssh root@89.116.23.167

# Create high CPU load (test alert)
stress --cpu 4 --timeout 120

# Check Telegram for alert
```

### Test 3: Bot Commands
In Telegram:
```
/status
/metrics
/containers
```

---

## Part 5: Troubleshooting

### Auto-Deploy Not Working
```bash
# Check GitHub Actions
open https://github.com/SmarterCL/bi.smarterbot.cl/actions

# Check Dokploy logs
ssh root@89.116.23.167
docker logs dokploy
```

### Telegram Bot Not Responding
```bash
# Check bot logs
ssh root@89.116.23.167
docker logs smarteros-telegram-bot

# Test webhook
curl -X POST https://bot.smarterbot.cl:8443/webhook
```

### Alerts Not Firing
```bash
# Check Prometheus targets
ssh -L 9090:localhost:9090 root@89.116.23.167
open http://localhost:9090/targets

# Check Alertmanager
open http://localhost:9093
```

---

## Quick Reference

### Deploy Commands
```bash
# Manual deploy (if auto-deploy fails)
ssh root@89.116.23.167 "cd /root/bi-smarterbot && git pull && docker-compose up -d"

# Check status
ssh root@89.116.23.167 "docker ps | grep bi-"

# View logs
ssh root@89.116.23.167 "docker logs smarteros-bi-dashboard --tail 50"
```

### Telegram Commands
```
/help - Show all commands
/status - System overview
/metrics - Live metrics
/containers - Docker containers
/alerts - Active alerts
/ping - Bot health
```

### Monitoring URLs
- Dashboard: https://bi.smarterbot.cl
- Grafana: SSH tunnel → http://localhost:3000
- Prometheus: SSH tunnel → http://localhost:9090
- Alertmanager: SSH tunnel → http://localhost:9093

---

## Next Steps

1. ✅ Configure Dokploy webhook
2. ✅ Setup Telegram bot token
3. ✅ Deploy alert rules
4. ✅ Test auto-deploy pipeline
5. ✅ Verify Telegram alerts

**Estimated Setup Time**: 30-45 minutes

---

**Support**: Check `TELEGRAM_ALERTS.md` for detailed bot configuration
**Last Updated**: March 3, 2026
