# ✅ SmarterOS v2.1 - Telegram BI/KPI/CRM/ERP Setup Complete

## 🎯 Resumen de la Configuración

### Telegram Bot Commands

| Comando | Descripción | URL/Función |
|---------|-------------|-------------|
| `/kpi` | KPI Dashboard overview | Muestra CPU, Memory, Uptime + links CRM/ERP/BI |
| `/bi` | BI Dashboard link | https://bi.smarterbot.cl |
| `/crm` | CRM System link | https://odoo.smarterbot.cl |
| `/erp` | ERP System link | https://odoo.smarterbot.cl |
| `/status` | System status | CPU, Memory, Services |
| `/metrics` | Live metrics | Prometheus metrics |
| `/containers` | Docker containers | Lista contenedores |
| `/help` | Help message | Todos los comandos |

---

## 📊 Dashboard bi.smarterbot.cl

### Quick Links Actualizados:
1. **📊 BI Dashboard** → https://bi.smarterbot.cl
2. **📦 CRM** → https://odoo.smarterbot.cl
3. **📈 ERP** → https://odoo.smarterbot.cl
4. **📖 API Docs** → https://api.smarterbot.cl/docs
5. **⚡ N8N** → https://n8n.smarterbot.cl
6. **💬 Chatwoot** → https://chat.smarterbot.cl
7. **📄 RAG/Docling** → https://rag.smarterbot.cl
8. **🤖 Bot Portal** → https://bot.smarterbot.cl
9. **🎛️ Dokploy** → https://dokploy.smarterbot.store
10. **📋 Trello** → https://trello.smarterprop.cl
11. **✈️ Telegram Bot** → https://t.me/SmarterChat_bot

---

## 🚀 Auto-Deploy Status

### GitHub Actions
- ✅ Workflow configurado en `.github/workflows/deploy.yml`
- ✅ Auto-deploy al hacer push a `main`
- ✅ Secrets requeridos: `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`

### Deploy Script
- ✅ `deploy.sh` en el servidor
- ✅ Build Docker automático
- ✅ Restart del contenedor
- ✅ Cleanup de imágenes viejas

### Comandos para probar:
```bash
# Hacer un cambio y deploy automático
cd /Users/mac/bi-smarterbot
echo "<!-- test -->" >> app/page.tsx
git add . && git commit -m "test" && git push

# Ver el deploy en acción
open https://github.com/SmarterCL/bi.smarterbot.cl/actions
```

---

## 🔧 Configuración Pendiente

### 1. GitHub Secrets (5 minutos)
```
https://github.com/SmarterCL/bi.smarterbot.cl/settings/secrets/actions

Agregar:
- SERVER_HOST: 89.116.23.167
- SERVER_USER: root
- SSH_PRIVATE_KEY: (contenido de ~/.ssh/id_rsa)
```

### 2. Telegram Bot Token (si quieres notificaciones)
```bash
ssh root@89.116.23.167
cat > /root/bi-smarterbot/.env << EOF
TELEGRAM_BOT_TOKEN=tu_token_de_botfather
TELEGRAM_ADMIN_CHAT_ID=tu_chat_id
EOF
docker restart telegram-bot
```

---

## 📱 Uso en Telegram

### Para recibir el dashboard:
1. Abre tu bot de Telegram
2. Envía `/kpi` para ver KPIs con links
3. Envía `/bi` para el link directo al BI Dashboard
4. Envía `/crm` o `/erp` para Odoo

### Ejemplo de respuesta `/kpi`:
```
📈 KPI Dashboard - SmarterOS v2.1

*Infrastructure:*
CPU Usage: 0.3%
Memory: 28.5%
Uptime: 99.95%

*Business:*
🔗 CRM: https://odoo.smarterbot.cl
🔗 ERP: https://odoo.smarterbot.cl
🔗 BI: https://bi.smarterbot.cl
🔗 API: https://api.smarterbot.cl/docs

🕒 2026-03-03 15:00:00
```

---

## ✅ Checklist Final

- [x] BI Dashboard live en https://bi.smarterbot.cl
- [x] Telegram Bot con comandos /kpi /bi /crm /erp
- [x] Quick Links actualizados en dashboard
- [x] Auto-deploy script configurado
- [x] GitHub Actions workflow listo
- [ ] GitHub Secrets configurados (manual)
- [ ] Telegram Bot token configurado (opcional)

---

## 📞 URLs de Referencia

| Servicio | URL |
|----------|-----|
| BI Dashboard | https://bi.smarterbot.cl |
| CRM | https://odoo.smarterbot.cl |
| ERP | https://odoo.smarterbot.cl |
| API Docs | https://api.smarterbot.cl/docs |
| N8N | https://n8n.smarterbot.cl |
| Grafana | SSH tunnel → http://localhost:3000 |
| Prometheus | SSH tunnel → http://localhost:9090 |
| Dokploy | https://dokploy.smarterbot.store |
| GitHub | https://github.com/SmarterCL/bi.smarterbot.cl |

---

**Status**: ✅ **PRODUCCIÓN LISTO**  
**Last Updated**: March 3, 2026  
**Version**: 2.1.0
