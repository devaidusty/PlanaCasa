import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, Tag, Home, HardHat } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import GuideMarkdown from '@/components/guides/GuideMarkdown'
import GuideCard from '@/components/guides/GuideCard'
import {
  GUIDE_CATEGORY_BAND,
  GUIDE_CATEGORY_COLORS,
  GUIDE_CATEGORY_LABELS,
} from '@/lib/constants/guides'
import type { Guide } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getGuide(slug: string): Promise<Guide | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .single()
  return (data as Guide) ?? null
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuide(slug)
  if (!guide) return { title: 'Guide Not Found | PlanaCasa' }
  return {
    title: `${guide.title} | PlanaCasa Guides`,
    description: guide.excerpt?.slice(0, 155),
  }
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params
  const guide = await getGuide(slug)
  if (!guide) notFound()

  const supabase = await createClient()
  const { data: relatedData } = await supabase
    .from('guides')
    .select('*')
    .eq('category', guide.category)
    .neq('id', guide.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const related = (relatedData ?? []) as Guide[]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Cover band */}
      <div
        className={`h-3 w-full ${GUIDE_CATEGORY_BAND[guide.category]}`}
      />
      <div className="py-12" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="mx-auto max-w-3xl px-4">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{' '}
            ›{' '}
            <Link href="/guides" className="hover:text-white">
              Guides
            </Link>{' '}
            › <span className="text-white/80">{guide.title}</span>
          </div>

          <span
            className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${GUIDE_CATEGORY_COLORS[guide.category]}`}
          >
            {GUIDE_CATEGORY_LABELS[guide.category]}
          </span>
          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">
            {guide.title}
          </h1>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {guide.read_time_minutes} min read
            </span>
            {guide.is_free && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
              >
                Free
              </span>
            )}
            {guide.tags?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                {guide.tags.slice(0, 4).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-10">
        <div
          className="rounded-2xl bg-white p-6 sm:p-10"
          style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
        >
          {guide.excerpt && (
            <p className="mb-6 border-l-4 pl-4 text-lg leading-relaxed text-gray-600" style={{ borderColor: '#C9A84C' }}>
              {guide.excerpt}
            </p>
          )}
          <GuideMarkdown content={guide.content} />
        </div>

        {/* CTA card */}
        <div
          className="mt-8 rounded-2xl p-6 text-white"
          style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #111c31 100%)' }}
        >
          <h3 className="font-heading text-xl font-semibold">Ready to build?</h3>
          <p className="mt-1 text-sm text-white/70">
            Browse climate-adapted designs or connect with a verified contractor.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gallery"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
            >
              <Home className="h-4 w-4" /> Browse Designs
            </Link>
            <Link
              href="/constructors"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <HardHat className="h-4 w-4" /> Find a Contractor
            </Link>
          </div>
        </div>
      </article>

      {/* Related guides */}
      {related.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-14">
          <h2 className="mb-6 font-heading text-2xl font-bold" style={{ color: '#1B2A4A' }}>
            Related Guides
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
