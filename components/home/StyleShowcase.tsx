import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/shared/ScrollReveal'

const COLUMNS = [
  {
    label: 'European & UK Contemporary',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
    href: '/gallery?style=european_modern',
  },
  {
    label: 'Tropical & Modern Filipino',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    href: '/gallery?style=tropical_modern',
  },
]

export default function StyleShowcase() {
  return (
    <section className="py-20" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              International Styles, Built for Philippine Climate
            </h2>
            <p
              className="font-accent text-xl italic max-w-2xl mx-auto leading-relaxed"
              style={{ color: '#C9A84C' }}
            >
              We adapt European elegance and Scandinavian minimalism to survive typhoons,
              tropical heat, and Philippine soil conditions.
            </p>
          </div>
        </ScrollReveal>

        {/* Two-column image grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {COLUMNS.map((col, i) => (
            <ScrollReveal key={col.label} delay={i * 0.15}>
              <Link
                href={col.href}
                className="group relative block rounded-xl overflow-hidden"
                style={{ height: '500px' }}
              >
                <Image
                  src={col.image}
                  alt={col.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 90vw, 50vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-heading text-2xl font-bold text-white">
                    {col.label}
                  </h3>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
            >
              Explore All Styles →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
