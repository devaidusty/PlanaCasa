import { createAdminClient } from '@/lib/supabase/admin'
import AdminOrdersTable, {
  type AdminOrder,
} from '@/components/admin/AdminOrdersTable'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const admin = createAdminClient()

  const { data } = await admin
    .from('purchases')
    .select(
      `id, amount_paid, currency, payment_status, download_count, max_downloads, created_at,
       design:designs ( title, slug ),
       package:design_packages ( package_name ),
       user:users ( email, full_name )`
    )
    .order('created_at', { ascending: false })

  const orders = (data ?? []) as unknown as AdminOrder[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Orders</h1>
        <p className="text-sm text-text-light mt-1">
          All purchases and payment activity.
        </p>
      </div>
      <AdminOrdersTable orders={orders} />
    </div>
  )
}
