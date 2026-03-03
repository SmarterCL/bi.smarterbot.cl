import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmarterOS v2.1 - Command Center | bi.smarterbot.cl',
  description: 'Production-ready dashboard for SmarterOS v2.1 - Real-time monitoring, documentation, and operational tools',
  keywords: ['SmarterOS', 'Dashboard', 'MCP', 'Monitoring', 'BI', 'SmarterBot'],
  authors: [{ name: 'SmarterBot CL' }],
  openGraph: {
    title: 'SmarterOS v2.1 - Command Center',
    description: 'Production-ready dashboard for SmarterOS v2.1',
    url: 'https://bi.smarterbot.cl',
    siteName: 'SmarterOS',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
