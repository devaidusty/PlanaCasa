'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GuideFormDialog from '@/components/admin/GuideFormDialog'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { formatDate } from '@/lib/utils/formatDate'
import { GUIDE_CATEGORY_LABELS } from '@/lib/constants/guides'
import type { Guide } from '@/types'

export default function AdminGuidesTable({ guides }: { guides: Guide[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Guide | null>(null)
  const [deleting, setDeleting] = useState<Guide | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return guides
    return guides.filter((g) => g.title.toLowerCase().includes(q))
  }, [guides, query])

  async function toggleFree(g: Guide) {
    const res = await fetch('/api/admin/guides', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: g.id, is_free: !g.is_free }),
    })
    if (!res.ok) {
      toast.error((await res.json()).error ?? 'Failed')
      return
    }
    toast.success('Updated')
    router.refresh()
  }

  async function handleDelete() {
    if (!deleting) return
    const res = await fetch('/api/admin/guides', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleting.id }),
    })
    if (!res.ok) {
      toast.error((await res.json()).error ?? 'Failed')
      return
    }
    toast.success('Guide deleted')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <Input
            className="pl-8 h-9"
            placeholder="Search guides…"
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
          Add Guide
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-light bg-gray-50">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Read time</th>
                <th className="px-4 py-3 font-medium">Free</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-text-light"
                  >
                    No guides found.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-navy">
                      {g.title}
                    </td>
                    <td className="px-4 py-3 text-text-light">
                      {GUIDE_CATEGORY_LABELS[g.category] ?? g.category}
                    </td>
                    <td className="px-4 py-3 text-text-light">
                      {g.read_time_minutes} min
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFree(g)}
                        aria-label="Toggle free"
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
                          g.is_free
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {g.is_free ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-text-light whitespace-nowrap">
                      {formatDate(g.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setEditing(g)
                            setFormOpen(true)
                          }}
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleting(g)}
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

      <GuideFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        guide={editing}
      />
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete guide?"
        description={`This will permanently delete "${deleting?.title}".`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
