# 🧠 SmarterMCP Skills - SmarterOS v2.1

## Skills Implementadas

### 1. `resolve_tenant` - Routing Inteligente
**Propósito:** Obtener configuración de tenant desde Telegram ID

**Input:**
```json
{
  "telegram_id": "123456789",
  "action": "get_odoo_config"
}
```

**Output:**
```json
{
  "tenant_id": "smarterbot-store",
  "odoo_url": "https://odoo.smarterbot.store",
  "database": "smarterbot_store_prod",
  "api_key": "sk_live_xxx"
}
```

**Flow:**
```
Telegram ID → Supabase (vault_tenants) → Odoo Config → n8n Context
```

---

### 2. `bi_reporter` - Generador de Reportes
**Propósito:** Leer KPIs y generar gráficos para bi.smarterbot.cl

**Input:**
```json
{
  "tenant_id": "smarterbot-store",
  "metrics": ["revenue", "orders", "conversion"],
  "period": "last_7_days"
}
```

**Output:**
```json
{
  "chart_data": {...},
  "kpi_summary": {
    "revenue": "$12,450",
    "orders": 87,
    "conversion": "3.2%"
  }
}
```

**Flow:**
```
Supabase (vault_kpis) → MCP Aggregation → BI Dashboard
```

---

### 3. `rotate_credentials` - Rotación Segura
**Propósito:** Rotar API keys de Twilio/Meta automáticamente

**Input:**
```json
{
  "provider": "twilio",
  "tenant_id": "smarterbot-store",
  "rotate_every": "30d"
}
```

**Output:**
```json
{
  "status": "rotated",
  "new_key_id": "sk_live_new_xxx",
  "expires_at": "2026-04-03"
}
```

**Flow:**
```
MCP Scheduler → Twilio API → Supabase Vault → n8n Config
```

---

### 4. `provision_tenant` - Provisionamiento desde Telegram
**Propósito:** Crear nuevo tenant en Odoo desde comando de Telegram

**Input:**
```json
{
  "telegram_id": "123456789",
  "tenant_name": "new-store",
  "plan": "enterprise"
}
```

**Output:**
```json
{
  "tenant_id": "new-store",
  "odoo_url": "https://new-store.smarterbot.store",
  "status": "provisioned",
  "admin_password": "temp_pass_xxx"
}
```

**Flow:**
```
Telegram Command → MCP → Supabase + Odoo + Dokploy → Welcome Message
```

---

## MCP Tools Registry

| Tool | Endpoint | Method | Auth |
|------|----------|--------|------|
| `resolve_tenant` | `/mcp/resolve_tenant` | POST | Telegram Auth |
| `bi_reporter` | `/mcp/bi_reporter` | POST | API Key |
| `rotate_credentials` | `/mcp/rotate_creds` | POST | Admin Key |
| `provision_tenant` | `/mcp/provision` | POST | Telegram Admin |
| `docker.list_containers` | `/execute` | POST | Tenant ID |
| `n8n.trigger_workflow` | `/execute` | POST | Tenant ID |
| `odoo.query_records` | `/execute` | POST | Tenant ID |
| `telegram.send_message` | `/execute` | POST | Bot Token |

---

## Supabase Schema

### vault_tenants
```sql
CREATE TABLE vault_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE,
  tenant_name TEXT NOT NULL,
  odoo_url TEXT,
  odoo_database TEXT,
  odoo_api_key TEXT,
  plan TEXT DEFAULT 'starter',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### vault_kpis
```sql
CREATE TABLE vault_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES vault_tenants(id),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  metric_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### vault_credentials
```sql
CREATE TABLE vault_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES vault_tenants(id),
  provider TEXT NOT NULL,
  credential_key TEXT NOT NULL,
  credential_value TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  rotated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## n8n Workflow Integration

### Workflow: Tenant Resolver
```json
{
  "name": "MCP - Resolve Tenant",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "mcp/resolve_tenant",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Supabase Lookup",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "getAll",
        "table": "vault_tenants",
        "filterType": "string",
        "filterString": "telegram_id={{ $json.telegram_id }}"
      }
    },
    {
      "name": "Return Config",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json[0] }}"
      }
    }
  ]
}
```

---

## Telegram Commands

```
/tenant status → MCP: resolve_tenant → Odoo config
/tenant provision → MCP: provision_tenant → New Odoo instance
/kpi report → MCP: bi_reporter → Gráfico en Telegram
/creds rotate → MCP: rotate_credentials → New API keys
```

---

## Implementation Priority

1. ✅ **resolve_tenant** - Base para todo el routing
2. ⏳ **bi_reporter** - Dashboard en Telegram
3. ⏳ **rotate_credentials** - Security automation
4. ⏳ **provision_tenant** - Self-service onboarding

---

**Status:** Ready to Implement  
**Next:** Code implementation for `resolve_tenant` skill  
**ETA:** 30 minutes per skill
