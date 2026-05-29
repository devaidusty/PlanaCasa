import { Search, CreditCard, Users, Home } from 'lucide-react'
import ScrollReveal from '@/components/shared/ScrollReveal'

const STEPS = [
  {
    number: 1,
    icon: Search,
    title: 'Browse & Choose Your Design',
    description:
      'Browse 50+ ready-made designs across 9 styles. Filter by budget, bedrooms, and location.',
  },
  {
    number: 2,
    icon: CreditCard,
    title: 'Purchase Your Complete Plan Package',
    description:
      'Choose from Basic, Standard, or Premium packages. Instant digital delivery after payment.',
  },
  {
    number: 3,
    icon: Users,
    title: 'Get Matched With A Local Contractor',
    description:
      'Our marketplace connects you with verified, licensed builders in your province.',
  },
  {
    number: 4,
    icon: Home,
    title: 'Build Your Dream Home',
    description:
      'Break ground with confidence. Your plans include everything your contractor needs.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1B2A4A' }}>
              Building Your Dream Home Made Simple
            </h2>
            <p className="text-gray-500 text-lg">
              Four steps from blueprint to move-in day
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="relative">
          {/* Connecting dashed line — desktop only */}
          <div
            className="hidden md:block absolute top-8 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px border-t-2 border-dashed"
            style={{ borderColor: 'rgba(27,42,74,0.2)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <ScrollReveal key={step.number} delay={i * 0.15}>
                  <div className="flex flex-col items-center text-center md:items-center">
                    {/* Step number circle */}
                    <div
                      className="relative w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 mb-4 z-10"
                      style={{ backgroundColor: '#1B2A4A' }}
                    >
                      <Icon className="w-7 h-7" style={{ color: '#C9A84C' }} />
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                        style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
                      >
                        {step.number}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-semibold mb-2" style={{ color: '#1B2A4A' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
