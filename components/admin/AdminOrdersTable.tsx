'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Search, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { downloadCsv } from '@/lib/utils/exportCsv'

export interface AdminOrder {
  id: string
  amount_paid: number
  currency: string
  payment_status: string
  download_count: number
  max_downloads: number
  created_at: string
  design: { title: string; slug: string } | null
  package: { package_name: string } | null
  user: { email: string; full_name: string } | null
}

function money(amount: number, currency: string): string {
  return currency === 'PHP'
    ? formatPHP(amount)
    : `${currency} ${amount.toLocaleString('en-US')}`
}

export default function AdminOrdersTable({
  orders,
}: {
  orders: AdminOrder[]
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [resendingId, setResendingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (status !== 'all' && o.payment_status !== status) return false
      if (!q) return true
      return (
        (o.user?.email ?? '').toLowerCase().includes(q) ||
        (o.design?.title ?? '').toLowerCase().includes(q)
      )
    })
  }, [orders, query, status])

  const revenue = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of filtered) {
      if (o.payment_status !== 'completed') continue
      const cur = o.currency || 'PHP'
      map[cur] = (map[cur] ?? 0) + Number(o.amount_paid)
    }
    const entries = Object.entries(map)
    if (entries.length === 0) return '₱0'
    return entries.map(([cur, amt]) => money(amt, cur)).join(' · ')
  }, [filtered])

  function exportCsv() {
    downloadCsv(
      `planacasa-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        'Order ID',
        'Date',
        'Buyer Name',
        'Buyer Email',
        'Design',
        'Package',
        'Amount',
        'Currency',
        'Status',
        'Downloads',
      ],
      filtered.map((o) => [
        o.id,
        formatDate(o.created_at),
        o.user?.full_name ?? '',
        o.user?.email ?? '',
        o.design?.title ?? '',
        o.package?.package_name ?? '',
        o.amount_paid,
        o.currency,
        o.payment_status,
        `${o.download_count}/${o.max_downloads}`,
      ])
    )
  }

  async function resend(id: string) {
    setResendingId(id)
    try {
      const res = await fetch('/api/admin/orders/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId: id }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      toast.success('Confirmation email re-sent')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setResendingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <Input
              className="pl-8 h-9"
              placeholder="Search email or design…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v ?? 'all')}
          >
            <SelectTrigger className="h-9 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={exportCsv} className="h-9">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 flex items-center justify-between">
        <span className="text-sm text-text-light">
          Completed revenue ({filtered.length} orders shown)
        </span>
        <span className="font-heading text-lg font-bold text-gold">
          {revenue}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-light bg-gray-50">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Buyer</th>
                <th className="px-4 py-3 font-medium">Design</th>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Downloads</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-text-light"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-navy">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-text-light whitespace-nowrap">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text-dark">
                        {o.user?.full_name || '—'}
                      </p>
                      <p className="text-xs text-text-light">
                        {o.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-text-dark">
                      {o.design?.title ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-text-light">
                      {o.package?.package_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">
                      {money(Number(o.amount_paid), o.currency)}
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-text-light">
                      {o.download_count}/{o.max_downloads}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resend(o.id)}
                        disabled={
                          resendingId === o.id ||
                          o.payment_status !== 'completed'
                        }
                      >
                        <Mail className="w-4 h-4" />
                        {resendingId === o.id ? 'Sending…' : 'Resend'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
