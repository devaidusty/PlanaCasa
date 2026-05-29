import { createAdminClient } from '@/lib/supabase/admin'
import AdminDesignsTable, {
  type AdminDesign,
} from '@/components/admin/AdminDesignsTable'
import type { Design } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminDesignsPage() {
  const admin = createAdminClient()

  const { data } = await admin
    .from('designs')
    .select('*, design_packages ( id )')
    .order('created_at', { ascending: false })

  const designs: AdminDesign[] = (
    (data ?? []) as Array<Design & { design_packages: { id: string }[] }>
  ).map((d) => {
    const { design_packages, ...rest } = d
    return { ...rest, package_count: design_packages?.length ?? 0 }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Designs</h1>
        <p className="text-sm text-text-light mt-1">
          Manage house plan listings and packages.
        </p>
      </div>
      <AdminDesignsTable designs={designs} />
    </div>
  )
}
