import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getEmailService, contractorLeadEmail } from '@/lib/email'

const leadSchema = z.object({
  contractorId: z.string().uuid('A valid contractor is required'),
  designId: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(5, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  location: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 }
    )
  }

  const { contractorId, designId, name, phone, email, location, message } =
    parsed.data

  // Optional session — leads may come from anonymous visitors
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('contractor_leads')
    .insert({
      contractor_id: contractorId,
      user_id: user?.id ?? null,
      design_id: designId ?? null,
      name,
      phone,
      email: email || null,
      location: location || null,
      message: message || null,
      status: 'new',
    })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to submit lead' },
      { status: 500 }
    )
  }

  // Fire-and-forget notification email to the contractor
  void (async () => {
    try {
      const { data: contractor } = await admin
        .from('contractors')
        .select('business_name, contact_email')
        .eq('id', contractorId)
        .single()

      let designTitle: string | undefined
      if (designId) {
        const { data: design } = await admin
          .from('designs')
          .select('title')
          .eq('id', designId)
          .single()
        designTitle = design?.title
      }

      if (contractor?.contact_email) {
        const msg = contractorLeadEmail({
          contractorName: contractor.business_name,
          contractorEmail: contractor.contact_email,
          leadName: name,
          leadPhone: phone,
          leadEmail: email || undefined,
          leadLocation: location || undefined,
          message: message || undefined,
          designTitle,
        })
        await getEmailService().send(msg)
      }
    } catch (e) {
      console.error('[api/leads] notification email failed:', e)
    }
  })()

  return NextResponse.json({ id: data.id })
}
