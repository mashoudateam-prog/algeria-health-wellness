import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const sora = Sora({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'Algeria Health & Wellness - Premium Health Tourism',
  description: 'Discover, plan and book your personalized health, wellness and fitness journey in Algeria.',
  keywords: ['health tourism', 'wellness', 'algeria', 'medical tourism', 'fitness'],
  authors: [{ name: 'Algeria Health & Wellness Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'fr_DZ',
    url: 'https://algeriahealthwellness.com',
    siteName: 'Algeria Health & Wellness',
    title: 'Algeria Health & Wellness',
    description: 'Premium Health & Wellness Tourism Platform for Algeria',
    images: [{
      url: 'https://algeriahealthwellness.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Algeria Health & Wellness',
      type: 'image/png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algeria Health & Wellness',
    description: 'Premium Health & Wellness Tourism Platform for Algeria',
    images: ['https://algeriahealthwellness.com/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-background text-text">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
