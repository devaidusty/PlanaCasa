import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import GuideCard from '@/components/guides/GuideCard'
import {
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABELS,
} from '@/lib/constants/guides'
import type { Guide, GuideCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Free Construction Guides for Filipino Homebuilders | PlanaCasa',
  description:
    'Free, expert construction guides for building in the Philippines — foundations, structural, roofing, electrical, plumbing, permits, budgeting, and DIY tips.',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0]
  return val
}

export default async function GuidesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const category = getString(params.category)

  const supabase = await createClient()
  let query = supabase
    .from('guides')
    .select('*')
    .order('created_at', { ascending: false })

  if (category && GUIDE_CATEGORIES.includes(category as GuideCategory)) {
    query = query.eq('category', category)
  }

  const { data } = await query
  const guides = (data ?? []) as Guide[]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Header band */}
      <div className="py-14" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-3 font-heading text-4xl font-bold text-white md:text-5xl">
            Free Construction Guides
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Expert knowledge written for Filipino homebuilders — 100% free.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Category filter pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/guides"
            className={`min-h-9 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !category ? 'text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={!category ? { backgroundColor: '#1B2A4A' } : undefined}
          >
            All
          </Link>
          {GUIDE_CATEGORIES.map((cat) => {
            const active = category === cat
            return (
              <Link
                key={cat}
                href={`/guides?category=${cat}`}
                className={`min-h-9 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                style={active ? { backgroundColor: '#1B2A4A' } : undefined}
              >
                {GUIDE_CATEGORY_LABELS[cat]}
              </Link>
            )
          })}
        </div>

        {/* Grid */}
        {guides.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center" style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}>
            <p className="font-heading text-lg" style={{ color: '#1B2A4A' }}>
              No guides found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try a different category or view all guides.
            </p>
            <Link
              href="/guides"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: '#1B2A4A' }}
            >
              View all guides
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
