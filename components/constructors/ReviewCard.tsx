'use client'

import { Star } from 'lucide-react'
import { formatRelative } from '@/lib/utils/formatDate'

export interface ReviewWithUser {
  id: string
  rating: number
  review_text: string
  project_type: string | null
  project_location: string | null
  created_at: string
  user?: { full_name: string | null; avatar_url: string | null } | null
}

function getInitials(name: string | null | undefined): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function ReviewCard({ review }: { review: ReviewWithUser }) {
  const name = review.user?.full_name ?? 'PlanaCasa User'

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: '#1B2A4A', color: '#C9A84C' }}
        >
          {getInitials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium" style={{ color: '#1B2A4A' }}>
              {name}
            </p>
            <span className="text-xs text-gray-400">
              {formatRelative(review.created_at)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {(review.project_type || review.project_location) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.project_type && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs"
              style={{ backgroundColor: 'rgba(27,42,74,0.08)', color: '#1B2A4A' }}
            >
              {review.project_type}
            </span>
          )}
          {review.project_location && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs"
              style={{ backgroundColor: 'rgba(201,168,76,0.18)', color: '#9a7d2e' }}
            >
              {review.project_location}
            </span>
          )}
        </div>
      )}

      {review.review_text && (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {review.review_text}
        </p>
      )}
    </div>
  )
}
