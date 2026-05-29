import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CustomizationBody {
  designId?: string
  changes_requested?: string
  budget?: number
  contact_phone?: string
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: CustomizationBody
  try {
    body = (await request.json()) as CustomizationBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { designId, changes_requested, budget, contact_phone } = body

  if (!designId || !changes_requested) {
    return NextResponse.json(
      { error: 'designId and changes_requested are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('customization_requests')
    .insert({
      user_id: user.id,
      design_id: designId,
      changes_requested,
      budget: budget ?? null,
      contact_phone: contact_phone ?? null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create request' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: data.id })
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('customization_requests')
    .select(`*, design:designs ( title, slug )`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ requests: data ?? [] })
}
