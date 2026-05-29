'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Star, Loader2, MessageSquarePlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useAuth } from '@/components/providers/AuthProvider'
import ReviewCard, { type ReviewWithUser } from './ReviewCard'

const schema = z.object({
  review_text: z.string().min(5, 'Please write a short review'),
  project_type: z.string().optional(),
  project_location: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ReviewsSectionProps {
  contractorId: string
  reviews: ReviewWithUser[]
  averageRating: number
  totalReviews: number
}

export default function ReviewsSection({
  contractorId,
  reviews,
  averageRating,
  totalReviews,
}: ReviewsSectionProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0] // index 0 = 1 star … index 4 = 5 stars
    reviews.forEach((r) => {
      const idx = Math.min(5, Math.max(1, r.rating)) - 1
      counts[idx] += 1
    })
    return counts
  }, [reviews])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId,
          rating,
          review_text: data.review_text,
          project_type: data.project_type || undefined,
          project_location: data.project_location || undefined,
        }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? 'Failed to submit review')
      }
      toast.success('Thanks for your review!')
      setOpen(false)
      reset()
      setRating(5)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold" style={{ color: '#1B2A4A' }}>
          Reviews
        </h2>
        {user ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
          >
            <MessageSquarePlus className="h-4 w-4" /> Leave a Review
          </button>
        ) : (
          <a
            href="/auth/login"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold"
            style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
          >
            Sign in to review
          </a>
        )}
      </div>

      {totalReviews > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Summary */}
          <div className="rounded-2xl bg-white p-6" style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}>
            <div className="text-center">
              <p className="font-heading text-5xl font-bold" style={{ color: '#1B2A4A' }}>
                {averageRating.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="mt-5 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star - 1]
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-500">{star}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: '#C9A84C' }}
                      />
                    </div>
                    <span className="w-5 text-right text-gray-400">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* List */}
          <div className="space-y-4 md:col-span-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white py-12 text-center" style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}>
          <Star className="mx-auto mb-3 h-8 w-8 text-gray-200" />
          <p className="font-medium" style={{ color: '#1B2A4A' }}>
            No reviews yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to share your experience.
          </p>
        </div>
      )}

      {/* Review dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg" style={{ color: '#1B2A4A' }}>
              Leave a Review
            </DialogTitle>
            <DialogDescription>
              Share your experience to help other homebuilders.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Your rating
              </label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1
                  const active = (hoverRating || rating) >= value
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                      aria-label={`${value} star${value !== 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          active ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Review
              </label>
              <textarea
                {...register('review_text')}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                placeholder="What was it like working with this contractor?"
              />
              {errors.review_text && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.review_text.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Project type (optional)
                </label>
                <input
                  {...register('project_type')}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                  placeholder="e.g. Two-storey home"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Project location (optional)
                </label>
                <input
                  {...register('project_location')}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                  placeholder="e.g. Cebu City"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Review
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
