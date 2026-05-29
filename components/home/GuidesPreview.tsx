'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GuideCardSkeleton } from '@/components/shared/LoadingSkeleton'
import ScrollReveal from '@/components/shared/ScrollReveal'
import type { Guide, GuideCategory } from '@/types'

const CATEGORY_COLORS: Record<GuideCategory, string> = {
  foundation: 'bg-amber-100 text-amber-700',
  structural: 'bg-orange-100 text-orange-700',
  roofing: 'bg-slate-100 text-slate-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  plumbing: 'bg-blue-100 text-blue-700',
  finishing: 'bg-purple-100 text-purple-700',
  permits: 'bg-green-100 text-green-700',
  budgeting: 'bg-emerald-100 text-emerald-700',
  diy_tips: 'bg-pink-100 text-pink-700',
}

const CATEGORY_BAND: Record<GuideCategory, string> = {
  foundation: 'bg-amber-400',
  structural: 'bg-orange-400',
  roofing: 'bg-slate-400',
  electrical: 'bg-yellow-400',
  plumbing: 'bg-blue-400',
  finishing: 'bg-purple-400',
  permits: 'bg-green-400',
  budgeting: 'bg-emerald-400',
  diy_tips: 'bg-pink-400',
}

const CATEGORY_LABELS: Record<GuideCategory, string> = {
  foundation: 'Foundation',
  structural: 'Structural',
  roofing: 'Roofing',
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  finishing: 'Finishing',
  permits: 'Permits',
  budgeting: 'Budgeting',
  diy_tips: 'DIY Tips',
}

export default function GuidesPreview() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuides = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('is_free', true)
        .limit(3)

      if (!error && data) {
        setGuides(data as Guide[])
      }
      setLoading(false)
    }
    fetchGuides()
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1B2A4A' }}>
              Build Smart With Our Free Guides
            </h2>
            <p className="text-gray-500 text-lg">
              Expert construction knowledge written for Filipino homebuilders — 100% free
            </p>
          </div>
        </ScrollReveal>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <GuideCardSkeleton key={i} />
            ))}
          </div>
        ) : guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide, i) => (
              <ScrollReveal key={guide.id} delay={i * 0.12}>
                <div className="rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  {/* Color band */}
                  <div className={`h-2 w-full ${CATEGORY_BAND[guide.category]}`} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Category badge */}
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 self-start ${CATEGORY_COLORS[guide.category]}`}>
                      {CATEGORY_LABELS[guide.category]}
                    </span>

                    <h3 className="font-heading text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#1B2A4A' }}>
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                      {guide.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{guide.read_time_minutes} min read</span>
                      </div>
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#C9A84C' }}
                      >
                        Read Guide →
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Free guides coming soon!</p>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-10">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border-2 transition-all hover:bg-[#1B2A4A] hover:text-white"
              style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
            >
              View All Free Guides →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
