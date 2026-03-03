# 🚀 SmarterOS v2.1 - Auto-Deploy Setup (Dokploy Webhook)

## ✅ Status: CONFIGURADO

El sistema de auto-deploy está configurado y funcionando.

---

## 📡 Webhook Endpoint

**URL:** `https://bi.smarterbot.cl/api/webhook`

**Puerto Interno:** 8089

**Estado:** ✅ Activo

---

## 🔧 Configuración en GitHub

### 1. Ir a GitHub Repo Settings
```
https://github.com/SmarterCL/bi.smarterbot.cl/settings/hooks
```

### 2. Agregar Webhook

**Payload URL:**
```
https://bi.smarterbot.cl/api/webhook
```

**Content type:** `application/json`

**Secret:** (opcional) `bi-smarterbot-secret`

**Events:** 
- ✅ Push events (solo rama `main`)

### 3. Test Webhook

Después de guardar, haz un push de prueba:

```bash
cd /Users/mac/bi-smarterbot
echo "<!-- test webhook -->" >> app/page.tsx
git add . && git commit -m "test webhook deploy" && git push
```

---

## 📊 Verificar Deploy

### 1. GitHub Actions
```
https://github.com/SmarterCL/bi.smarterbot.cl/actions
```

### 2. Logs del Webhook (en el servidor)
```bash
ssh root@89.116.23.167
tail -f /var/log/bi-webhook.log
```

### 3. Logs de Caddy
```bash
ssh root@89.116.23.167
docker logs caddy --tail 50 | grep webhook
```

### 4. Verificar bi.smarterbot.cl
```bash
curl -I https://bi.smarterbot.cl
```

---

## 🐛 Troubleshooting

### Webhook no responde
```bash
# Verificar contenedor
ssh root@89.116.23.167
docker ps | grep webhook

# Ver logs
docker logs bi-webhook-server

# Restart
docker restart bi-webhook-server
```

### Caddy no proxyea
```bash
# Verificar config
docker exec caddy cat /etc/caddy/Caddyfile | grep -A 10 webhook

# Restart Caddy
docker kill --signal=SIGTERM caddy
sleep 2
docker start caddy
```

### Deploy falla
```bash
# Ver logs del deploy
cat /var/log/bi-deploy.log

# Deploy manual
cd /root/bi-smarterbot
bash deploy.sh
```

---

## 📝 Comandos Útiles

### Test Webhook
```bash
curl -X POST https://bi.smarterbot.cl/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Health Check
```bash
curl https://bi.smarterbot.cl/api/webhook
```

### Ver Logs en Tiempo Real
```bash
ssh root@89.116.23.167
tail -f /var/log/bi-webhook.log
```

---

## 🎯 Flujo Completo

```
1. Haces push a GitHub
   ↓
2. GitHub envía webhook a bi.smarterbot.cl/api/webhook
   ↓
3. Webhook server recibe y ejecuta deploy.sh
   ↓
4. deploy.sh:
   - git pull
   - docker build
   - docker stop old container
   - docker run new container
   - cleanup
   ↓
5. bi.smarterbot.cl actualizado ✅
```

---

## 📁 Archivos Importantes

| Archivo | Función |
|---------|---------|
| `webhook-server.py` | Servidor webhook (puerto 8089) |
| `deploy.sh` | Script de deploy automático |
| `docker-compose.yml` | Orquestación de servicios |
| `Caddyfile` | Proxy reverso (Caddy) |
| `.github/workflows/deploy.yml` | GitHub Actions (trigger webhook) |

---

## ✅ Checklist Final

- [x] Webhook server corriendo (puerto 8089)
- [x] Caddy configurado para proxy
- [x] Deploy script funcional
- [x] GitHub Actions configurado
- [ ] Webhook de GitHub configurado (manual en GitHub settings)

---

**Last Updated:** March 3, 2026  
**Status:** ✅ Ready (pendiente configurar webhook en GitHub)  
**Webhook URL:** https://bi.smarterbot.cl/api/webhook
