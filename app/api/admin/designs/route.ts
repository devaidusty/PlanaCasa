import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/generateSlug'
import { DEFAULT_PACKAGES } from '@/lib/constants/designStyles'

interface DesignBody {
  id?: string
  title?: string
  slug?: string
  description?: string
  style?: string
  bedrooms?: number
  bathrooms?: number
  floor_area_sqm?: number
  lot_area_sqm?: number
  estimated_build_cost_min?: number
  estimated_build_cost_max?: number
  plan_price?: number
  floors?: number
  garage?: boolean
  featured?: boolean
  climate_notes?: string
  preview_images?: string[]
  floor_plan_images?: string[]
  tags?: string[]
  createDefaultPackages?: boolean
}

function cleanFields(body: DesignBody) {
  const {
    id,
    createDefaultPackages,
    ...fields
  } = body
  void id
  void createDefaultPackages
  return fields
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: DesignBody
  try {
    body = (await request.json()) as DesignBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const fields = cleanFields(body)
  if (!fields.slug) fields.slug = generateSlug(body.title)

  const { data: design, error } = await admin
    .from('designs')
    .insert(fields)
    .select('id')
    .single()

  if (error || !design) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create design' },
      { status: 500 }
    )
  }

  if (body.createDefaultPackages) {
    const rows = DEFAULT_PACKAGES.map((p) => ({
      design_id: design.id,
      package_name: p.package_name,
      price: p.price,
      includes: p.includes,
      file_urls: [] as string[],
    }))
    const { error: pkgError } = await admin
      .from('design_packages')
      .insert(rows)
    if (pkgError) {
      return NextResponse.json(
        { id: design.id, warning: `Design created but packages failed: ${pkgError.message}` },
        { status: 201 }
      )
    }
  }

  return NextResponse.json({ id: design.id }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: DesignBody
  try {
    body = (await request.json()) as DesignBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const fields = cleanFields(body)

  const { error } = await admin
    .from('designs')
    .update(fields)
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
  const { error } = await admin.from('designs').delete().eq('id', body.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
