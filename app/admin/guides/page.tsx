import { createAdminClient } from '@/lib/supabase/admin'
import AdminGuidesTable from '@/components/admin/AdminGuidesTable'
import type { Guide } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminGuidesPage() {
  const admin = createAdminClient()

  const { data } = await admin
    .from('guides')
    .select('*')
    .order('created_at', { ascending: false })

  const guides = (data ?? []) as Guide[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Guides</h1>
        <p className="text-sm text-text-light mt-1">
          Manage DIY and construction guides.
        </p>
      </div>
      <AdminGuidesTable guides={guides} />
    </div>
  )
}
