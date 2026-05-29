'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import FilterSidebar from '@/components/gallery/FilterSidebar'
import FilterMobile from '@/components/gallery/FilterMobile'
import type { Design, GalleryFilters } from '@/types'

interface GalleryClientProps {
  initialDesigns: Design[]
  totalCount: number
  initialFilters: GalleryFilters
}

const PAGE_SIZE = 12

function countActiveFilters(filters: GalleryFilters): number {
  let count = 0
  if (filters.search) count++
  if (filters.style && filters.style.length > 0) count++
  if (filters.bedrooms && filters.bedrooms.length > 0) count++
  if (filters.bathrooms && filters.bathrooms.length > 0) count++
  if (filters.floors && filters.floors.length > 0) count++
  if (filters.garage !== undefined) count++
  if (filters.cost_min) count++
  if (filters.cost_max) count++
  return count
}

export default function GalleryClient({
  initialDesigns,
  totalCount,
  initialFilters,
}: GalleryClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [designs, setDesigns] = useState<Design[]>(initialDesigns)
  const [total, setTotal] = useState(totalCount)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(totalCount > initialDesigns.length)
  const [filters, setFilters] = useState<GalleryFilters>(initialFilters)
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set())
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const isFetching = useRef(false)

  // Fetch wishlist on mount if user is logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist')
        if (res.ok) {
          const data = (await res.json()) as { ids: string[] }
          setWishlistedIds(new Set(data.ids))
        }
      } catch {
        // not logged in — ignore
      }
    }
    fetchWishlist()
  }, [])

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, filters, page])

  const buildQueryParams = useCallback(
    (f: GalleryFilters, p: number) => {
      const params = new URLSearchParams()
      if (f.search) params.set('search', f.search)
      if (f.style && f.style.length > 0) params.set('style', f.style.join(','))
      if (f.bedrooms && f.bedrooms.length > 0) params.set('bedrooms', f.bedrooms[0].toString())
      if (f.bathrooms && f.bathrooms.length > 0) params.set('bathrooms', f.bathrooms[0].toString())
      if (f.floors && f.floors.length > 0) params.set('floors', f.floors[0].toString())
      if (f.garage !== undefined) params.set('garage', f.garage.toString())
      if (f.cost_min) params.set('cost_min', f.cost_min.toString())
      if (f.cost_max) params.set('cost_max', f.cost_max.toString())
      if (f.sort && f.sort !== 'featured') params.set('sort', f.sort)
      params.set('page', p.toString())
      return params
    },
    []
  )

  const loadMore = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    setLoading(true)

    const nextPage = page + 1
    const params = buildQueryParams(filters, nextPage)

    try {
      const res = await fetch(`/api/designs?${params.toString()}`)
      if (res.ok) {
        const data = (await res.json()) as { designs: Design[]; total: number; hasMore: boolean }
        setDesigns((prev) => [...prev, ...data.designs])
        setTotal(data.total)
        setHasMore(data.hasMore)
        setPage(nextPage)
      }
    } finally {
      setLoading(false)
      isFetching.current = false
    }
  }, [page, filters, buildQueryParams])

  const applyFilters = useCallback(
    async (newFilters: GalleryFilters) => {
      setLoading(true)
      setPage(1)

      // Update URL
      const params = buildQueryParams(newFilters, 1)
      router.replace(`/gallery?${params.toString()}`, { scroll: false })

      try {
        const res = await fetch(`/api/designs?${params.toString()}`)
        if (res.ok) {
          const data = (await res.json()) as { designs: Design[]; total: number; hasMore: boolean }
          setDesigns(data.designs)
          setTotal(data.total)
          setHasMore(data.hasMore)
        }
      } finally {
        setLoading(false)
      }
    },
    [router, buildQueryParams]
  )

  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      const newFilters = { ...filters, [key]: value }
      setFilters(newFilters)
      applyFilters(newFilters)
    },
    [filters, applyFilters]
  )

  const handleReset = useCallback(() => {
    const empty: GalleryFilters = {}
    setFilters(empty)
    applyFilters(empty)
  }, [applyFilters])

  const handleWishlistToggle = useCallback(async (designId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    const isWishlisted = wishlistedIds.has(designId)

    // Optimistic update
    setWishlistedIds((prev) => {
      const next = new Set(prev)
      if (isWishlisted) {
        next.delete(designId)
      } else {
        next.add(designId)
      }
      return next
    })

    try {
      await fetch('/api/wishlist', {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId }),
      })
    } catch {
      // Rollback on failure
      setWishlistedIds((prev) => {
        const next = new Set(prev)
        if (isWishlisted) {
          next.add(designId)
        } else {
          next.delete(designId)
        }
        return next
      })
    }
  }, [wishlistedIds, router])

  const activeCount = countActiveFilters(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Grid */}
        <GalleryGrid
          designs={designs}
          loading={loading}
          hasMore={hasMore}
          wishlistedIds={wishlistedIds}
          onWishlistToggle={handleWishlistToggle}
          sentinelRef={sentinelRef}
          onResetFilters={handleReset}
        />
      </div>

      {/* Mobile filter */}
      <FilterMobile
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        activeCount={activeCount}
      />
    </div>
  )
}
