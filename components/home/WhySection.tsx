'use client'

import { Shield, FileText, Star } from 'lucide-react'
import ScrollReveal from '@/components/shared/ScrollReveal'

const CARDS = [
  {
    icon: Shield,
    title: 'Climate-Adapted Designs',
    description:
      'Every design includes typhoon resistance ratings, flood-elevation notes, and ventilation strategies tuned for Philippine provinces.',
  },
  {
    icon: FileText,
    title: 'Complete Construction Details',
    description:
      'Our plans include structural, electrical, plumbing, and finishing specifications — everything your contractor needs to build.',
  },
  {
    icon: Star,
    title: 'Verified Local Contractors',
    description:
      'Our marketplace lists only licensed, PCAB-accredited builders who\'ve been vetted and reviewed by real homebuilders.',
  },
]

export default function WhySection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F8F5F0' }}>
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold" style={{ color: '#1B2A4A' }}>
              Why Choose PlanaCasa?
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <ScrollReveal key={card.title} delay={i * 0.15}>
                <div
                  className="bg-white rounded-xl p-8 border border-transparent hover:border-yellow-200 transition-all duration-300 group cursor-default"
                  style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 40px rgba(27,42,74,0.16)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 20px rgba(27,42,74,0.08)')}
                >
                  {/* Icon circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{ backgroundColor: 'rgba(201,168,76,0.12)' }}
                  >
                    <Icon className="w-7 h-7" style={{ color: '#C9A84C' }} />
                  </div>

                  <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: '#1B2A4A' }}>
                    {card.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {card.description}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
