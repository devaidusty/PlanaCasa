import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ShoppingBag, Heart, Wrench, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import type { Design } from '@/types'

interface RecentPurchase {
  id: string
  amount_paid: number
  currency: string
  created_at: string
  design: Pick<Design, 'title' | 'slug' | 'preview_images'> | Pick<Design, 'title' | 'slug' | 'preview_images'>[] | null
}

export default async function DashboardOverview() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ count: purchaseCount }, { count: wishlistCount }, { count: customCount }, { data: recent }] =
    await Promise.all([
      supabase.from('purchases').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('wishlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('customization_requests').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase
        .from('purchases')
        .select('id, amount_paid, currency, created_at, design:designs ( title, slug, preview_images )')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ])

  const { data: profile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const recentPurchases = (recent ?? []) as RecentPurchase[]

  const stats = [
    {
      label: 'Purchases',
      value: purchaseCount ?? 0,
      href: '/dashboard/purchases',
      icon: ShoppingBag,
    },
    {
      label: 'Saved Designs',
      value: wishlistCount ?? 0,
      href: '/dashboard/wishlist',
      icon: Heart,
    },
    {
      label: 'Custom Requests',
      value: customCount ?? 0,
      href: '/dashboard/customization',
      icon: Wrench,
    },
  ]

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-navy mb-1">
        Welcome back, {firstName}
      </h1>
      <p className="text-text-light mb-8">
        Here&apos;s an overview of your account.
      </p>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gold" />
              </span>
              <ArrowRight className="w-4 h-4 text-text-light group-hover:text-gold transition-colors" />
            </div>
            <p className="font-heading text-3xl font-bold text-navy">{value}</p>
            <p className="text-sm text-text-light">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent purchases */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold text-navy">
          Recent purchases
        </h2>
        {recentPurchases.length > 0 && (
          <Link
            href="/dashboard/purchases"
            className="text-sm font-medium text-gold hover:underline"
          >
            View all
          </Link>
        )}
      </div>

      {recentPurchases.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-navy font-medium mb-1">No purchases yet</p>
          <p className="text-text-light text-sm mb-5">
            Find the perfect plan for your dream home.
          </p>
          <Link
            href="/gallery"
            className="inline-block gradient-gold text-navy font-semibold rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Browse Designs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentPurchases.map((p) => {
            const design = Array.isArray(p.design) ? p.design[0] : p.design
            const thumb = design?.preview_images?.[0]
            return (
              <Link
                key={p.id}
                href="/dashboard/purchases"
                className="flex items-center gap-4 bg-white rounded-xl shadow-card p-3 hover:shadow-card-hover transition-shadow"
              >
                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-navy shrink-0">
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={design?.title ?? ''}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-navy truncate">
                    {design?.title ?? 'Design'}
                  </p>
                  <p className="text-xs text-text-light">
                    {formatDate(p.created_at)}
                  </p>
                </div>
                <span className="font-semibold text-gold shrink-0">
                  {p.currency === 'PHP'
                    ? formatPHP(Number(p.amount_paid))
                    : `${p.currency} ${Number(p.amount_paid).toFixed(2)}`}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
