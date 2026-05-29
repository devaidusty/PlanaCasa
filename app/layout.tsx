import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

// ─── Fonts ────────────────────────────────────────────────────────────────────

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-accent',
  display: 'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL('https://planacasa.ph'),
  title: {
    template: '%s | PlanaCasa',
    default: 'PlanaCasa — Premium House Plans for the Philippines',
  },
  description:
    'Your Dream Home Starts With The Right Plan — Browse ready-made house designs built for the Philippine climate. Affordable, architect-designed house plans for Filipino families.',
  keywords: [
    'house plan Philippines',
    'bahay design',
    'OFW house plan',
    'bungalow design Philippines',
    'two storey house plan',
    'modern Filipino home',
    'tropical house design',
    'house blueprint Philippines',
    'affordable house plan',
    'PlanaCasa',
  ],
  authors: [{ name: 'PlanaCasa', url: 'https://planacasa.ph' }],
  creator: 'PlanaCasa',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://planacasa.ph',
    siteName: 'PlanaCasa',
    title: 'PlanaCasa — Premium House Plans for the Philippines',
    description:
      'Browse ready-made architect-designed house plans built for the Philippine climate. Modern Filipino, tropical, European, OFW dream homes and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PlanaCasa — House Plan Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlanaCasa — Premium House Plans for the Philippines',
    description:
      'Browse ready-made architect-designed house plans built for the Philippine climate.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={[
        playfairDisplay.variable,
        inter.variable,
        cormorantGaramond.variable,
        'h-full antialiased',
      ].join(' ')}
    >
      <body className="min-h-full flex flex-col bg-pc-bg pb-16 md:pb-0">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomNav />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1B2A4A',
                color: '#F8F5F0',
                border: '1px solid rgba(201,168,76,0.3)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
