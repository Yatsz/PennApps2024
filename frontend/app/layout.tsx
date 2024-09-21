import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mappedin Web SDK v6 Getting Started',
  description: 'Next.js app with Mappedin SDK',
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