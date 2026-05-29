'use client'

import { useMemo, useState } from 'react'
import { Search, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils/formatDate'
import { downloadCsv } from '@/lib/utils/exportCsv'
import type { NewsletterSubscriber } from '@/types'

export default function AdminNewsletterTable({
  subscribers,
}: {
  subscribers: NewsletterSubscriber[]
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return subscribers
    return subscribers.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        (s.name ?? '').toLowerCase().includes(q)
    )
  }, [subscribers, query])

  function exportCsv() {
    downloadCsv(
      `planacasa-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Email', 'Name', 'Source', 'Subscribed At'],
      filtered.map((s) => [
        s.email,
        s.name ?? '',
        s.source ?? '',
        formatDate(s.subscribed_at),
      ])
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <Input
              className="pl-8 h-9"
              placeholder="Search subscribers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span className="text-sm text-text-light whitespace-nowrap">
            {subscribers.length} total
          </span>
        </div>
        <Button variant="outline" onClick={exportCsv} className="h-9">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-light bg-gray-50">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-text-light"
                  >
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-navy font-medium">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-text-light">
                      {s.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-text-light">
                      {s.source || '—'}
                    </td>
                    <td className="px-4 py-3 text-text-light whitespace-nowrap">
                      {formatDate(s.subscribed_at)}
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
