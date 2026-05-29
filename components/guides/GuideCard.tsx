import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import {
  GUIDE_CATEGORY_BAND,
  GUIDE_CATEGORY_COLORS,
  GUIDE_CATEGORY_LABELS,
} from '@/lib/constants/guides'
import type { Guide } from '@/types'

export default function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg"
    >
      {/* Color band */}
      <div className={`h-2 w-full ${GUIDE_CATEGORY_BAND[guide.category]}`} />

      <div className="flex flex-1 flex-col p-5">
        <span
          className={`mb-3 inline-block self-start rounded-full px-2.5 py-1 text-xs font-medium ${GUIDE_CATEGORY_COLORS[guide.category]}`}
        >
          {GUIDE_CATEGORY_LABELS[guide.category]}
        </span>

        <h3
          className="mb-2 line-clamp-2 font-heading text-lg font-semibold"
          style={{ color: '#1B2A4A' }}
        >
          {guide.title}
        </h3>
        <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-500">
          {guide.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{guide.read_time_minutes} min read</span>
          </div>
          <span
            className="text-sm font-medium group-hover:underline"
            style={{ color: '#C9A84C' }}
          >
            Read Guide →
          </span>
        </div>
      </div>
    </Link>
  )
}
