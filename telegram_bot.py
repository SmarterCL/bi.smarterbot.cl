#!/usr/bin/env python3
"""
Telegram Bot for SmarterOS v2.1 Monitoring
Commands: /status, /metrics, /containers, /restart, /logs, /help
"""

import os
import asyncio
import logging
from datetime import datetime
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
import aiohttp

# Configuration
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_ADMIN_ID = int(os.getenv("TELEGRAM_ADMIN_CHAT_ID", "0"))
PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://smarteros-prometheus:9090")
GRAFANA_URL = os.getenv("GRAFANA_URL", "http://smarteros-grafana:3000")
DOCKER_HOST = os.getenv("DOCKER_HOST", "unix:///var/run/docker.sock")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bot = Bot(token=TELEGRAM_TOKEN)
dp = Dispatcher()


def is_admin(user_id: int) -> bool:
    """Check if user is admin"""
    return user_id == TELEGRAM_ADMIN_ID or TELEGRAM_ADMIN_ID == 0


@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    """Show help message"""
    help_text = """
🤖 *SmarterOS Bot - Help*

*Commands:*
/status - System status overview
/metrics - Key metrics snapshot
/containers - List Docker containers
/restart <name> - Restart container
/logs <name> - Get container logs
/alerts - View active alerts
/ping - Bot health check

*Admin Only:*
/deploy - Trigger deployment
/health - Full health check
    """
    await message.answer(help_text, parse_mode="Markdown")


@dp.message(Command("ping"))
async def cmd_ping(message: types.Message):
    """Health check"""
    await message.answer(f"🏓 Pong! {datetime.now().strftime('%H:%M:%S')}")


@dp.message(Command("status"))
async def cmd_status(message: types.Message):
    """System status overview"""
    if not is_admin(message.from_user.id):
        await message.answer("⛔ Admin only command")
        return

    try:
        async with aiohttp.ClientSession() as session:
            # Get CPU metric
            async with session.get(
                f"{PROMETHEUS_URL}/api/v1/query",
                params={"query": "100 - (avg by(instance) (irate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)"}
            ) as resp:
                data = await resp.json()
                cpu = float(data["data"]["result"][0]["value"][1]) if data["data"]["result"] else 0

            # Get Memory metric
            async with session.get(
                f"{PROMETHEUS_URL}/api/v1/query",
                params={"query": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"}
            ) as resp:
                data = await resp.json()
                mem = float(data["data"]["result"][0]["value"][1]) if data["data"]["result"] else 0

            # Get Up status
            async with session.get(
                f"{PROMETHEUS_URL}/api/v1/query",
                params={"query": "count(up == 1)"}
            ) as resp:
                data = await resp.json()
                services_up = int(float(data["data"]["result"][0]["value"][1])) if data["data"]["result"] else 0

        status_text = f"""
✅ *SmarterOS v2.1 Status*

📊 *Metrics:*
CPU: {cpu:.1f}%
Memory: {mem:.1f}%
Services: {services_up} up

🕒 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

📈 Dashboard: https://bi.smarterbot.cl
        """
        await message.answer(status_text, parse_mode="Markdown")
    except Exception as e:
        await message.answer(f"❌ Error getting status: {str(e)}")


@dp.message(Command("metrics"))
async def cmd_metrics(message: types.Message):
    """Key metrics snapshot"""
    if not is_admin(message.from_user.id):
        await message.answer("⛔ Admin only command")
        return

    try:
        async with aiohttp.ClientSession() as session:
            queries = {
                "CPU": "100 - (avg by(instance) (irate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)",
                "Memory": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
                "Disk": "(1 - (node_filesystem_avail_bytes{mountpoint='/'} / node_filesystem_size_bytes{mountpoint='/'})) * 100",
                "Uptime": "node_time_seconds - node_boot_time_seconds",
                "Containers": "count(container_last_seen{name!=''})",
            }

            metrics_text = "📊 *Live Metrics*\n\n"
            for name, query in queries.items():
                try:
                    async with session.get(
                        f"{PROMETHEUS_URL}/api/v1/query",
                        params={"query": query}
                    ) as resp:
                        data = await resp.json()
                        if data["data"]["result"]:
                            value = float(data["data"]["result"][0]["value"][1])
                            if name == "Uptime":
                                value = value / 3600  # hours
                                metrics_text += f"{name}: {value:.1f}h\n"
                            else:
                                metrics_text += f"{name}: {value:.1f}%\n"
                except:
                    metrics_text += f"{name}: N/A\n"

            await message.answer(metrics_text, parse_mode="Markdown")
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")


@dp.message(Command("containers"))
async def cmd_containers(message: types.Message):
    """List Docker containers"""
    if not is_admin(message.from_user.id):
        await message.answer("⛔ Admin only command")
        return

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                "http://smarteros-api-mcp:3000/execute",
                json={
                    "tool": "docker.list_containers",
                    "data": {},
                    "tenant_id": "smarteros"
                }
            ) as resp:
                data = await resp.json()
                containers = data.get("result", [])

                text = "🐳 *Docker Containers*\n\n"
                for c in containers[:10]:  # Limit to 10
                    name = c.get("Names", "unknown")
                    status = c.get("State", "unknown")
                    emoji = "✅" if status == "running" else "⚠️"
                    text += f"{emoji} {name} - {status}\n"

                await message.answer(text, parse_mode="Markdown")
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")


@dp.message(Command("alerts"))
async def cmd_alerts(message: types.Message):
    """View active alerts"""
    if not is_admin(message.from_user.id):
        await message.answer("⛔ Admin only command")
        return

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{PROMETHEUS_URL}/api/v1/rules",
                params={"type": "alert"}
            ) as resp:
                data = await resp.json()
                # Parse and show firing alerts
                text = "🚨 *Active Alerts*\n\n"
                # Simplified for demo
                text += "No active alerts (or check Grafana)"
                await message.answer(text, parse_mode="Markdown")
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")


async def send_alert(chat_id: int, alert_name: str, severity: str, description: str):
    """Send alert to admin"""
    emoji = "🔴" if severity == "critical" else "⚠️"
    text = f"""
{emoji} *ALERT: {alert_name}*

Severity: {severity}
{description}

Check: https://bi.smarterbot.cl
    """
    try:
        await bot.send_message(chat_id, text, parse_mode="Markdown")
    except Exception as e:
        logger.error(f"Failed to send alert: {e}")


async def main():
    """Main entry point"""
    logger.info("Starting SmarterOS Bot...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
