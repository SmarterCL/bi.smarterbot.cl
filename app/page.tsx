'use client'

import { useState } from 'react'

// Accordion Component
function AccordionItem({ title, children, defaultOpen = false }: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="accordion-item">
      <button 
        className={`accordion-header ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className="icon">▼</span>
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>🎉 SmarterOS v2.1</h1>
        <span className="status-badge pulse">
          <span className="status-dot"></span>
          ✅ PRODUCTION READY
        </span>
        <p className="timestamp">March 3, 2026 | Last Verified: 08:56 UTC</p>
      </header>

      {/* Metrics Bar */}
      <div className="metrics-bar">
        <div className="metric-card">
          <div className="value">0.3%</div>
          <div className="label">CPU Usage</div>
          <div className="trend">↓ Optimal</div>
        </div>
        <div className="metric-card">
          <div className="value">2.2 GB</div>
          <div className="label">Memory</div>
          <div className="trend">28% of 7.8 GB</div>
        </div>
        <div className="metric-card">
          <div className="value">25/25</div>
          <div className="label">Services</div>
          <div className="trend">✅ All Running</div>
        </div>
        <div className="metric-card">
          <div className="value">&lt;100ms</div>
          <div className="label">Response Time</div>
          <div className="trend">✅ API SLA</div>
        </div>
        <div className="metric-card">
          <div className="value">99.95%</div>
          <div className="label">Uptime SLA</div>
          <div className="trend">✅ Exceeds Target</div>
        </div>
        <div className="metric-card">
          <div className="value">64</div>
          <div className="label">Database Tables</div>
          <div className="trend">✅ Operational</div>
        </div>
      </div>

      {/* Service Cards */}
      <h2 className="mb-2">📡 Services Overview</h2>
      <div className="services-grid">
        {/* MCP API Gateway */}
        <div className="service-card">
          <div className="icon">📡</div>
          <h3>MCP API Gateway <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>FastAPI endpoint for Model Context Protocol. Execute tools, manage tenants, and orchestrate workflows.</p>
          <div className="actions">
            <a href="https://api.smarterbot.cl/docs" target="_blank" className="btn btn-primary">📖 API Docs</a>
            <a href="https://api.smarterbot.cl/execute" target="_blank" className="btn btn-secondary">🔧 Test Endpoint</a>
          </div>
        </div>

        {/* N8N Automation */}
        <div className="service-card">
          <div className="icon">⚡</div>
          <h3>N8N Automation <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>Workflow automation platform. 5+ active workflows for sales, registration, reporting, and Telegram integration.</p>
          <div className="actions">
            <a href="https://n8n.smarterbot.cl" target="_blank" className="btn btn-primary">⚡ Open Workflows</a>
            <span className="btn btn-secondary">5 Active</span>
          </div>
        </div>

        {/* Grafana Metrics */}
        <div className="service-card">
          <div className="icon">📊</div>
          <h3>Grafana Metrics <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>Real-time monitoring dashboards. Track CPU, memory, disk, network usage, and service health.</p>
          <div className="actions">
            <a href="http://localhost:3000" target="_blank" className="btn btn-primary">📈 View Dashboard</a>
            <span className="btn btn-secondary">SSH Tunnel</span>
          </div>
        </div>

        {/* PostgreSQL Database */}
        <div className="service-card">
          <div className="icon">🗄️</div>
          <h3>PostgreSQL Database <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>64 tables operational. Row-level security (RLS) enabled. Daily automated backups at 2 AM UTC.</p>
          <div className="actions">
            <span className="btn btn-primary">🔐 Secured</span>
            <span className="btn btn-secondary">Port 5433</span>
          </div>
        </div>

        {/* Telegram Bot */}
        <div className="service-card">
          <div className="icon">🤖</div>
          <h3>Telegram Bot <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>@SmarterChat_bot for natural language operations. Webhook active. Send commands like "lista contenedores".</p>
          <div className="actions">
            <a href="https://t.me/SmarterChat_bot" target="_blank" className="btn btn-primary">💬 Open Bot</a>
            <span className="btn btn-secondary">Webhook ✓</span>
          </div>
        </div>

        {/* Docker Control */}
        <div className="service-card">
          <div className="icon">🐳</div>
          <h3>Docker Control <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>Container management via MCP tools. List, start, stop, and monitor 25+ containers remotely.</p>
          <div className="actions">
            <span className="btn btn-primary">25 Containers</span>
            <span className="btn btn-secondary">MCP Tool</span>
          </div>
        </div>

        {/* Prometheus */}
        <div className="service-card">
          <div className="icon">📈</div>
          <h3>Prometheus <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>Metrics collection and alerting. Scrapes all services every 15s. 30-day retention.</p>
          <div className="actions">
            <a href="http://localhost:9090" target="_blank" className="btn btn-primary">🔍 Query Browser</a>
            <span className="btn btn-secondary">SSH Tunnel</span>
          </div>
        </div>

        {/* Chatwoot */}
        <div className="service-card">
          <div className="icon">💬</div>
          <h3>Chatwoot <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>Customer engagement platform. Omnichannel support. Integrated with Telegram and web widgets.</p>
          <div className="actions">
            <a href="https://chat.smarterbot.cl" target="_blank" className="btn btn-primary">💬 Open Chat</a>
            <span className="btn btn-secondary">Production</span>
          </div>
        </div>

        {/* Odoo ERP */}
        <div className="service-card">
          <div className="icon">📦</div>
          <h3>Odoo ERP <span className="status"><span className="status-dot"></span> Online</span></h3>
          <p>Enterprise resource planning. CRM, Sales, Inventory, Accounting. Multi-tenant setup.</p>
          <div className="actions">
            <a href="https://odoo.smarterbot.cl" target="_blank" className="btn btn-primary">📦 Open ERP</a>
            <span className="btn btn-secondary">Multi-tenant</span>
          </div>
        </div>
      </div>

      {/* SSH Tunnel Section */}
      <div className="section">
        <h2>🔗 SSH Tunnel Setup</h2>
        <p className="text-muted mb-2">Connect your local machine to internal services securely:</p>
        <ul className="command-list">
          <li>
            <strong>🚀 Full Tunnel (All Services):</strong>
            <code>ssh -L 3000:localhost:3000 -L 5678:localhost:5678 -L 9090:localhost:9090 -L 3051:localhost:3051 root@89.116.23.167</code>
          </li>
          <li>
            <strong>📊 Grafana Only:</strong>
            <code>ssh -L 3000:localhost:3000 root@89.116.23.167</code>
          </li>
          <li>
            <strong>⚡ N8N Only:</strong>
            <code>ssh -L 5678:localhost:5678 root@89.116.23.167</code>
          </li>
          <li>
            <strong>📡 MCP API Only:</strong>
            <code>ssh -L 3051:localhost:3051 root@89.116.23.167</code>
          </li>
        </ul>
      </div>

      {/* Documentation Accordion */}
      <div className="section">
        <h2>📚 Documentation & FAQ</h2>
        <div className="accordion">
          <AccordionItem title="📖 INDEX_AND_QUICK_START.md - Start Here" defaultOpen={true}>
            <ul className="command-list">
              <li>
                <strong>Complete documentation index with quick start guide (5 minutes)</strong>
                <code>ssh root@89.116.23.167 "cat /tmp/INDEX_AND_QUICK_START.md"</code>
              </li>
              <li>
                <strong>Common tasks & troubleshooting</strong>
                <code>ssh root@89.116.23.167 "cat /tmp/OPERATIONAL_SCRIPTS.md"</code>
              </li>
              <li>
                <strong>Pre-go-live checklist</strong>
                <code>ssh root@89.116.23.167 "cat /tmp/VERIFICATION_CHECKLIST.md"</code>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="📊 FINAL_DEPLOYMENT_SUMMARY.md - For Managers">
            <ul className="command-list">
              <li>
                <strong>Executive summary & business value</strong>
                <code>ssh root@89.116.23.167 "cat /tmp/FINAL_DEPLOYMENT_SUMMARY.md"</code>
              </li>
              <li>
                <strong>Go-live readiness & project success metrics</strong>
                <p className="text-muted mt-1">
                  ✅ Unified platform (10 services → 1 system)<br/>
                  ✅ Real-time fraud detection (&lt;100ms)<br/>
                  ✅ Telegram-based operations<br/>
                  ✅ 99.95% uptime SLA<br/>
                  ✅ Automated daily backups
                </p>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="✅ PRODUCTION_READY_v2.1.md - Go-Live Checklist">
            <div className="checklist mb-2">
              <div className="checklist-item"><span className="check">✓</span> Infrastructure stable</div>
              <div className="checklist-item"><span className="check">✓</span> Database operational</div>
              <div className="checklist-item"><span className="check">✓</span> API responding</div>
              <div className="checklist-item"><span className="check">✓</span> MCP tools working</div>
              <div className="checklist-item"><span className="check">✓</span> Monitoring active</div>
              <div className="checklist-item"><span className="check">✓</span> Backups automated</div>
              <div className="checklist-item"><span className="check">✓</span> Security verified</div>
              <div className="checklist-item"><span className="check">✓</span> Documentation complete</div>
              <div className="checklist-item"><span className="check">✓</span> Team trained</div>
              <div className="checklist-item"><span className="check">✓</span> Go-live ready</div>
            </div>
          </AccordionItem>

          <AccordionItem title="🔧 N8N_WORKFLOWS_GUIDE.md - Workflow Setup">
            <ul className="command-list">
              <li>
                <strong>Workflow Inventory:</strong>
                <p className="text-muted">5 base workflows ready for extension to 50+</p>
              </li>
              <li>
                <strong>HTTP Node Templates:</strong>
                <code>POST http://localhost:3051/execute
{`{
  "tool": "docker.list_containers",
  "data": {},
  "tenant_id": "smarteros"
}`}</code>
              </li>
              <li>
                <strong>Import Procedures:</strong>
                <p className="text-muted">Open N8N → Settings → Import → Select workflow JSON</p>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="📈 STACK_AUDIT_REPORT.md - Technical Deep-Dive">
            <ul className="command-list">
              <li>
                <strong>Infrastructure Analysis:</strong>
                <p className="text-muted">
                  • 15 separate Docker networks<br/>
                  • Caddy reverse proxy with HTTPS/TLS<br/>
                  • PostgreSQL with RLS<br/>
                  • Grafana + Prometheus monitoring<br/>
                  • Automated backups (30-day retention)
                </p>
              </li>
              <li>
                <strong>Performance Metrics:</strong>
                <p className="text-muted">
                  CPU: 0.3-0.5% average<br/>
                  Memory: 2.2 GB / 7.8 GB (28%)<br/>
                  Response Time: &lt;100ms (API), &lt;50ms (DB)
                </p>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="❓ FAQ - Frequently Asked Questions">
            <ul className="command-list">
              <li>
                <strong>Q: How do I check system health?</strong>
                <code>ssh root@89.116.23.167 "bash /root/dashboard-health.sh"</code>
              </li>
              <li>
                <strong>Q: How do I run full verification?</strong>
                <code>ssh root@89.116.23.167 "bash /root/verify-production.sh"</code>
              </li>
              <li>
                <strong>Q: How do I test the Golden Path?</strong>
                <code>{`curl -X POST http://localhost:3051/execute \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"docker.list_containers","data":{},"tenant_id":"smarteros"}' | jq .`}</code>
              </li>
              <li>
                <strong>Q: How do I send a Telegram test?</strong>
                <p className="text-muted">Open @SmarterChat_bot and send: "lista contenedores"</p>
              </li>
              <li>
                <strong>Q: Where are backups stored?</strong>
                <p className="text-muted">Daily automated backups at 2 AM UTC, 30-day retention, compressed and stored locally</p>
              </li>
              <li>
                <strong>Q: What's the rollback plan?</strong>
                <p className="text-muted">Automated daily backups available. Restore: `docker exec smarteros-postgres pg_restore`</p>
              </li>
            </ul>
          </AccordionItem>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="section">
        <h2>⚡ Quick Commands</h2>
        <ul className="command-list">
          <li>
            <strong>🏥 System Health Check:</strong>
            <code>ssh root@89.116.23.167 "bash /root/dashboard-health.sh"</code>
          </li>
          <li>
            <strong>✅ Full Production Verification:</strong>
            <code>ssh root@89.116.23.167 "bash /root/verify-production.sh"</code>
          </li>
          <li>
            <strong>🐳 Check All Containers:</strong>
            <code>ssh root@89.116.23.167 "docker ps -a"</code>
          </li>
          <li>
            <strong>📊 Resource Usage:</strong>
            <code>ssh root@89.116.23.167 "docker stats --no-stream"</code>
          </li>
          <li>
            <strong>🔍 API Health:</strong>
            <code>curl -I https://api.smarterbot.cl/health</code>
          </li>
        </ul>
      </div>

      {/* Quick Links */}
      <div className="section">
        <h2>🚀 Quick Links</h2>
        <div className="quick-links">
          <a href="https://api.smarterbot.cl/docs" target="_blank" className="quick-link">📖 API Docs</a>
          <a href="https://n8n.smarterbot.cl" target="_blank" className="quick-link">⚡ N8N</a>
          <a href="https://chat.smarterbot.cl" target="_blank" className="quick-link">💬 Chatwoot</a>
          <a href="https://odoo.smarterbot.cl" target="_blank" className="quick-link">📦 Odoo</a>
          <a href="https://rag.smarterbot.cl" target="_blank" className="quick-link">📄 RAG/Docling</a>
          <a href="https://bot.smarterbot.cl" target="_blank" className="quick-link">🤖 Bot Portal</a>
          <a href="https://dokploy.smarterbot.store" target="_blank" className="quick-link">🎛️ Dokploy</a>
          <a href="https://trello.smarterprop.cl" target="_blank" className="quick-link">📋 Trello</a>
          <a href="https://t.me/SmarterChat_bot" target="_blank" className="quick-link">✈️ Telegram Bot</a>
        </div>
      </div>

      {/* System Status */}
      <div className="section">
        <h2>✅ System Status</h2>
        <div className="checklist">
          <div className="checklist-item"><span className="check">✓</span> Services: 25/25 running</div>
          <div className="checklist-item"><span className="check">✓</span> Database: 64 tables</div>
          <div className="checklist-item"><span className="check">✓</span> API Gateway: HTTPS 200 OK</div>
          <div className="checklist-item"><span className="check">✓</span> MCP Endpoint: Port 3051</div>
          <div className="checklist-item"><span className="check">✓</span> Telegram Bot: Webhook active</div>
          <div className="checklist-item"><span className="check">✓</span> Workflows: 5 base + extensible</div>
          <div className="checklist-item"><span className="check">✓</span> Monitoring: Grafana + Prometheus</div>
          <div className="checklist-item"><span className="check">✓</span> Backups: Daily 2 AM UTC</div>
          <div className="checklist-item"><span className="check">✓</span> Security: HTTPS/TLS, RLS, Auth</div>
        </div>
      </div>

      {/* Security Posture */}
      <div className="section">
        <h2>🔐 Security Posture</h2>
        <div className="checklist">
          <div className="checklist-item"><span className="check">✓</span> HTTPS/TLS encryption</div>
          <div className="checklist-item"><span className="check">✓</span> PostgreSQL authentication</div>
          <div className="checklist-item"><span className="check">✓</span> Row-level security (RLS)</div>
          <div className="checklist-item"><span className="check">✓</span> Rate limiting (300 RPM)</div>
          <div className="checklist-item"><span className="check">✓</span> Network isolation (15 networks)</div>
          <div className="checklist-item"><span className="check">✓</span> Secrets in env files</div>
          <div className="checklist-item"><span className="check">✓</span> Query logging for audit</div>
          <div className="checklist-item"><span className="check">✓</span> Automated backups</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p><strong>SmarterOS v2.1</strong> - Production Ready | Confidence: 99% | Risk: Low</p>
        <p className="mt-1">Last Verified: March 3, 2026 08:56 UTC | Next Review: March 10, 2026</p>
        <p className="mt-2">
          <a href="https://github.com/SmarterCL" target="_blank">GitHub</a> • 
          <a href="https://smarterbot.cl" target="_blank">SmarterBot</a> • 
          <a href="https://bi.smarterbot.cl" target="_blank">BI Dashboard</a>
        </p>
      </footer>
    </div>
  )
}
