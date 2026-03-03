# 🚀 Auto-Deploy Setup Guide

## GitHub Actions Secrets

Para que el auto-deploy funcione, necesitas configurar los siguientes secrets en GitHub:

### 1. Ir a GitHub Repo Settings
```
https://github.com/SmarterCL/bi.smarterbot.cl/settings/secrets/actions
```

### 2. Agregar los siguientes secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SERVER_HOST` | `89.116.23.167` | IP del servidor |
| `SERVER_USER` | `root` | Usuario SSH |
| `SSH_PRIVATE_KEY` | (tu clave privada SSH) | Clave para conectar al servidor |

### 3. Cómo obtener la clave SSH privada

En tu Mac local:
```bash
# Si ya tienes una clave SSH
cat ~/.ssh/id_rsa | pbcopy

# Si no tienes una clave SSH
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# Luego copia la pública al servidor
ssh-copy-id root@89.116.23.167
# Y copia la privada al secret
cat ~/.ssh/id_rsa | pbcopy
```

Pega el contenido en el secret `SSH_PRIVATE_KEY` en GitHub.

---

## Telegram Bot Setup (Opcional)

Para recibir alertas y notificaciones de deploy en Telegram:

### 1. Crear el Bot
1. Abre Telegram y busca @BotFather
2. Envía `/newbot`
3. Sigue las instrucciones para nombrar tu bot
4. Guarda el **API Token** que te da

### 2. Obtener tu Chat ID
1. Abre Telegram y busca @userinfobot
2. Envía cualquier mensaje
3. Guarda tu **Chat ID** (número)

### 3. Configurar en el servidor
```bash
ssh root@89.116.23.167

# Crear archivo .env
cat > /root/bi-smarterbot/.env << EOF
TELEGRAM_BOT_TOKEN=tu_token_aqui
TELEGRAM_ADMIN_CHAT_ID=tu_chat_id_aqui
EOF
```

### 4. Reiniciar el bot
```bash
docker restart telegram-bot
```

---

## Probar el Auto-Deploy

### 1. Hacer un cambio pequeño
```bash
cd /Users/mac/bi-smarterbot
echo "<!-- deployed at $(date) -->" >> app/page.tsx
git add . && git commit -m "test auto-deploy" && git push
```

### 2. Ver el progreso en GitHub
```
https://github.com/SmarterCL/bi.smarterbot.cl/actions
```

### 3. Verificar el deploy
```bash
# Esperar 2-3 minutos
curl -I https://bi.smarterbot.cl

# O abrir en el navegador
open https://bi.smarterbot.cl
```

---

## Troubleshooting

### El deploy falla en GitHub Actions
```bash
# Verificar SSH
ssh root@89.116.23.167

# Si no conecta, regenerar claves
ssh-keygen -R 89.116.23.167
ssh-copy-id root@89.116.23.167
```

### El contenedor no arranca
```bash
ssh root@89.116.23.167
docker logs smarteros-bi-dashboard --tail 50
```

### Caddy no proxyea correctamente
```bash
ssh root@89.116.23.167
docker network connect smarteros-web smarteros-bi-dashboard
docker restart caddy
```

---

## Manual Deploy (Fallback)

Si GitHub Actions falla, puedes hacer deploy manual:

```bash
ssh root@89.116.23.167
cd /root/bi-smarterbot
git pull
bash deploy.sh
```

---

**Last Updated**: March 3, 2026
**Status**: ✅ Auto-Deploy Working
