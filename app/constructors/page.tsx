import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ConstructorsClient, {
  type ConstructorsFilters,
} from '@/components/constructors/ConstructorsClient'
import type { Contractor } from '@/types'

export const metadata: Metadata = {
  title: 'Find Verified Contractors | PlanaCasa Philippines',
  description:
    'Browse verified, licensed home builders and contractors across the Philippines. Filter by province, specialization, and rating, then request a quote.',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0]
  return val
}

export default async function ConstructorsPage({ searchParams }: PageProps) {
  const params = await searchParams

  const province = getString(params.province)
  const search = getString(params.search)
  const verified = getString(params.verified) === 'true'
  const specialization = getString(params.specialization)
  const sort = getString(params.sort) ?? 'featured'

  const supabase = await createClient()
  let query = supabase.from('contractors').select('*')

  if (province) query = query.eq('province', province)
  if (search) query = query.ilike('business_name', `%${search}%`)
  if (verified) query = query.eq('is_verified', true)
  if (specialization) query = query.contains('specializations', [specialization])

  // Featured always float to the top, then apply the chosen sort.
  query = query.order('is_featured', { ascending: false })
  switch (sort) {
    case 'rating':
      query = query.order('average_rating', { ascending: false })
      break
    case 'experience':
      query = query.order('years_experience', { ascending: false })
      break
    default:
      query = query.order('average_rating', { ascending: false })
  }

  const { data } = await query
  const contractors = (data ?? []) as Contractor[]

  const initialFilters: ConstructorsFilters = {
    province,
    search,
    verified,
    specialization,
    sort,
  }

  const count = contractors.length

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Header band */}
      <div className="py-14" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-3 font-heading text-4xl font-bold text-white md:text-5xl">
            Find Trusted Builders Near You
          </h1>
          <p className="mb-4 text-lg text-white/70">
            Connect with verified, licensed contractors across the Philippines.
          </p>
          <p className="text-sm font-medium" style={{ color: '#C9A84C' }}>
            {count === 0
              ? 'No contractors found'
              : `${count} contractor${count !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <Suspense>
        <ConstructorsClient
          initialContractors={contractors}
          initialFilters={initialFilters}
        />
      </Suspense>
    </div>
  )
}
