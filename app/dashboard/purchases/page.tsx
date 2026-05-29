import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PurchasesList, {
  type PurchaseWithRelations,
} from '@/components/dashboard/PurchasesList'

export default async function PurchasesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data } = await supabase
    .from('purchases')
    .select(
      `*,
       design:designs ( title, slug, preview_images ),
       package:design_packages ( package_name, price )`
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-navy mb-1">
        My Purchases
      </h1>
      <p className="text-text-light mb-8">
        Download your plans and connect with contractors.
      </p>
      <PurchasesList purchases={(data ?? []) as PurchaseWithRelations[]} />
    </div>
  )
}
