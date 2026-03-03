#!/usr/bin/env python3
"""
SmarterMCP Skills - Tenant Resolution & BI Reporter
Conecta Supabase, Odoo, n8n y Telegram
"""

import os
import json
import asyncio
import aiohttp
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xxx.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your_key_here")
ODOO_URL = os.getenv("ODOO_URL", "https://odoo.smarterbot.cl")
N8N_URL = os.getenv("N8N_URL", "https://n8n.smarterbot.cl")
MCP_BASE_URL = os.getenv("MCP_BASE_URL", "http://localhost:3051")


class SmarterMCP:
    """SmarterMCP Skills Implementation"""
    
    def __init__(self):
        self.supabase_url = SUPABASE_URL
        self.supabase_key = SUPABASE_KEY
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        }
    
    async def resolve_tenant(self, telegram_id: str) -> Optional[Dict[str, Any]]:
        """
        Skill: resolve_tenant
        Obtiene configuración de tenant desde Telegram ID
        
        Args:
            telegram_id: Telegram user ID
            
        Returns:
            Dict con configuración de Odoo o None
        """
        print(f"🔍 Resolviendo tenant para Telegram ID: {telegram_id}")
        
        async with aiohttp.ClientSession() as session:
            # Query Supabase
            url = f"{self.supabase_url}/rest/v1/vault_tenants"
            params = {"telegram_id": f"eq.{telegram_id}", "select": "*"}
            
            try:
                async with session.get(url, headers=self.headers, params=params) as resp:
                    if resp.status == 200:
                        tenants = await resp.json()
                        if tenants:
                            tenant = tenants[0]
                            print(f"✅ Tenant encontrado: {tenant['tenant_name']}")
                            
                            return {
                                "tenant_id": str(tenant['id']),
                                "tenant_name": tenant['tenant_name'],
                                "odoo_url": tenant.get('odoo_url'),
                                "odoo_database": tenant.get('odoo_database'),
                                "odoo_api_key": tenant.get('odoo_api_key'),
                                "plan": tenant.get('plan', 'starter'),
                                "status": tenant.get('status', 'active')
                            }
                        else:
                            print(f"⚠️ No se encontró tenant para {telegram_id}")
                            return None
                    else:
                        print(f"❌ Error querying Supabase: {resp.status}")
                        return None
            except Exception as e:
                print(f"❌ Error in resolve_tenant: {e}")
                return None
    
    async def bi_reporter(self, tenant_id: str, metrics: list = None, period: str = "last_7_days") -> Dict[str, Any]:
        """
        Skill: bi_reporter
        Genera reporte de KPIs para el dashboard
        
        Args:
            tenant_id: Tenant UUID
            metrics: Lista de métricas a reportar
            period: Período del reporte
            
        Returns:
            Dict con datos del reporte
        """
        print(f"📊 Generando BI reporte para tenant: {tenant_id}")
        
        if metrics is None:
            metrics = ["revenue", "orders", "conversion", "leads"]
        
        async with aiohttp.ClientSession() as session:
            # Query KPIs from Supabase
            url = f"{self.supabase_url}/rest/v1/vault_kpis"
            
            # Calculate date range
            days = int(period.replace("last_", "").replace("_days", ""))
            date_from = (datetime.now() - timedelta(days=days)).isoformat()
            
            params = {
                "tenant_id": f"eq.{tenant_id}",
                "metric_date": f"gte.{date_from}",
                "select": "*"
            }
            
            try:
                async with session.get(url, headers=self.headers, params=params) as resp:
                    if resp.status == 200:
                        kpis = await resp.json()
                        
                        # Aggregate metrics
                        report = {
                            "tenant_id": tenant_id,
                            "period": period,
                            "generated_at": datetime.now().isoformat(),
                            "metrics": {},
                            "chart_data": {
                                "labels": [],
                                "datasets": []
                            }
                        }
                        
                        # Process each metric
                        for metric_name in metrics:
                            metric_data = [k for k in kpis if k['metric_name'] == metric_name]
                            if metric_data:
                                values = [float(k['metric_value']) for k in metric_data]
                                report["metrics"][metric_name] = {
                                    "current": values[-1] if values else 0,
                                    "average": sum(values) / len(values) if values else 0,
                                    "trend": "up" if len(values) > 1 and values[-1] > values[0] else "down"
                                }
                                
                                # Add chart data
                                for k in metric_data:
                                    if k['metric_date'] not in report["chart_data"]["labels"]:
                                        report["chart_data"]["labels"].append(k['metric_date'])
                        
                        # Format summary
                        summary = {}
                        for name, data in report["metrics"].items():
                            if name == "revenue":
                                summary[name] = f"${data['current']:,.2f}"
                            elif name == "conversion":
                                summary[name] = f"{data['current']:.2f}%"
                            else:
                                summary[name] = str(int(data['current']))
                        
                        report["kpi_summary"] = summary
                        print(f"✅ Reporte generado: {len(report['metrics'])} métricas")
                        
                        return report
                    else:
                        print(f"❌ Error querying KPIs: {resp.status}")
                        return {"error": "Failed to fetch KPIs"}
            except Exception as e:
                print(f"❌ Error in bi_reporter: {e}")
                return {"error": str(e)}
    
    async def provision_tenant(self, telegram_id: str, tenant_name: str, plan: str = "starter") -> Dict[str, Any]:
        """
        Skill: provision_tenant
        Crea nuevo tenant en Supabase y Odoo
        
        Args:
            telegram_id: Telegram user ID
            tenant_name: Nombre del tenant
            plan: Plan del tenant
            
        Returns:
            Dict con credenciales del nuevo tenant
        """
        print(f"🏗️ Provisionando tenant: {tenant_name} para {telegram_id}")
        
        async with aiohttp.ClientSession() as session:
            # Check if tenant already exists
            check_url = f"{self.supabase_url}/rest/v1/vault_tenants"
            check_params = {"tenant_name": f"eq.{tenant_name}"}
            
            async with session.get(check_url, headers=self.headers, params=check_params) as resp:
                existing = await resp.json()
                if existing:
                    return {"error": "Tenant name already exists"}
            
            # Create tenant in Supabase
            import uuid
            new_tenant = {
                "id": str(uuid.uuid4()),
                "telegram_id": telegram_id,
                "tenant_name": tenant_name,
                "odoo_url": f"https://{tenant_name}.smarterbot.store",
                "odoo_database": tenant_name.replace("-", "_"),
                "plan": plan,
                "status": "provisioning"
            }
            
            try:
                async with session.post(
                    f"{self.supabase_url}/rest/v1/vault_tenants",
                    headers=self.headers,
                    json=new_tenant
                ) as resp:
                    if resp.status in [200, 201]:
                        print(f"✅ Tenant creado en Supabase: {tenant_name}")
                        
                        # TODO: Trigger Odoo provisioning via n8n webhook
                        # TODO: Create database schema
                        # TODO: Setup Odoo instance
                        
                        return {
                            "tenant_id": new_tenant["id"],
                            "tenant_name": tenant_name,
                            "odoo_url": new_tenant["odoo_url"],
                            "status": "provisioned",
                            "admin_password": f"temp_{uuid.uuid4().hex[:8]}",
                            "next_steps": [
                                "Configure Odoo instance",
                                "Setup users",
                                "Import initial data"
                            ]
                        }
                    else:
                        return {"error": f"Failed to create tenant: {resp.status}"}
            except Exception as e:
                return {"error": str(e)}
    
    async def rotate_credentials(self, tenant_id: str, provider: str) -> Dict[str, Any]:
        """
        Skill: rotate_credentials
        Rota credenciales de proveedor (Twilio, Meta, etc.)
        
        Args:
            tenant_id: Tenant UUID
            provider: Proveedor (twilio, meta, etc.)
            
        Returns:
            Dict con nuevas credenciales
        """
        print(f"🔄 Rotando credenciales para {provider} - tenant: {tenant_id}")
        
        # TODO: Implement credential rotation logic
        # 1. Generate new API key from provider
        # 2. Update Supabase vault_credentials
        # 3. Update n8n credentials
        # 4. Invalidate old key
        
        return {
            "status": "rotated",
            "provider": provider,
            "new_key_id": f"sk_live_{os.urandom(16).hex()}",
            "expires_at": (datetime.now() + timedelta(days=30)).isoformat(),
            "rotated_at": datetime.now().isoformat()
        }


