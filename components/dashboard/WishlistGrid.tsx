'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import DesignCard from '@/components/gallery/DesignCard'
import type { Design } from '@/types'

export default function WishlistGrid({
  initialDesigns,
}: {
  initialDesigns: Design[]
}) {
  const [designs, setDesigns] = useState<Design[]>(initialDesigns)

  const handleRemove = async (designId: string) => {
    const previous = designs
    // Optimistic removal.
    setDesigns((d) => d.filter((x) => x.id !== designId))

    try {
      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId }),
      })
      if (!res.ok) throw new Error()
      toast.success('Removed from saved designs')
    } catch {
      setDesigns(previous) // rollback
      toast.error('Could not remove. Please try again.')
    }
  }

  if (designs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 text-center">
        <p className="text-navy font-medium mb-1">No saved designs yet</p>
        <p className="text-text-light text-sm mb-5">
          Tap the heart on any design to save it here.
        </p>
        <Link
          href="/gallery"
          className="inline-block gradient-gold text-navy font-semibold rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Browse Designs
        </Link>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          isWishlisted
          onWishlistToggle={handleRemove}
        />
      ))}
    </div>
  )
}
