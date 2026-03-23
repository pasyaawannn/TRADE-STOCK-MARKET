import type { Metadata } from 'next'
import { Rajdhani, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Pasya Stock Market — Professional Stock Analytics',
  description: 'Professional Stock Analytics for the Next Generation Investor',
  keywords: 'IDX, saham, stock, trading, analytics, broker flow, Indonesia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${rajdhani.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-void text-white antialiased">{children}</body>
    </html>
  )
}
