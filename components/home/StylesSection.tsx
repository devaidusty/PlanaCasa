'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/shared/ScrollReveal'

const STYLES = [
  { emoji: '🏡', label: 'Modern Filipino', value: 'modern_filipino' },
  { emoji: '🌴', label: 'Tropical Modern', value: 'tropical_modern' },
  { emoji: '🏰', label: 'European Modern', value: 'european_modern' },
  { emoji: '🏙️', label: 'UK Contemporary', value: 'uk_contemporary' },
  { emoji: '❄️', label: 'Scandinavian', value: 'scandinavian' },
  { emoji: '✈️', label: 'OFW Dream Home', value: 'ofw_dream' },
  { emoji: '📐', label: 'Small Lot', value: 'small_lot' },
  { emoji: '🏢', label: '2-Storey + Rental', value: 'two_storey_rental' },
  { emoji: '🏠', label: 'Bungalow', value: 'bungalow' },
]

const FEATURED_STYLES = [
  {
    value: 'modern_filipino',
    label: 'Modern Filipino',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  },
  {
    value: 'ofw_dream',
    label: 'OFW Dream Home',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
  {
    value: 'european_modern',
    label: 'European Modern',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
  },
]

export default function StylesSection() {
  const [activeStyle, setActiveStyle] = useState('')
  const router = useRouter()

  const handleStyleClick = (value: string) => {
    setActiveStyle(prev => (prev === value ? '' : value))
    router.push(`/gallery?style=${value}`)
  }

  return (
    <section className="py-20" style={{ backgroundColor: '#F8F5F0' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1B2A4A' }}>
              Find Your Style
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From tropical modernist to European grandeur — designed for the Philippine climate
            </p>
          </div>
        </ScrollReveal>

        {/* Style pills — horizontal scroll */}
        <ScrollReveal delay={0.1}>
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
            {STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => handleStyleClick(style.value)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                  activeStyle === style.value
                    ? 'text-white border-transparent'
                    : 'border-gray-200 text-gray-700 hover:text-white hover:border-transparent'
                }`}
                style={
                  activeStyle === style.value
                    ? { backgroundColor: '#1B2A4A', borderColor: '#1B2A4A' }
                    : undefined
                }
                onMouseEnter={e => {
                  if (activeStyle !== style.value) {
                    e.currentTarget.style.backgroundColor = '#1B2A4A'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.borderColor = '#1B2A4A'
                  }
                }}
                onMouseLeave={e => {
                  if (activeStyle !== style.value) {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.color = ''
                    e.currentTarget.style.borderColor = ''
                  }
                }}
              >
                <span>{style.emoji}</span>
                <span>{style.label}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured style preview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {FEATURED_STYLES.map((style, i) => (
            <ScrollReveal key={style.value} delay={i * 0.12}>
              <Link
                href={`/gallery?style=${style.value}`}
                className="group relative block rounded-xl overflow-hidden"
                style={{ height: '380px' }}
              >
                <Image
                  src={style.image}
                  alt={style.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 90vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading text-xl font-bold text-white mb-2">{style.label}</h3>
                  <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full text-white border border-white/40 group-hover:border-white transition-colors">
                    Browse →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
