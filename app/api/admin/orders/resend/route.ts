import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { getEmailService, purchaseConfirmationEmail } from '@/lib/email'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

interface PurchaseJoin {
  id: string
  amount_paid: number
  currency: string
  design: { title: string } | null
  package: { package_name: string } | null
  user: { email: string; full_name: string } | null
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { purchaseId?: string }
  try {
    body = (await request.json()) as { purchaseId?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.purchaseId) {
    return NextResponse.json({ error: 'purchaseId is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('purchases')
    .select(
      `id, amount_paid, currency,
       design:designs ( title ),
       package:design_packages ( package_name ),
       user:users ( email, full_name )`
    )
    .eq('id', body.purchaseId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }

  const purchase = data as unknown as PurchaseJoin

  if (!purchase.user?.email) {
    return NextResponse.json(
      { error: 'Buyer email unavailable' },
      { status: 400 }
    )
  }

  try {
    const email = getEmailService()
    await email.send(
      purchaseConfirmationEmail({
        name: purchase.user.full_name ?? '',
        email: purchase.user.email,
        designTitle: purchase.design?.title ?? 'Your design',
        packageName: purchase.package?.package_name ?? 'Package',
        amount: Number(purchase.amount_paid),
        currency: purchase.currency,
        downloadUrl: `${SITE_URL}/dashboard/purchases`,
        orderId: purchase.id,
      })
    )
  } catch (err) {
    console.error('[admin/orders/resend] email failed:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
