'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CheckCircle,
  ShieldCheck,
  Download,
  RefreshCw,
  Heart,
  Share2,
  Bed,
  Bath,
  Ruler,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPHP } from '@/lib/utils/formatCurrency'
import type { Design, DesignPackage } from '@/types'

interface PricingPackagesProps {
  packages: DesignPackage[]
  design: Design
}

export default function PricingPackages({ packages, design }: PricingPackagesProps) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string>(
    packages.find((p) => p.package_name === 'Standard')?.id ?? packages[0]?.id ?? ''
  )
  const [isWishlisted, setIsWishlisted] = useState(false)

  const selectedPackage = packages.find((p) => p.id === selectedId) ?? packages[0]

  const handleBuyNow = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/auth/login?returnTo=/design/${design.slug}`)
      return
    }

    router.push(`/checkout?design=${design.slug}&package=${selectedId}`)
  }

  const handleWishlist = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    const next = !isWishlisted
    setIsWishlisted(next)

    await fetch('/api/wishlist', {
      method: next ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ designId: design.id }),
    })
  }

  const handleShare = async (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `Check out this house plan: ${design.title} — ${url}`

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'messenger':
        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=0`, '_blank')
        break
      case 'viber':
        window.open(`viber://forward?text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'pinterest':
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(design.title)}`,
          '_blank'
        )
        break
      default:
        if (navigator.share) {
          navigator.share({ title: design.title, url })
        }
    }
  }

  return (
    <>
      {/* Main sticky sidebar (desktop) */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Design summary */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <h2 className="font-heading text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>
              {design.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{design.bedrooms}</span>
              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{design.bathrooms}</span>
              <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" />{design.floor_area_sqm} sqm</span>
            </div>
          </div>

          {/* Package cards */}
          <div className="space-y-3 mb-5">
            {packages.map((pkg) => {
              const isSelected = pkg.id === selectedId
              const isRecommended = pkg.package_name === 'Standard'
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedId(pkg.id)}
                  className={`relative rounded-xl p-4 border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={isSelected ? { borderColor: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.05)' } : undefined}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 left-4 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#C9A84C' }}>
                      RECOMMENDED
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm" style={{ color: '#1B2A4A' }}>
                      {pkg.package_name}
                    </span>
                    <span className="text-xl font-bold" style={{ color: '#C9A84C' }}>
                      {formatPHP(pkg.price)}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="w-full py-3.5 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
          >
            Buy Now — {selectedPackage ? formatPHP(selectedPackage.price) : ''}
          </button>

          {/* Trust signals */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure payment via PayMongo &amp; Stripe
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Download className="w-4 h-4 text-emerald-500" />
              Instant digital delivery after payment
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              5 downloads · 30-day access
            </div>
          </div>

          <div className="my-5 border-t border-gray-100" />

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-medium hover:border-gray-300 transition-colors"
            style={{ color: '#1B2A4A' }}
          >
            <Heart
              className="w-4 h-4"
              fill={isWishlisted ? '#ef4444' : 'none'}
              stroke={isWishlisted ? '#ef4444' : 'currentColor'}
            />
            {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
          </button>

          {/* Share */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-500">Share:</span>
            {[
              { key: 'facebook', label: 'FB', color: '#1877F2' },
              { key: 'messenger', label: 'Me', color: '#006AFF' },
              { key: 'viber', label: 'Vi', color: '#7360F2' },
              { key: 'whatsapp', label: 'WA', color: '#25D366' },
              { key: 'pinterest', label: 'Pi', color: '#E60023' },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => handleShare(key)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: color }}
                aria-label={`Share on ${key}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href={`/contact?design=${design.slug}&type=customization`}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2"
            >
              Request Customization
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500">{selectedPackage?.package_name}</p>
            <p className="font-bold" style={{ color: '#C9A84C' }}>
              {selectedPackage ? formatPHP(selectedPackage.price) : ''}
            </p>
          </div>
          <button
            onClick={handleBuyNow}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  )
}
