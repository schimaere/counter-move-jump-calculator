import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Counter Move Jump Calculator',
  description: 'Calculate counter moves and jumps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

