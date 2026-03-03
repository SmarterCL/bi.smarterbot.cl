import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// SmarterMCP API Routes for Next.js

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query
  
  if (req.method === 'POST') {
    try {
      switch (action) {
        case 'resolve_tenant':
          return await resolveTenant(req, res)
        case 'bi_reporter':
          return await biReporter(req, res)
        case 'provision_tenant':
          return await provisionTenant(req, res)
        default:
          return res.status(400).json({ error: 'Unknown action' })
      }
    } catch (error) {
      console.error('MCP Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}

async function resolveTenant(req: NextApiRequest, res: NextApiResponse) {
  const { telegram_id } = req.body
  
  if (!telegram_id) {
    return res.status(400).json({ error: 'telegram_id required' })
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  
  const { data, error } = await supabase
    .from('vault_tenants')
    .select('*')
    .eq('telegram_id', telegram_id)
    .single()
  
  if (error || !data) {
    return res.status(404).json({ error: 'Tenant not found' })
  }
  
  return res.status(200).json({
    tenant_id: data.id,
    tenant_name: data.tenant_name,
    odoo_url: data.odoo_url,
    odoo_database: data.odoo_database,
    plan: data.plan,
    status: data.status
  })
}

async function biReporter(req: NextApiRequest, res: NextApiResponse) {
  const { tenant_id, metrics = ['revenue', 'orders', 'conversion'], period = 'last_7_days' } = req.body
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  
  const days = parseInt(period.replace('last_', '').replace('_days', ''))
  const dateFrom = new Date()
  dateFrom.setDate(dateFrom.getDate() - days)
  
  const { data, error } = await supabase
    .from('vault_kpis')
    .select('*')
    .eq('tenant_id', tenant_id)
    .gte('metric_date', dateFrom.toISOString())
  
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  
  // Aggregate metrics
  const report = {
    tenant_id,
    period,
    generated_at: new Date().toISOString(),
    metrics: {} as any,
    kpi_summary: {} as any
  }
  
  for (const metricName of metrics) {
    const metricData = data.filter((k: any) => k.metric_name === metricName)
    if (metricData.length > 0) {
      const values = metricData.map((k: any) => parseFloat(k.metric_value))
      report.metrics[metricName] = {
        current: values[values.length - 1],
        average: values.reduce((a: number, b: number) => a + b, 0) / values.length,
        trend: values[values.length - 1] > values[0] ? 'up' : 'down'
      }
      
      // Format summary
      if (metricName === 'revenue') {
        report.kpi_summary[metricName] = `$${report.metrics[metricName].current.toLocaleString()}`
      } else if (metricName === 'conversion') {
        report.kpi_summary[metricName] = `${report.metrics[metricName].current.toFixed(2)}%`
      } else {
        report.kpi_summary[metricName] = Math.round(report.metrics[metricName].current).toString()
      }
    }
  }
  
  return res.status(200).json(report)
}

async function provisionTenant(req: NextApiRequest, res: NextApiResponse) {
  const { telegram_id, tenant_name, plan = 'starter' } = req.body
  
  if (!telegram_id || !tenant_name) {
    return res.status(400).json({ error: 'telegram_id and tenant_name required' })
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  
  // Check if exists
  const { data: existing } = await supabase
    .from('vault_tenants')
    .select('id')
    .eq('tenant_name', tenant_name)
    .single()
  
  if (existing) {
    return res.status(409).json({ error: 'Tenant name already exists' })
  }
  
  // Create tenant
  const { data, error } = await supabase
    .from('vault_tenants')
    .insert([{
      telegram_id,
      tenant_name,
      odoo_url: `https://${tenant_name}.smarterbot.store`,
      odoo_database: tenant_name.replace(/-/g, '_'),
      plan,
      status: 'provisioning'
    }])
    .select()
    .single()
  
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  
  return res.status(201).json({
    tenant_id: data.id,
    tenant_name: data.tenant_name,
    odoo_url: data.odoo_url,
    status: 'provisioned',
    admin_password: `temp_${Math.random().toString(36).substring(8)}`,
    next_steps: [
      'Configure Odoo instance',
      'Setup users',
      'Import initial data'
    ]
  })
}
