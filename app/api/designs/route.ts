import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search')
  const styleParam = searchParams.get('style')
  const bedroomsParam = searchParams.get('bedrooms')
  const bathroomsParam = searchParams.get('bathrooms')
  const floorsParam = searchParams.get('floors')
  const garageParam = searchParams.get('garage')
  const costMin = searchParams.get('cost_min')
  const costMax = searchParams.get('cost_max')
  const sort = searchParams.get('sort') ?? 'featured'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? String(PAGE_SIZE), 10))

  const supabase = await createClient()

  let query = supabase.from('designs').select('*', { count: 'exact' })

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (styleParam) {
    const styles = styleParam.split(',').filter(Boolean)
    if (styles.length === 1) {
      query = query.eq('style', styles[0])
    } else if (styles.length > 1) {
      query = query.in('style', styles)
    }
  }

  if (bedroomsParam) {
    const beds = parseInt(bedroomsParam, 10)
    if (!isNaN(beds)) {
      if (beds >= 5) {
        query = query.gte('bedrooms', 5)
      } else {
        query = query.eq('bedrooms', beds)
      }
    }
  }

  if (bathroomsParam) {
    const baths = parseInt(bathroomsParam, 10)
    if (!isNaN(baths)) {
      if (baths >= 3) {
        query = query.gte('bathrooms', 3)
      } else {
        query = query.eq('bathrooms', baths)
      }
    }
  }

  if (floorsParam) {
    const floors = parseInt(floorsParam, 10)
    if (!isNaN(floors)) {
      query = query.eq('floors', floors)
    }
  }

  if (garageParam === 'true') {
    query = query.eq('garage', true)
  }

  if (costMin) {
    const min = parseInt(costMin, 10)
    if (!isNaN(min)) {
      query = query.gte('estimated_build_cost_min', min)
    }
  }

  if (costMax) {
    const max = parseInt(costMax, 10)
    if (!isNaN(max)) {
      query = query.lte('estimated_build_cost_max', max)
    }
  }

  // Sorting
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

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const total = count ?? 0

  return NextResponse.json({
    designs: data ?? [],
    total,
    page,
    hasMore: from + (data?.length ?? 0) < total,
  })
}
