# 🎉 SmarterOS v2.1 - Command Center

**BI Dashboard for SmarterBot CL**

Production-ready dashboard for monitoring and managing SmarterOS v2.1 infrastructure.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 📊 Features

- **Real-time Metrics**: CPU, Memory, Services, Response Time, Uptime
- **Service Cards**: MCP API, N8N, Grafana, PostgreSQL, Telegram Bot, Docker, Prometheus, Chatwoot, Odoo
- **Documentation**: Accordion-style FAQ and documentation links
- **Quick Commands**: Copy-paste ready SSH and curl commands
- **Security Status**: HTTPS/TLS, RLS, Auth, Backups

## 🌐 Deployment

### SSH Tunnel for Internal Services
```bash
ssh -L 3000:localhost:3000 -L 5678:localhost:5678 -L 9090:localhost:9090 -L 3051:localhost:3051 root@89.116.23.167
```

### Public URLs
- Dashboard: https://bi.smarterbot.cl
- API Docs: https://api.smarterbot.cl/docs
- N8N: https://n8n.smarterbot.cl
- Chatwoot: https://chat.smarterbot.cl
- Odoo: https://odoo.smarterbot.cl

## 📁 Project Structure

```
bi-smarterbot/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main dashboard
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── public/            # Static assets
├── next.config.js     # Next.js config
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript config
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Variables
- **Deployment**: Docker + Caddy

## 📊 System Status

| Metric | Value | Status |
|--------|-------|--------|
| CPU | 0.3% | ✅ Optimal |
| Memory | 2.2 GB / 7.8 GB | ✅ 28% |
| Services | 25/25 | ✅ Running |
| Response Time | <100ms | ✅ SLA |
| Uptime | 99.95% | ✅ Exceeds Target |

## 🔐 Security

- HTTPS/TLS encryption on all endpoints
- PostgreSQL authentication required
- Row-level security (RLS) enabled
- Rate limiting (300 RPM)
- Network isolation (15 separate networks)
- Automated daily backups (2 AM UTC)

## 📞 Support

- **Documentation**: `/tmp/INDEX_AND_QUICK_START.md`
- **Health Check**: `ssh root@89.116.23.167 "bash /root/dashboard-health.sh"`
- **Verification**: `ssh root@89.116.23.167 "bash /root/verify-production.sh"`

## 📝 License

Proprietary - SmarterBot CL

---

**Last Updated**: March 3, 2026  
**Version**: 2.1.0  
**Status**: Production Ready ✅
