'use client'

import AnimatedCounter from '@/components/shared/AnimatedCounter'
import ScrollReveal from '@/components/shared/ScrollReveal'

const stats = [
  { target: 50, suffix: '+', label: 'House Designs' },
  { target: 9, suffix: '', label: 'Design Styles' },
  { target: 80, suffix: '+', label: 'Regions Covered' },
  { target: 1000, suffix: '+', label: 'OFW Families Served' },
]

export default function StatsSection() {
  return (
    <section className="py-16" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center px-6">
                {/* Vertical divider — visible between items on md+ */}
                {i > 0 && (
                  <div
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  />
                )}
                <span className="text-4xl font-bold font-heading" style={{ color: '#C9A84C' }}>
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                  />
                </span>
                <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
