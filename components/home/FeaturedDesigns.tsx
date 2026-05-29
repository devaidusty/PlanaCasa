'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bed, Bath, Ruler } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DesignCardSkeleton } from '@/components/shared/LoadingSkeleton'
import ScrollReveal from '@/components/shared/ScrollReveal'
import { formatPHPCompact, formatRange } from '@/lib/utils/formatCurrency'
import type { Design, DesignStyle } from '@/types'

const STYLE_LABELS: Record<DesignStyle, string> = {
  modern_filipino: 'Modern Filipino',
  tropical_modern: 'Tropical Modern',
  european_modern: 'European Modern',
  uk_contemporary: 'UK Contemporary',
  scandinavian: 'Scandinavian',
  ofw_dream: 'OFW Dream Home',
  small_lot: 'Small Lot',
  two_storey_rental: '2-Storey + Rental',
  bungalow: 'Bungalow',
}

const STYLE_COLORS: Record<DesignStyle, string> = {
  modern_filipino: 'bg-emerald-500',
  tropical_modern: 'bg-teal-500',
  european_modern: 'bg-amber-500',
  uk_contemporary: 'bg-slate-500',
  scandinavian: 'bg-sky-500',
  ofw_dream: 'bg-purple-500',
  small_lot: 'bg-orange-500',
  two_storey_rental: 'bg-rose-500',
  bungalow: 'bg-stone-500',
}

interface DesignCardProps {
  design: Design
  delay: number
}

function DesignCard({ design, delay }: DesignCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const imageUrl = design.preview_images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(prev => !prev)
  }

  return (
    <ScrollReveal delay={delay}>
      <div className="group relative rounded-xl overflow-hidden bg-white border border-gray-100 hover:-translate-y-0.5 transition-all duration-300"
        style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 40px rgba(27,42,74,0.16)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 20px rgba(27,42,74,0.08)')}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={design.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 400px"
          />

          {/* Style badge */}
          <span className={`absolute top-3 left-3 ${STYLE_COLORS[design.style]} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
            {STYLE_LABELS[design.style]}
          </span>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            aria-label="Add to wishlist"
          >
            <Heart
              className="w-4 h-4"
              fill={wishlisted ? '#C9A84C' : 'none'}
              stroke={wishlisted ? '#C9A84C' : '#6B7280'}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Card body */}
        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold mb-2" style={{ color: '#1B2A4A' }}>
            {design.title}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {design.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {design.bathrooms} bath
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {design.floor_area_sqm}sqm
            </span>
          </div>

          {/* Build cost range */}
          <p className="text-sm text-gray-500 mb-1">
            Build: {formatRange(design.estimated_build_cost_min, design.estimated_build_cost_max)}
          </p>

          {/* Plan price */}
          <p className="text-sm font-semibold mb-3" style={{ color: '#C9A84C' }}>
            From {formatPHPCompact(design.plan_price)}
          </p>

          {/* CTA */}
          <Link
            href={`/design/${design.slug}`}
            className="block w-full text-center py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#1B2A4A' }}
          >
            View Design →
          </Link>
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function FeaturedDesigns() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDesigns = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('featured', true)
        .limit(6)

      if (!error && data) {
        setDesigns(data as Design[])
      }
      setLoading(false)
    }
    fetchDesigns()
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1B2A4A' }}>
              Most Popular Designs
            </h2>
            <p className="text-gray-500 text-lg">
              Hand-picked designs loved by Filipino homebuilders
            </p>
          </div>
        </ScrollReveal>

        {/* Grid / Carousel */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <DesignCardSkeleton key={i} />
            ))}
          </div>
        ) : designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:overflow-visible overflow-x-auto snap-x">
            {designs.map((design, i) => (
              <DesignCard key={design.id} design={design} delay={i * 0.1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>Designs are loading soon. Check back shortly!</p>
          </div>
        )}

        {/* View all CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#1B2A4A' }}
            >
              View All Designs →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
