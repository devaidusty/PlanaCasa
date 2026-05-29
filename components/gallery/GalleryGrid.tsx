'use client'

import React from 'react'
import { Search } from 'lucide-react'
import DesignCard from '@/components/gallery/DesignCard'
import { DesignCardSkeleton } from '@/components/shared/LoadingSkeleton'
import ScrollReveal from '@/components/shared/ScrollReveal'
import type { Design } from '@/types'

interface GalleryGridProps {
  designs: Design[]
  loading: boolean
  hasMore: boolean
  wishlistedIds: Set<string>
  onWishlistToggle: (id: string) => void
  sentinelRef: React.RefObject<HTMLDivElement | null>
  onResetFilters: () => void
}

export default function GalleryGrid({
  designs,
  loading,
  hasMore,
  wishlistedIds,
  onWishlistToggle,
  sentinelRef,
  onResetFilters,
}: GalleryGridProps) {
  if (!loading && designs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-heading text-2xl font-semibold mb-2" style={{ color: '#1B2A4A' }}>
          No designs found
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Try adjusting your filters to discover more house plans
        </p>
        <button
          onClick={onResetFilters}
          className="px-6 py-2.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          Reset Filters
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design, i) =>
          i < 6 ? (
            <ScrollReveal key={design.id} delay={i * 0.08}>
              <DesignCard
                design={design}
                isWishlisted={wishlistedIds.has(design.id)}
                onWishlistToggle={onWishlistToggle}
                priority={i < 3}
              />
            </ScrollReveal>
          ) : (
            <DesignCard
              key={design.id}
              design={design}
              isWishlisted={wishlistedIds.has(design.id)}
              onWishlistToggle={onWishlistToggle}
            />
          )
        )}

        {/* Loading skeletons */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <DesignCardSkeleton key={`skel-${i}`} />
          ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4 mt-8" aria-hidden="true" />

      {!hasMore && designs.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          All {designs.length} designs shown
        </p>
      )}
    </div>
  )
}
