import {
  Home,
  Users,
  BookOpen,
  Mail,
  ShoppingBag,
  Wrench,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'

export const dynamic = 'force-dynamic'

interface PurchaseRow {
  id: string
  amount_paid: number
  currency: string
  payment_status: string
  created_at: string
  design: { title: string } | null
  user: { email: string; full_name: string } | null
}

interface LeadRow {
  id: string
  name: string
  phone: string
  status: string
  created_at: string
  contractor: { business_name: string } | null
}

function startOfTodayISO(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function startOfMonthISO(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

export default async function AdminOverviewPage() {
  const admin = createAdminClient()

  const today = startOfTodayISO()
  const monthStart = startOfMonthISO()

  const [
    designsCount,
    contractorsCount,
    pendingContractorsCount,
    guidesCount,
    newsletterCount,
    purchasesCount,
    newUsersTodayCount,
    pendingCustomizationsCount,
    newLeadsCount,
    completedPurchases,
    recentOrders,
    recentLeads,
  ] = await Promise.all([
    admin.from('designs').select('id', { count: 'exact', head: true }),
    admin.from('contractors').select('id', { count: 'exact', head: true }),
    admin
      .from('contractors')
      .select('id', { count: 'exact', head: true })
      .eq('is_verified', false),
    admin.from('guides').select('id', { count: 'exact', head: true }),
    admin
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true }),
    admin.from('purchases').select('id', { count: 'exact', head: true }),
    admin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today),
    admin
      .from('customization_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    admin
      .from('contractor_leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
    admin
      .from('purchases')
      .select('amount_paid, currency, created_at')
      .eq('payment_status', 'completed'),
    admin
      .from('purchases')
      .select(
        `id, amount_paid, currency, payment_status, created_at,
         design:designs ( title ),
         user:users ( email, full_name )`
      )
      .order('created_at', { ascending: false })
      .limit(10),
    admin
      .from('contractor_leads')
      .select(
        `id, name, phone, status, created_at,
         contractor:contractors ( business_name )`
      )
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Revenue aggregation by currency (all-time + this month)
  const revenueAll: Record<string, number> = {}
  const revenueMonth: Record<string, number> = {}
  for (const p of (completedPurchases.data ?? []) as Array<{
    amount_paid: number
    currency: string
    created_at: string
  }>) {
    const cur = p.currency || 'PHP'
    revenueAll[cur] = (revenueAll[cur] ?? 0) + Number(p.amount_paid)
    if (p.created_at >= monthStart) {
      revenueMonth[cur] = (revenueMonth[cur] ?? 0) + Number(p.amount_paid)
    }
  }

  const orders = (recentOrders.data ?? []) as unknown as PurchaseRow[]
  const leads = (recentLeads.data ?? []) as unknown as LeadRow[]

  const stats = [
    { label: 'Designs', value: designsCount.count ?? 0, icon: Home },
    {
      label: 'Contractors',
      value: contractorsCount.count ?? 0,
      icon: Users,
      sub: `${pendingContractorsCount.count ?? 0} unverified`,
    },
    { label: 'Guides', value: guidesCount.count ?? 0, icon: BookOpen },
    {
      label: 'Subscribers',
      value: newsletterCount.count ?? 0,
      icon: Mail,
    },
    {
      label: 'Total Orders',
      value: purchasesCount.count ?? 0,
      icon: ShoppingBag,
    },
    {
      label: 'New Users Today',
      value: newUsersTodayCount.count ?? 0,
      icon: Users,
    },
    {
      label: 'Pending Customizations',
      value: pendingCustomizationsCount.count ?? 0,
      icon: Wrench,
    },
    {
      label: 'New Leads',
      value: newLeadsCount.count ?? 0,
      icon: Mail,
    },
  ]

  function fmtRevenue(map: Record<string, number>): string {
    const entries = Object.entries(map)
    if (entries.length === 0) return '₱0'
    return entries
      .map(([cur, amt]) =>
        cur === 'PHP' ? formatPHP(amt) : `${cur} ${amt.toLocaleString('en-US')}`
      )
      .join(' · ')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Overview</h1>
        <p className="text-sm text-text-light mt-1">
          Back-office dashboard for PlanaCasa.
        </p>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-text-light">
            Revenue This Month
          </p>
          <p className="font-heading text-2xl font-bold text-navy mt-2">
            {fmtRevenue(revenueMonth)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-text-light">
            Revenue All-Time
          </p>
          <p className="font-heading text-2xl font-bold text-gold mt-2">
            {fmtRevenue(revenueAll)}
          </p>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow-card p-5 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-light">
                {label}
              </span>
              <Icon className="w-4 h-4 text-gold" />
            </div>
            <span className="font-heading text-3xl font-bold text-navy mt-3">
              {value.toLocaleString()}
            </span>
            {sub && <span className="text-xs text-text-light mt-1">{sub}</span>}
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading text-lg font-semibold text-navy">
            Recent Orders
          </h2>
        </div>
        {orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-text-light">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-text-light bg-gray-50">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Buyer</th>
                  <th className="px-6 py-3 font-medium">Design</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-navy">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-text-dark">
                      {o.user?.full_name || o.user?.email || '—'}
                    </td>
                    <td className="px-6 py-3 text-text-dark">
                      {o.design?.title || '—'}
                    </td>
                    <td className="px-6 py-3 font-medium text-navy">
                      {o.currency === 'PHP'
                        ? formatPHP(Number(o.amount_paid))
                        : `${o.currency} ${Number(o.amount_paid).toLocaleString()}`}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          o.payment_status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : o.payment_status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-text-light">
                      {formatDate(o.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading text-lg font-semibold text-navy">
            Recent Leads
          </h2>
        </div>
        {leads.length === 0 ? (
          <p className="px-6 py-8 text-sm text-text-light">No leads yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {leads.map((l) => (
              <li
                key={l.id}
                className="px-6 py-4 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium text-navy">{l.name}</p>
                  <p className="text-xs text-text-light">
                    {l.phone} · {l.contractor?.business_name || 'Unknown contractor'}
                  </p>
                </div>
                <span className="text-xs text-text-light">
                  {formatDate(l.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
