import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPaymentProvider } from '@/lib/payments'
import { getEmailService, purchaseConfirmationEmail } from '@/lib/email'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const PAYMONGO_METHODS = ['gcash', 'maya', 'card', 'bank']

interface BuyerDetails {
  full_name: string
  email: string
  phone: string
  location_city: string
  location_province: string
  location_country: string
}

interface PurchaseBody {
  designId?: string
  packageId?: string
  buyer?: Partial<BuyerDetails>
  paymentMethod?: string
}

function mapPaymentMethod(method: string): 'paymongo' | 'stripe' | 'mock' {
  if (PAYMONGO_METHODS.includes(method)) return 'paymongo'
  if (method === 'stripe_card') return 'stripe'
  return 'mock'
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: PurchaseBody
  try {
    body = (await request.json()) as PurchaseBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { designId, packageId, buyer, paymentMethod } = body

  if (!designId || !packageId || !paymentMethod || !buyer?.email) {
    return NextResponse.json(
      { error: 'designId, packageId, paymentMethod and buyer.email are required' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()

  // Load the package + design and validate the package belongs to the design.
  const { data: pkg, error: pkgError } = await admin
    .from('design_packages')
    .select('id, design_id, package_name, price')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 })
  }
  if (pkg.design_id !== designId) {
    return NextResponse.json(
      { error: 'Package does not belong to this design' },
      { status: 400 }
    )
  }

  const { data: design, error: designError } = await admin
    .from('designs')
    .select('id, title, slug')
    .eq('id', designId)
    .single()

  if (designError || !design) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 })
  }

  // Derive amount from the package — never trust the client.
  const amount = Number(pkg.price)
  const currency = paymentMethod === 'stripe_card' ? 'USD' : 'PHP'

  // Run the payment through the provider.
  const provider = getPaymentProvider(paymentMethod)
  const intent = await provider.createIntent({
    amount,
    currency,
    method: paymentMethod,
    metadata: {
      designId,
      packageId,
      userId: user.id,
      buyerEmail: buyer.email,
    },
  })
  const confirmed = await provider.confirmIntent(intent.id)

  // Persist the purchase.
  const { data: purchase, error: insertError } = await admin
    .from('purchases')
    .insert({
      user_id: user.id,
      design_id: designId,
      package_id: packageId,
      amount_paid: amount,
      currency,
      payment_method: mapPaymentMethod(paymentMethod),
      payment_status: confirmed.status,
      transaction_id: confirmed.id,
      max_downloads: 5,
      download_count: 0,
    })
    .select('id, payment_status')
    .single()

  if (insertError || !purchase) {
    return NextResponse.json(
      { error: insertError?.message ?? 'Failed to record purchase' },
      { status: 500 }
    )
  }

  // Upsert buyer details onto the user's profile row (best effort).
  await admin
    .from('users')
    .update({
      full_name: buyer.full_name ?? undefined,
      phone: buyer.phone ?? undefined,
      location_city: buyer.location_city ?? undefined,
      location_province: buyer.location_province ?? undefined,
      location_country: buyer.location_country ?? undefined,
    })
    .eq('id', user.id)

  if (confirmed.status === 'completed') {
    // Send confirmation email (best effort — never block the response).
    try {
      const email = getEmailService()
      await email.send(
        purchaseConfirmationEmail({
          name: buyer.full_name ?? '',
          email: buyer.email,
          designTitle: design.title,
          packageName: pkg.package_name,
          amount,
          currency,
          downloadUrl: `${SITE_URL}/dashboard/purchases`,
          orderId: purchase.id,
        })
      )
    } catch (err) {
      console.error('[purchases] Failed to send confirmation email:', err)
    }

    return NextResponse.json({ purchaseId: purchase.id, status: 'completed' })
  }

  // Payment failed.
  return NextResponse.json(
    { purchaseId: purchase.id, status: 'failed' },
    { status: 402 }
  )
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
    .from('purchases')
    .select(
      `*,
       design:designs ( title, slug, preview_images ),
       package:design_packages ( package_name, price )`
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ purchases: data ?? [] })
}
