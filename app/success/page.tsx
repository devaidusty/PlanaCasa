import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import SuccessClient from '@/components/checkout/SuccessClient'
import type { Design, DesignPackage, Purchase } from '@/types'

export const metadata: Metadata = {
  title: 'Purchase Complete | PlanaCasa',
  robots: { index: false, follow: false },
}

interface SuccessPageProps {
  searchParams: Promise<{ purchase?: string }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { purchase: purchaseId } = await searchParams

  if (!purchaseId) {
    redirect('/dashboard/purchases')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const admin = createAdminClient()
  const { data: purchase } = await admin
    .from('purchases')
    .select(
      `*,
       design:designs ( id, title, slug, preview_images ),
       package:design_packages ( id, package_name, price, includes )`
    )
    .eq('id', purchaseId)
    .single()

  if (!purchase || purchase.user_id !== user.id) {
    notFound()
  }

  const design = (
    Array.isArray(purchase.design) ? purchase.design[0] : purchase.design
  ) as Pick<Design, 'id' | 'title' | 'slug' | 'preview_images'>
  const pkg = (
    Array.isArray(purchase.package) ? purchase.package[0] : purchase.package
  ) as Pick<DesignPackage, 'id' | 'package_name' | 'price' | 'includes'>

  return (
    <SuccessClient
      purchase={purchase as Purchase}
      design={design}
      packageName={pkg.package_name}
    />
  )
}
