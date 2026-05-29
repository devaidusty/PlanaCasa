import { createAdminClient } from '@/lib/supabase/admin'
import AdminContractorsTable, {
  type AdminLead,
} from '@/components/admin/AdminContractorsTable'
import type { Contractor } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminContractorsPage() {
  const admin = createAdminClient()

  const [contractorsRes, leadsRes] = await Promise.all([
    admin
      .from('contractors')
      .select('*')
      .order('created_at', { ascending: false }),
    admin
      .from('contractor_leads')
      .select(
        `id, name, phone, status, created_at,
         contractor:contractors ( business_name )`
      )
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const contractors = (contractorsRes.data ?? []) as Contractor[]
  const leads = (leadsRes.data ?? []) as unknown as AdminLead[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">
          Contractors
        </h1>
        <p className="text-sm text-text-light mt-1">
          Manage the contractor marketplace and review leads.
        </p>
      </div>
      <AdminContractorsTable contractors={contractors} leads={leads} />
    </div>
  )
}
