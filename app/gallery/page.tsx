import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import GalleryClient from '@/components/gallery/GalleryClient'
import type { Design, DesignStyle, GalleryFilters } from '@/types'

export const metadata: Metadata = {
  title: 'Browse House Plans | PlanaCasa Philippines',
  description:
    'Explore 50+ premium, climate-adapted house plan designs for the Philippines. Filter by style, bedrooms, budget, and more.',
}

const PAGE_SIZE = 12

interface GalleryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0]
  return val
}

function getNumber(val: string | string[] | undefined): number | undefined {
  const s = getString(val)
  if (!s) return undefined
  const n = parseInt(s, 10)
  return isNaN(n) ? undefined : n
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams

  const search = getString(params.search)
  const styleParam = getString(params.style)
  const bedroomsParam = getNumber(params.bedrooms)
  const bathroomsParam = getNumber(params.bathrooms)
  const floorsParam = getNumber(params.floors)
  const garageParam = getString(params.garage)
  const costMin = getNumber(params.cost_min)
  const costMax = getNumber(params.cost_max)
  const sort = (getString(params.sort) ?? 'featured') as GalleryFilters['sort']
  const page = Math.max(1, getNumber(params.page) ?? 1)

  const supabase = await createClient()
  let query = supabase.from('designs').select('*', { count: 'exact' })

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (styleParam) {
    const styles = styleParam.split(',').filter(Boolean) as DesignStyle[]
    if (styles.length === 1) {
      query = query.eq('style', styles[0])
    } else if (styles.length > 1) {
      query = query.in('style', styles)
    }
  }

  if (bedroomsParam !== undefined) {
    if (bedroomsParam >= 5) {
      query = query.gte('bedrooms', 5)
    } else {
      query = query.eq('bedrooms', bedroomsParam)
    }
  }

  if (bathroomsParam !== undefined) {
    if (bathroomsParam >= 3) {
      query = query.gte('bathrooms', 3)
    } else {
      query = query.eq('bathrooms', bathroomsParam)
    }
  }

  if (floorsParam !== undefined) {
    query = query.eq('floors', floorsParam)
  }

  if (garageParam === 'true') {
    query = query.eq('garage', true)
  }

  if (costMin !== undefined) {
    query = query.gte('estimated_build_cost_min', costMin)
  }

  if (costMax !== undefined) {
    query = query.lte('estimated_build_cost_max', costMax)
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('plan_price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('plan_price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'area':
      query = query.order('floor_area_sqm', { ascending: false })
      break
    case 'bedrooms':
      query = query.order('bedrooms', { ascending: false })
      break
    default:
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data, count } = await query
  const designs = (data ?? []) as Design[]
  const total = count ?? 0

  // Build filters object to pass to client
  const initialFilters: GalleryFilters = {
    search,
    style: styleParam ? (styleParam.split(',').filter(Boolean) as DesignStyle[]) : undefined,
    bedrooms: bedroomsParam !== undefined ? [bedroomsParam] : undefined,
    bathrooms: bathroomsParam !== undefined ? [bathroomsParam] : undefined,
    floors: floorsParam !== undefined ? [floorsParam] : undefined,
    garage: garageParam === 'true' ? true : undefined,
    cost_min: costMin,
    cost_max: costMax,
    sort,
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Gallery header */}
      <div className="py-16" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Browse House Plans
          </h1>
          <p className="text-white/70 text-lg mb-4">
            Find your perfect design from 50+ climate-adapted plans
          </p>
          <p className="text-sm font-medium" style={{ color: '#C9A84C' }}>
            {total === 0
              ? 'No designs found'
              : designs.length < total
              ? `Showing ${designs.length} of ${total} designs`
              : `${total} design${total !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      {/* Client component handles filters + grid */}
      <Suspense>
        <GalleryClient
          initialDesigns={designs}
          totalCount={total}
          initialFilters={initialFilters}
        />
      </Suspense>
    </div>
  )
}
