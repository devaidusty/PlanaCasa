'use client'

import { useState } from 'react'
import { Plus, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import type { CustomizationRequest, CustomizationStatus, Design } from '@/types'

export interface CustomizationWithDesign extends CustomizationRequest {
  design:
    | Pick<Design, 'title' | 'slug'>
    | Pick<Design, 'title' | 'slug'>[]
    | null
}

const STEPS: { key: CustomizationStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'completed', label: 'Completed' },
]

function one<T>(v: T | T[] | null): T | null {
  if (!v) return null
  return Array.isArray(v) ? v[0] ?? null : v
}

export default function CustomizationList({
  initialRequests,
  designs,
}: {
  initialRequests: CustomizationWithDesign[]
  designs: Pick<Design, 'id' | 'title'>[]
}) {
  const [requests, setRequests] = useState(initialRequests)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [designId, setDesignId] = useState('')
  const [changes, setChanges] = useState('')
  const [budget, setBudget] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!designId || !changes.trim()) {
      toast.error('Please select a design and describe your changes.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId,
          changes_requested: changes,
          budget: budget ? Number(budget) : undefined,
          contact_phone: phone || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      const { id } = (await res.json()) as { id: string }

      const design = designs.find((d) => d.id === designId)
      const newReq: CustomizationWithDesign = {
        id,
        user_id: '',
        design_id: designId,
        changes_requested: changes,
        budget: budget ? Number(budget) : 0,
        contact_phone: phone,
        status: 'pending',
        created_at: new Date().toISOString(),
        design: design ? { title: design.title, slug: '' } : null,
      }
      setRequests((r) => [newReq, ...r])
      toast.success('Request submitted! Our team will review it shortly.')
      setOpen(false)
      setDesignId('')
      setChanges('')
      setBudget('')
      setPhone('')
    } catch {
      toast.error('Could not submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center gap-2 gradient-gold text-navy font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 transition-opacity min-h-[44px]">
            <Plus className="w-4 h-4" /> New Request
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-navy">
                New customization request
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Design
                </label>
                <select
                  value={designId}
                  onChange={(e) => setDesignId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm min-h-[44px] bg-white focus:outline-none focus:border-gold"
                >
                  <option value="">Select a design</option>
                  {designs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Changes requested
                </label>
                <Textarea
                  value={changes}
                  onChange={(e) => setChanges(e.target.value)}
                  rows={4}
                  placeholder="Describe the changes you'd like (e.g. add a bedroom, extend the garage)…"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Budget (₱)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm min-h-[44px] focus:outline-none focus:border-gold"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Contact phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm min-h-[44px] focus:outline-none focus:border-gold"
                    placeholder="09xx xxx xxxx"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full gradient-gold text-navy font-semibold rounded-lg py-3 hover:opacity-90 transition-opacity disabled:opacity-40 min-h-[44px] flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Request
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-navy font-medium mb-1">No requests yet</p>
          <p className="text-text-light text-sm">
            Submit a request to get a custom quote for any plan.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const design = one(req.design)
            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl shadow-card p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-heading text-lg font-semibold text-navy">
                    {design?.title ?? 'Design'}
                  </h3>
                  <span className="text-xs text-text-light shrink-0">
                    {formatDate(req.created_at)}
                  </span>
                </div>

                <Stepper status={req.status} />

                <p className="text-sm text-text-dark mt-4 whitespace-pre-line">
                  {req.changes_requested}
                </p>
                {req.budget ? (
                  <p className="text-sm text-text-light mt-2">
                    Budget:{' '}
                    <span className="font-semibold text-gold">
                      {formatPHP(Number(req.budget))}
                    </span>
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Stepper({ status }: { status: CustomizationStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status)
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  done
                    ? 'bg-success text-white'
                    : active
                      ? 'bg-gold text-navy'
                      : 'bg-gray-100 text-text-light'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`text-[11px] mt-1 ${active ? 'text-navy font-semibold' : 'text-text-light'}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 -mt-4 ${i < currentIndex ? 'bg-success' : 'bg-gray-100'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
