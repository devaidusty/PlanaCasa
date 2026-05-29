import ScrollReveal from '@/components/shared/ScrollReveal'

const TESTIMONIALS = [
  {
    stars: 5,
    quote:
      'We bought the OFW Pride Home plan before flying back from Dubai. The package had everything our contractor needed — no delays, no surprises. We moved in 14 months after breaking ground.',
    name: 'Rodel & Marie Santos',
    location: 'Pampanga (formerly based in Dubai)',
    initials: 'RS',
  },
  {
    stars: 5,
    quote:
      'As a first-time builder, I was scared of getting scammed. PlanaCasa\'s guides taught me what questions to ask contractors. The electrical and plumbing plans alone saved me ₱80,000 in contractor markups.',
    name: 'Jennifer Magno',
    location: 'Cebu City',
    initials: 'JM',
  },
  {
    stars: 5,
    quote:
      'The Metro Mini plan was exactly what I needed for my 60sqm lot in QC. Three storeys, roof deck, very modern. My contractor said it was the most detailed plan he\'d ever worked with.',
    name: 'Mark Dela Cruz',
    location: 'Quezon City',
    initials: 'MD',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
              What Homebuilders Are Saying
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-lg">
              Join thousands of Filipino families who built their dream home with PlanaCasa
            </p>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.15}>
              <div
                className="rounded-xl p-8 flex flex-col gap-4 h-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <span key={si} style={{ color: '#C9A84C' }}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm leading-relaxed italic flex-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.location}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
