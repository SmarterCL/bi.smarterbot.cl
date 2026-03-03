# 🤖 Telegram Alert Bot for SmarterOS v2.1

## Bot Configuration
- **Bot Token**: `TELEGRAM_BOT_TOKEN` (from @BotFather)
- **Chat ID**: `TELEGRAM_ADMIN_CHAT_ID` (your Telegram user ID)
- **Webhook Port**: 8443 (already configured)

## Alertas Configuradas

### 1. CPU High Usage (>80%)
```yaml
alert: HighCPUUsage
expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
for: 1m
annotations:
  summary: "⚠️ CPU High: {{ $value }}%"
```

### 2. Memory High (>85%)
```yaml
alert: HighMemoryUsage
expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
for: 1m
annotations:
  summary: "⚠️ Memory High: {{ $value }}%"
```

### 3. Disk Space Low (>85%)
```yaml
alert: LowDiskSpace
expr: (1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100 > 85
for: 5m
annotations:
  summary: "⚠️ Disk Low: {{ $value }}% used"
```

### 4. Service Down
```yaml
alert: ServiceDown
expr: up == 0
for: 30s
annotations:
  summary: "🔴 Service Down: {{ $labels.job }}"
```

### 5. Flow API Latency High (>2s)
```yaml
alert: FlowAPISlow
expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="flow-api"}[5m])) > 2
for: 1m
annotations:
  summary: "🐌 Flow API Slow: {{ $value }}s"
```

## Comandos Telegram

| Comando | Descripción |
|---------|-------------|
| `/status` | Estado general del sistema |
| `/metrics` | Screenshot de métricas principales |
| `/containers` | Lista de contenedores Docker |
| `/restart <name>` | Reiniciar contenedor |
| `/logs <name>` | Últimos logs del contenedor |
| `/help` | Ayuda de comandos |

## Setup

1. **Crear Bot**: Hablar con @BotFather en Telegram
2. **Obtener Token**: `/newbot` → guardar token
3. **Obtener Chat ID**: Enviar mensaje a @userinfobot
4. **Configurar Webhook**:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://bot.smarterbot.cl:8443/webhook"
   ```

## Environment Variables

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
PROMETHEUS_URL=http://smarteros-prometheus:9090
GRAFANA_URL=http://smarteros-grafana:3000
GRAFANA_API_KEY=your_grafana_api_key
```
