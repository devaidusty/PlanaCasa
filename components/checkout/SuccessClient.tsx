'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Check,
  Download,
  Loader2,
  MapPin,
  Share2,
  LayoutDashboard,
  Search,
  Mail,
} from 'lucide-react'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { triggerDownload } from '@/lib/utils/triggerDownload'
import type { Design, Purchase } from '@/types'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

interface SuccessClientProps {
  purchase: Purchase
  design: Pick<Design, 'id' | 'title' | 'slug' | 'preview_images'>
  packageName: string
}

export default function SuccessClient({
  purchase,
  design,
  packageName,
}: SuccessClientProps) {
  const [downloading, setDownloading] = useState(false)
  const [used, setUsed] = useState(purchase.download_count ?? 0)
  const max = purchase.max_downloads ?? 5

  const handleDownload = async () => {
    setDownloading(true)
    const result = await triggerDownload(purchase.id)
    if (result.consumed) setUsed((u) => u + 1)
    setDownloading(false)
  }

  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    SITE_URL
  )}`

  const amountLabel =
    purchase.currency === 'PHP'
      ? formatPHP(Number(purchase.amount_paid))
      : `${purchase.currency} ${Number(purchase.amount_paid).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="min-h-screen bg-pc-bg overflow-hidden">
      {/* Gold accents */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-1/4 w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
          <div className="absolute top-20 right-1/4 w-40 h-40 rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-16 text-center">
          {/* Animated check */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="w-20 h-20 rounded-full bg-success mx-auto flex items-center justify-center shadow-lg mb-6"
          >
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-3xl lg:text-4xl font-bold text-navy mb-3"
          >
            Your Plans Are Ready!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-light mb-8"
          >
            Thank you for your purchase. Download your plans below and start
            building your dream home.
          </motion.p>

          {/* Order recap */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-card p-6 text-left mb-6"
          >
            <h2 className="font-heading text-lg font-semibold text-navy mb-4">
              Order summary
            </h2>
            <dl className="space-y-2.5 text-sm">
              <Row label="Order ID" value={`#${purchase.id.slice(0, 8).toUpperCase()}`} />
              <Row label="Design" value={design.title} />
              <Row label="Package" value={packageName} />
              <Row label="Amount paid" value={amountLabel} highlight />
              <Row label="Date" value={formatDate(purchase.created_at)} />
            </dl>
          </motion.div>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading || used >= max}
            className="w-full gradient-gold text-navy font-bold text-lg rounded-xl py-4 shadow-gold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Preparing…
              </>
            ) : (
              <>
                <Download className="w-5 h-5" /> Download Your Plans
              </>
            )}
          </button>
          <p className="text-xs text-text-light mt-2">
            {used} of {max} downloads used
          </p>

          {/* Email note */}
          <div className="flex items-center justify-center gap-2 text-sm text-text-light mt-6">
            <Mail className="w-4 h-4" />
            <span>
              Check your email for the receipt{' '}
              <span className="text-text-light/70">
                (demo: confirmation logged to server console)
              </span>
            </span>
          </div>

          {/* Secondary CTAs */}
          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <Link
              href="/constructors"
              className="flex items-center justify-center gap-2 rounded-xl bg-navy text-white font-medium py-3 hover:opacity-90 transition-opacity min-h-[44px]"
            >
              <MapPin className="w-4 h-4" /> Find a Contractor
            </Link>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 text-navy font-medium py-3 hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              <Share2 className="w-4 h-4" /> Share on Facebook
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm">
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-1.5 text-navy font-medium hover:text-gold transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </Link>
            <Link
              href="/gallery"
              className="flex items-center gap-1.5 text-navy font-medium hover:text-gold transition-colors"
            >
              <Search className="w-4 h-4" /> Browse more designs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-text-light">{label}</dt>
      <dd
        className={
          highlight
            ? 'font-bold text-gold text-base'
            : 'font-medium text-navy'
        }
      >
        {value}
      </dd>
    </div>
  )
}
