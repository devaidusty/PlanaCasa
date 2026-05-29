import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const BUCKET = 'plan-files'
const SIGNED_URL_TTL = 300 // seconds

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  const { data: purchase, error: purchaseError } = await admin
    .from('purchases')
    .select(
      `id, user_id, payment_status, download_count, max_downloads, created_at,
       design:designs ( slug ),
       package:design_packages ( file_urls )`
    )
    .eq('id', purchaseId)
    .single()

  if (purchaseError || !purchase) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }

  if (purchase.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (purchase.payment_status !== 'completed') {
    return NextResponse.json(
      { error: 'Payment is not completed' },
      { status: 403 }
    )
  }

  const downloadCount = purchase.download_count ?? 0
  const maxDownloads = purchase.max_downloads ?? 5
  const createdAt = new Date(purchase.created_at).getTime()
  const expired = Date.now() - createdAt > THIRTY_DAYS_MS

  if (downloadCount >= maxDownloads) {
    return NextResponse.json(
      { error: 'Download limit reached', reason: 'limit' },
      { status: 410 }
    )
  }

  if (expired) {
    return NextResponse.json(
      { error: '30-day download access has expired', reason: 'expired' },
      { status: 410 }
    )
  }

  // Supabase returns related rows as objects (or arrays). Normalize to a single record.
  const designRow = Array.isArray(purchase.design)
    ? purchase.design[0]
    : purchase.design
  const packageRow = Array.isArray(purchase.package)
    ? purchase.package[0]
    : purchase.package

  const fileUrls: string[] = packageRow?.file_urls ?? []
  const slug: string = designRow?.slug ?? 'design'
  const path = fileUrls[0] ?? `samples/${slug}-plans.pdf`

  // Try to produce a signed URL. If the object is missing, return a friendly
  // demo response WITHOUT incrementing the counter.
  let signedUrl: string | null = null
  try {
    const { data: signed, error: signError } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL)

    if (signError || !signed?.signedUrl) {
      return NextResponse.json({
        ok: true,
        demo: true,
        message:
          'Demo mode: plan files have not yet been uploaded for this design.',
        remaining: maxDownloads - downloadCount,
      })
    }
    signedUrl = signed.signedUrl
  } catch (err) {
    console.error('[downloads] storage error:', err)
    return NextResponse.json({
      ok: true,
      demo: true,
      message:
        'Demo mode: plan files have not yet been uploaded for this design.',
      remaining: maxDownloads - downloadCount,
    })
  }

  // A real signed URL was produced — increment the counter, then redirect.
  await admin
    .from('purchases')
    .update({ download_count: downloadCount + 1 })
    .eq('id', purchaseId)

  return NextResponse.redirect(signedUrl)
}
