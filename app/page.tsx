import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturedDesigns from '@/components/home/FeaturedDesigns'
import StylesSection from '@/components/home/StylesSection'
import HowItWorks from '@/components/home/HowItWorks'
import WhySection from '@/components/home/WhySection'
import StyleShowcase from '@/components/home/StyleShowcase'
import CalculatorTeaser from '@/components/home/CalculatorTeaser'
import ContractorPreview from '@/components/home/ContractorPreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import GuidesPreview from '@/components/home/GuidesPreview'
import NewsletterSection from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  title: 'PlanaCasa — Ready-Made House Plans for the Philippines',
  description:
    'Browse 50+ ready-made house designs built for the Philippine climate. Find your plan, hire your builder, and build your dream home with confidence.',
  openGraph: {
    title: 'PlanaCasa — Ready-Made House Plans for the Philippines',
    description:
      'Browse 50+ ready-made house designs built for the Philippine climate. Find your plan, hire your builder, and build your dream home.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'PlanaCasa — House Plans for the Philippines',
      },
    ],
    type: 'website',
    locale: 'en_PH',
    siteName: 'PlanaCasa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlanaCasa — Ready-Made House Plans for the Philippines',
    description:
      'Browse 50+ ready-made house designs built for the Philippine climate.',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'],
  },
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturedDesigns />
      <StylesSection />
      <HowItWorks />
      <WhySection />
      <StyleShowcase />
      <CalculatorTeaser />
      <ContractorPreview />
      <TestimonialsSection />
      <GuidesPreview />
      <NewsletterSection />
    </main>
  )
}
