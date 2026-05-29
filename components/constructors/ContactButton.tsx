'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Phone, Mail, MessageCircle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Contractor } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  location: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ContactButtonProps {
  contractor: Contractor
  designId?: string
  designTitle?: string
  /** Visual variant of the trigger button. */
  variant?: 'solid' | 'outline'
  className?: string
  label?: string
}

export default function ContactButton({
  contractor,
  designId,
  designTitle,
  variant = 'solid',
  className,
  label = 'Request Quote',
}: ContactButtonProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      location: contractor.province ?? '',
      message: `Hi, I'm interested in building ${
        designTitle ?? 'a home'
      } and would like a quote.`,
    },
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: contractor.id,
          designId,
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          location: data.location || undefined,
          message: data.message || undefined,
        }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? 'Failed to send your request')
      }
      toast.success('Your request was sent! The contractor will reach out soon.')
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const triggerStyle =
    variant === 'solid'
      ? { backgroundColor: '#C9A84C', color: '#1B2A4A' }
      : { borderColor: '#1B2A4A', color: '#1B2A4A' }

  const messengerHref = contractor.contact_messenger
    ? contractor.contact_messenger.startsWith('http')
      ? contractor.contact_messenger
      : `https://m.me/${contractor.contact_messenger}`
    : contractor.facebook_page
      ? contractor.facebook_page.startsWith('http')
        ? contractor.facebook_page
        : `https://facebook.com/${contractor.facebook_page}`
      : null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`min-h-11 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 ${
          variant === 'outline' ? 'border-2' : ''
        } ${className ?? ''}`}
        style={triggerStyle}
      >
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg" style={{ color: '#1B2A4A' }}>
              Contact {contractor.business_name}
            </DialogTitle>
            <DialogDescription>
              Send a quote request or reach out directly.
            </DialogDescription>
          </DialogHeader>

          {/* Direct contact options — prominent on mobile */}
          <div className="grid grid-cols-1 gap-2">
            {contractor.contact_phone && (
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${contractor.contact_phone}`}
                  className="min-h-11 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#1B2A4A' }}
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${contractor.contact_phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-11 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {contractor.contact_email && (
                <a
                  href={`mailto:${contractor.contact_email}`}
                  className="min-h-11 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ borderColor: 'rgba(27,42,74,0.2)', color: '#1B2A4A' }}
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
              {messengerHref && (
                <a
                  href={messengerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-11 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ borderColor: 'rgba(27,42,74,0.2)', color: '#1B2A4A' }}
                >
                  <MessageCircle className="w-4 h-4" /> Messenger
                </a>
              )}
            </div>
          </div>

          <div className="relative my-1 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or send a quote request</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your name
              </label>
              <input
                {...register('name')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                placeholder="Juan Dela Cruz"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                  placeholder="0917 000 0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                  placeholder="you@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                {...register('location')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                placeholder="City, Province"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                {...register('message')}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Quote Request
            </button>

            <p className="text-xs text-gray-400 leading-relaxed">
              PlanaCasa connects you with independent contractors and is not party
              to any agreement.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
