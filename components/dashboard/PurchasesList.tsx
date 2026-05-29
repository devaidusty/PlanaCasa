'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, FileText, Printer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import DownloadButton from '@/components/dashboard/DownloadButton'
import type { Design, DesignPackage, Purchase } from '@/types'

export interface PurchaseWithRelations extends Purchase {
  design:
    | Pick<Design, 'title' | 'slug' | 'preview_images'>
    | Pick<Design, 'title' | 'slug' | 'preview_images'>[]
    | null
  package:
    | Pick<DesignPackage, 'package_name' | 'price'>
    | Pick<DesignPackage, 'package_name' | 'price'>[]
    | null
}

const STATUS_BADGE: Record<Purchase['payment_status'], string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
}

function one<T>(v: T | T[] | null): T | null {
  if (!v) return null
  return Array.isArray(v) ? v[0] ?? null : v
}

export default function PurchasesList({
  purchases,
}: {
  purchases: PurchaseWithRelations[]
}) {
  const [invoice, setInvoice] = useState<PurchaseWithRelations | null>(null)

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 text-center">
        <p className="text-navy font-medium mb-1">No purchases yet</p>
        <p className="text-text-light text-sm mb-5">
          Browse our gallery and find your dream home plan.
        </p>
        <Link
          href="/gallery"
          className="inline-block gradient-gold text-navy font-semibold rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Browse Designs
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {purchases.map((p) => {
          const design = one(p.design)
          const pkg = one(p.package)
          const thumb = design?.preview_images?.[0]
          const amountLabel =
            p.currency === 'PHP'
              ? formatPHP(Number(p.amount_paid))
              : `${p.currency} ${Number(p.amount_paid).toFixed(2)}`

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-card p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumb */}
                <Link
                  href={`/design/${design?.slug ?? ''}`}
                  className="relative w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden bg-navy shrink-0"
                >
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={design?.title ?? ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/design/${design?.slug ?? ''}`}
                      className="font-heading text-lg font-semibold text-navy hover:text-gold transition-colors line-clamp-1"
                    >
                      {design?.title ?? 'Design'}
                    </Link>
                    <span
                      className={`text-xs font-medium rounded-full px-2.5 py-1 capitalize shrink-0 ${STATUS_BADGE[p.payment_status]}`}
                    >
                      {p.payment_status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-text-light">
                    {pkg?.package_name && (
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-navy">
                        {pkg.package_name}
                      </span>
                    )}
                    <span className="font-semibold text-gold">{amountLabel}</span>
                    <span>{formatDate(p.created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <DownloadButton
                      purchaseId={p.id}
                      downloadCount={p.download_count ?? 0}
                      maxDownloads={p.max_downloads ?? 5}
                      status={p.payment_status}
                    />
                    <Link
                      href="/constructors"
                      className="flex items-center gap-2 rounded-lg border-2 border-gray-200 text-navy font-medium text-sm px-4 py-2.5 hover:bg-gray-50 transition-colors min-h-[44px]"
                    >
                      <MapPin className="w-4 h-4" /> Find Contractor
                    </Link>
                    <button
                      onClick={() => setInvoice(p)}
                      className="flex items-center gap-2 rounded-lg border-2 border-gray-200 text-navy font-medium text-sm px-4 py-2.5 hover:bg-gray-50 transition-colors min-h-[44px]"
                    >
                      <FileText className="w-4 h-4" /> Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Invoice dialog */}
      <Dialog open={!!invoice} onOpenChange={(open) => !open && setInvoice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-navy">Invoice</DialogTitle>
          </DialogHeader>
          {invoice && (
            <div id="invoice-print" className="text-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-bold text-lg text-navy">
                  PlanaCasa
                </span>
                <span className="text-text-light">
                  #{invoice.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <dl className="space-y-2 border-t border-gray-100 pt-3">
                <InvRow label="Design" value={one(invoice.design)?.title ?? '—'} />
                <InvRow
                  label="Package"
                  value={one(invoice.package)?.package_name ?? '—'}
                />
                <InvRow
                  label="Payment method"
                  value={invoice.payment_method}
                />
                <InvRow label="Status" value={invoice.payment_status} />
                <InvRow label="Date" value={formatDate(invoice.created_at)} />
                <InvRow
                  label="Transaction"
                  value={invoice.transaction_id ?? '—'}
                />
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                  <dt className="font-semibold text-navy">Total</dt>
                  <dd className="font-bold text-gold text-base">
                    {invoice.currency === 'PHP'
                      ? formatPHP(Number(invoice.amount_paid))
                      : `${invoice.currency} ${Number(invoice.amount_paid).toFixed(2)}`}
                  </dd>
                </div>
              </dl>
              <button
                onClick={() => window.print()}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-navy text-white font-medium py-2.5 hover:opacity-90 transition-opacity min-h-[44px]"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function InvRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-light shrink-0">{label}</dt>
      <dd className="text-navy font-medium text-right truncate capitalize">
        {value}
      </dd>
    </div>
  )
}
