'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DesignFormDialog from '@/components/admin/DesignFormDialog'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { designStyleLabel } from '@/lib/constants/designStyles'
import type { Design } from '@/types'

export interface AdminDesign extends Design {
  package_count: number
}

export default function AdminDesignsTable({
  designs,
}: {
  designs: AdminDesign[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Design | null>(null)
  const [deleting, setDeleting] = useState<Design | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return designs
    return designs.filter((d) => d.title.toLowerCase().includes(q))
  }, [designs, query])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(d: Design) {
    setEditing(d)
    setFormOpen(true)
  }

  async function toggleFeatured(d: Design) {
    setTogglingId(d.id)
    try {
      const res = await fetch('/api/admin/designs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: d.id, featured: !d.featured }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      toast.success(d.featured ? 'Removed from featured' : 'Marked as featured')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete() {
    if (!deleting) return
    const res = await fetch('/api/admin/designs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleting.id }),
    })
    if (!res.ok) {
      toast.error((await res.json()).error ?? 'Failed to delete')
      return
    }
    toast.success('Design deleted')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <Input
            className="pl-8 h-9"
            placeholder="Search designs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button onClick={openCreate} className="h-9">
          <Plus className="w-4 h-4" />
          Add New Design
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-light bg-gray-50">
                <th className="px-4 py-3 font-medium">Design</th>
                <th className="px-4 py-3 font-medium">Style</th>
                <th className="px-4 py-3 font-medium">Specs</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Pkgs</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-text-light"
                  >
                    No designs found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          {d.preview_images?.[0] && (
                            <Image
                              src={d.preview_images[0]}
                              alt={d.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-navy">{d.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-light">
                      {designStyleLabel(d.style)}
                    </td>
                    <td className="px-4 py-3 text-text-light whitespace-nowrap">
                      {d.bedrooms}BR · {d.bathrooms}BA · {d.floor_area_sqm}sqm
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">
                      {formatPHP(d.plan_price)}
                    </td>
                    <td className="px-4 py-3 text-text-light">
                      {d.package_count}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(d)}
                        disabled={togglingId === d.id}
                        className="inline-flex items-center"
                        aria-label="Toggle featured"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            d.featured
                              ? 'fill-gold text-gold'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-text-light whitespace-nowrap">
                      {formatDate(d.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(d)}
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleting(d)}
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

      <DesignFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        design={editing}
      />
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete design?"
        description={`This will permanently delete "${deleting?.title}" and its packages.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
