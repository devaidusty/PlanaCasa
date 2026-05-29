import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'

interface ContractorBody {
  id?: string
  business_name?: string
  owner_name?: string
  description?: string
  city?: string
  province?: string
  region?: string
  coverage_areas?: string[]
  specializations?: string[]
  years_experience?: number
  license_number?: string
  pcab_accredited?: boolean
  prc_licensed?: boolean
  portfolio_images?: string[]
  contact_phone?: string
  contact_email?: string
  contact_messenger?: string
  facebook_page?: string
  price_range_min?: number
  price_range_max?: number
  is_verified?: boolean
  is_featured?: boolean
  listing_tier?: 'free' | 'verified' | 'featured'
}

function cleanFields(body: ContractorBody) {
  const { id, ...fields } = body
  void id
  return fields
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: ContractorBody
  try {
    body = (await request.json()) as ContractorBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.business_name) {
    return NextResponse.json(
      { error: 'Business name is required' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('contractors')
    .insert(cleanFields(body))
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create contractor' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: ContractorBody
  try {
    body = (await request.json()) as ContractorBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('contractors')
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
  const { error } = await admin.from('contractors').delete().eq('id', body.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
