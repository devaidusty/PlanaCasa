import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CheckoutClient from '@/components/checkout/CheckoutClient'
import type { Design, DesignPackage, User } from '@/types'

export const metadata: Metadata = {
  title: 'Checkout | PlanaCasa',
  robots: { index: false, follow: false },
}

interface CheckoutPageProps {
  searchParams: Promise<{ design?: string; package?: string }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { design: designSlug, package: selectedPackageId } = await searchParams

  if (!designSlug) {
    redirect('/gallery')
  }

  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  // proxy already guards this route, but double-check.
  if (!authUser) {
    redirect(`/auth/login?returnTo=${encodeURIComponent('/checkout')}`)
  }

  const { data: design } = await supabase
    .from('designs')
    .select('*')
    .eq('slug', designSlug)
    .single()

  if (!design) {
    notFound()
  }

  const { data: packages } = await supabase
    .from('design_packages')
    .select('*')
    .eq('design_id', (design as Design).id)
    .order('price', { ascending: true })

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  return (
    <CheckoutClient
      design={design as Design}
      packages={(packages ?? []) as DesignPackage[]}
      selectedPackageId={selectedPackageId}
      userEmail={authUser.email ?? ''}
      profile={(profile ?? null) as User | null}
    />
  )
}
