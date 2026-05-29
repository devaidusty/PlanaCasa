import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const reviewSchema = z.object({
  contractorId: z.string().uuid('A valid contractor is required'),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().min(5, 'Please write a short review'),
  project_type: z.string().optional(),
  project_location: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 }
    )
  }

  const { contractorId, rating, review_text, project_type, project_location } =
    parsed.data

  // Insert via the user's RLS-scoped client (WITH CHECK auth.uid() = user_id)
  const { data, error } = await supabase
    .from('contractor_reviews')
    .insert({
      contractor_id: contractorId,
      user_id: user.id,
      rating,
      review_text,
      project_type: project_type || null,
      project_location: project_location || null,
    })
    .select('id')
    .single()

  if (error) {
    // 23505 = unique_violation on UNIQUE(contractor_id, user_id)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You have already reviewed this contractor.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
