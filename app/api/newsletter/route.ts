import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const issues = parsed.error.issues
    return NextResponse.json(
      { error: issues[0]?.message ?? 'Invalid request' },
      { status: 400 }
    )
  }

  const { email, name, source } = parsed.data
  const supabase = createAdminClient()

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({
    email,
    name: name ?? null,
    source: source ?? 'direct',
    subscribed_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Newsletter insert error:', error)
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
