import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, ArrowRight, LayoutGrid, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'PlanaCasa — Premium House Plans for the Philippines',
  description:
    'Your Dream Home Starts With The Right Plan — Browse ready-made house designs built for the Philippine climate.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen gradient-navy">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center shadow-gold mb-8">
          <Home className="w-9 h-9 text-navy" strokeWidth={2.5} />
        </div>

        {/* Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full border border-gold/40 text-gold text-xs font-accent tracking-widest uppercase mb-6">
          House Plan Marketplace — Philippines
        </span>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-white max-w-3xl leading-tight mb-6">
          Your Dream Home Starts With{' '}
          <span className="text-gradient-gold">The Right Plan</span>
        </h1>

        <p className="text-warm-white/70 text-lg sm:text-xl max-w-xl leading-relaxed mb-10">
          Browse architect-designed house plans built for the Philippine climate, culture,
          and budget — from cozy bungalows to OFW dream homes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/gallery"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold text-navy font-semibold text-base hover:bg-gold-light transition-colors shadow-gold"
          >
            Browse Designs
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-warm-white font-medium text-base hover:border-gold hover:text-gold transition-colors"
          >
            Cost Calculator
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-sm">
          {[
            { value: '12+', label: 'House Designs' },
            { value: '9',   label: 'Style Categories' },
            { value: '100%', label: 'PRC Licensed' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-heading text-2xl font-bold text-gold">{value}</p>
              <p className="text-warm-white/50 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick nav cards */}
      <section className="max-w-4xl mx-auto w-full px-4 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickCard
          href="/gallery"
          icon={LayoutGrid}
          title="Browse All Designs"
          description="12 ready-made plans across 9 Filipino styles"
        />
        <QuickCard
          href="/calculator"
          icon={Calculator}
          title="Cost Calculator"
          description="Estimate your build cost by region and quality"
        />
      </section>

      {/* Development notice */}
      <div className="text-center pb-8">
        <p className="text-warm-white/30 text-xs font-accent tracking-wider">
          Full homepage launching in Phase 2 — foundation complete
        </p>
      </div>
    </div>
  )
}

function QuickCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-white/10 transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/25 transition-colors">
        <Icon className="w-5 h-5 text-gold" />
      </div>
      <div>
        <h3 className="font-heading text-base font-semibold text-warm-white group-hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="text-warm-white/55 text-sm mt-0.5">{description}</p>
      </div>
    </Link>
  )
}
