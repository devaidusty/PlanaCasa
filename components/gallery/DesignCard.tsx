'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bed, Bath, Ruler } from 'lucide-react'
import { formatPHP, formatRange } from '@/lib/utils/formatCurrency'
import type { Design, DesignStyle } from '@/types'

interface DesignCardProps {
  design: Design
  isWishlisted?: boolean
  onWishlistToggle?: (id: string) => void
  priority?: boolean
}

const STYLE_LABELS: Record<DesignStyle, string> = {
  modern_filipino: 'Modern Filipino',
  tropical_modern: 'Tropical Modern',
  european_modern: 'European Modern',
  uk_contemporary: 'UK Contemporary',
  scandinavian: 'Scandinavian',
  ofw_dream: 'OFW Dream',
  small_lot: 'Small Lot',
  two_storey_rental: '2-Storey + Rental',
  bungalow: 'Bungalow',
}

const STYLE_BADGE: Record<DesignStyle, string> = {
  modern_filipino: 'bg-emerald-100 text-emerald-700',
  tropical_modern: 'bg-teal-100 text-teal-700',
  european_modern: 'bg-amber-100 text-amber-700',
  uk_contemporary: 'bg-slate-100 text-slate-700',
  scandinavian: 'bg-sky-100 text-sky-700',
  ofw_dream: 'bg-purple-100 text-purple-700',
  small_lot: 'bg-orange-100 text-orange-700',
  two_storey_rental: 'bg-rose-100 text-rose-700',
  bungalow: 'bg-stone-100 text-stone-700',
}

export default function DesignCard({
  design,
  isWishlisted = false,
  onWishlistToggle,
  priority = false,
}: DesignCardProps) {
  const imageUrl = design.preview_images?.[0]

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onWishlistToggle) {
      onWishlistToggle(design.id)
    }
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={design.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1B2A4A' }}>
            <span className="text-white/60 text-sm">No Preview</span>
          </div>
        )}

        {/* Style badge */}
        <span className={`absolute top-3 left-3 rounded-full text-xs font-medium px-2.5 py-1 ${STYLE_BADGE[design.style]}`}>
          {STYLE_LABELS[design.style]}
        </span>

        {/* Wishlist button */}
        {onWishlistToggle ? (
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className="w-4 h-4"
              fill={isWishlisted ? '#ef4444' : 'none'}
              stroke={isWishlisted ? '#ef4444' : '#6B7280'}
              strokeWidth={2}
            />
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Sign in to wishlist"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-4 h-4" fill="none" stroke="#6B7280" strokeWidth={2} />
          </Link>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold line-clamp-1" style={{ color: '#1B2A4A' }}>
          {design.title}
        </h3>

        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            {design.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {design.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5" />
            {design.floor_area_sqm} sqm
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Build: {formatRange(design.estimated_build_cost_min, design.estimated_build_cost_max)}
        </p>

        <p className="text-base font-semibold mt-1" style={{ color: '#C9A84C' }}>
          Plans from {formatPHP(design.plan_price)}
        </p>

        <Link
          href={`/design/${design.slug}`}
          className="mt-3 w-full text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-colors text-center block"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          View Design
        </Link>
      </div>
    </div>
  )
}
