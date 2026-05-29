import { createAdminClient } from '@/lib/supabase/admin'
import AdminNewsletterTable from '@/components/admin/AdminNewsletterTable'
import type { NewsletterSubscriber } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterPage() {
  const admin = createAdminClient()

  const { data } = await admin
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })

  const subscribers = (data ?? []) as NewsletterSubscriber[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Newsletter</h1>
        <p className="text-sm text-text-light mt-1">
          Email subscribers across the site.
        </p>
      </div>
      <AdminNewsletterTable subscribers={subscribers} />
    </div>
  )
}