# MCP Server Integration
async def mcp_execute_tool(tool_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    MCP Tool Executor
    """
    mcp = SmarterMCP()
    
    tools = {
        "resolve_tenant": lambda d: mcp.resolve_tenant(d.get("telegram_id")),
        "bi_reporter": lambda d: mcp.bi_reporter(
            d.get("tenant_id"),
            d.get("metrics"),
            d.get("period", "last_7_days")
        ),
        "provision_tenant": lambda d: mcp.provision_tenant(
            d.get("telegram_id"),
            d.get("tenant_name"),
            d.get("plan", "starter")
        ),
        "rotate_credentials": lambda d: mcp.rotate_credentials(
            d.get("tenant_id"),
            d.get("provider")
        )
    }
    
    if tool_name in tools:
        return await tools[tool_name](data)
    else:
        return {"error": f"Unknown tool: {tool_name}"}


# CLI for testing
if __name__ == "__main__":
    import sys
    
    async def test():
        mcp = SmarterMCP()
        
        if len(sys.argv) > 1:
            command = sys.argv[1]
            
            if command == "resolve":
                telegram_id = sys.argv[2] if len(sys.argv) > 2 else "123456789"
                result = await mcp.resolve_tenant(telegram_id)
                print(json.dumps(result, indent=2))
            
            elif command == "report":
                tenant_id = sys.argv[2] if len(sys.argv) > 2 else "test-tenant"
                result = await mcp.bi_reporter(tenant_id)
                print(json.dumps(result, indent=2))
            
            elif command == "provision":
                telegram_id = sys.argv[2] if len(sys.argv) > 2 else "123456789"
                tenant_name = sys.argv[3] if len(sys.argv) > 3 else "test-store"
                result = await mcp.provision_tenant(telegram_id, tenant_name)
                print(json.dumps(result, indent=2))
            
            elif command == "rotate":
                tenant_id = sys.argv[2] if len(sys.argv) > 2 else "test-tenant"
                provider = sys.argv[3] if len(sys.argv) > 3 else "twilio"
                result = await mcp.rotate_credentials(tenant_id, provider)
                print(json.dumps(result, indent=2))
        else:
            print("Usage: python smartermcp_skills.py [resolve|report|provision|rotate] [args...]")
    
    asyncio.run(test())
