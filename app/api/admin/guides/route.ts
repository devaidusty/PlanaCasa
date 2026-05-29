import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/generateSlug'

interface GuideBody {
  id?: string
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  category?: string
  read_time_minutes?: number
  cover_image?: string
  is_free?: boolean
  tags?: string[]
}

function cleanFields(body: GuideBody) {
  const { id, ...fields } = body
  void id
  return fields
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: GuideBody
  try {
    body = (await request.json()) as GuideBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const fields = cleanFields(body)
  if (!fields.slug) fields.slug = generateSlug(body.title)

  const { data, error } = await admin
    .from('guides')
    .insert(fields)
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create guide' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: GuideBody
  try {
    body = (await request.json()) as GuideBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('guides')
    .update(cleanFields(body))
    .eq('id', body.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { id?: string }
  try {
    body = (await request.json()) as { id?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('guides').delete().eq('id', body.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
