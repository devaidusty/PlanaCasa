'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ContractorFormDialog from '@/components/admin/ContractorFormDialog'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { Contractor, ListingTier } from '@/types'

export interface AdminLead {
  id: string
  name: string
  phone: string
  status: string
  created_at: string
  contractor: { business_name: string } | null
}

interface AdminContractorsTableProps {
  contractors: Contractor[]
  leads: AdminLead[]
}

const LEAD_STATUSES = ['new', 'contacted', 'won', 'lost']

export default function AdminContractorsTable({
  contractors,
  leads,
}: AdminContractorsTableProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Contractor | null>(null)
  const [deleting, setDeleting] = useState<Contractor | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return contractors
    return contractors.filter(
      (c) =>
        c.business_name.toLowerCase().includes(q) ||
        (c.owner_name ?? '').toLowerCase().includes(q)
    )
  }, [contractors, query])

  async function patch(id: string, fields: Record<string, unknown>) {
    const res = await fetch('/api/admin/contractors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    })
    if (!res.ok) {
      toast.error((await res.json()).error ?? 'Failed')
      return
    }
    toast.success('Updated')
    router.refresh()
  }

  async function patchLead(id: string, status: string) {
    const res = await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (!res.ok) {
      toast.error((await res.json()).error ?? 'Failed')
      return
    }
    toast.success('Lead updated')
    router.refresh()
  }

  async function handleDelete() {
    if (!deleting) return
    const res = await fetch('/api/admin/contractors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleting.id }),
    })
    if (!res.ok) {
      toast.error((await res.json()).error ?? 'Failed')
      return
    }
    toast.success('Contractor deleted')
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <Input
              className="pl-8 h-9"
              placeholder="Search contractors…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
            className="h-9"
          >
            <Plus className="w-4 h-4" />
            Add Contractor
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-text-light bg-gray-50">
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Tier</th>
                  <th className="px-4 py-3 font-medium">Verified</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-text-light"
                    >
                      No contractors found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy">
                          {c.business_name}
                        </p>
                        <p className="text-xs text-text-light">
                          {c.owner_name}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-text-light whitespace-nowrap">
                        {c.city}
                        {c.province ? `, ${c.province}` : ''}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={c.listing_tier}
                          onValueChange={(v) =>
                            v && patch(c.id, { listing_tier: v as ListingTier })
                          }
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            patch(c.id, { is_verified: !c.is_verified })
                          }
                          aria-label="Toggle verified"
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
                            c.is_verified
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            patch(c.id, { is_featured: !c.is_featured })
                          }
                          aria-label="Toggle featured"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              c.is_featured
                                ? 'fill-gold text-gold'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-text-light whitespace-nowrap">
                        {Number(c.average_rating).toFixed(1)} ({c.total_reviews})
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              setEditing(c)
                              setFormOpen(true)
                            }}
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleting(c)}
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy mb-3">
          Recent Leads
        </h2>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {leads.length === 0 ? (
            <p className="px-4 py-8 text-sm text-text-light">No leads yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-text-light bg-gray-50">
                    <th className="px-4 py-3 font-medium">Lead</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Contractor</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-navy">
                        {l.name}
                      </td>
                      <td className="px-4 py-3 text-text-light">{l.phone}</td>
                      <td className="px-4 py-3 text-text-light">
                        {l.contractor?.business_name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={l.status}
                          onValueChange={(v) => v && patchLead(l.id, v)}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LEAD_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ContractorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        contractor={editing}
      />
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete contractor?"
        description={`This will permanently delete "${deleting?.business_name}".`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
