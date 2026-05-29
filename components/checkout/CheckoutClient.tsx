'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Check,
  Loader2,
  ShieldCheck,
  Download,
  Zap,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { PH_PROVINCES, COUNTRIES } from '@/lib/constants/locations'
import type { Design, DesignPackage, User } from '@/types'

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Phone number is required'),
  location_country: z.string().min(1, 'Country is required'),
  location_province: z.string().min(1, 'Province is required'),
  location_city: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type PayMongoMethod = 'gcash' | 'maya' | 'card' | 'bank'

interface CheckoutClientProps {
  design: Design
  packages: DesignPackage[]
  selectedPackageId?: string
  userEmail: string
  profile: User | null
}

const PAYMONGO_OPTIONS: { value: PayMongoMethod; label: string; badge: string }[] = [
  { value: 'gcash', label: 'GCash', badge: '🟦 GCash' },
  { value: 'maya', label: 'Maya', badge: '🟩 Maya' },
  { value: 'card', label: 'Credit / Debit Card', badge: '💳 Card' },
  { value: 'bank', label: 'Bank Transfer', badge: '🏦 Bank' },
]

export default function CheckoutClient({
  design,
  packages,
  selectedPackageId,
  userEmail,
  profile,
}: CheckoutClientProps) {
  const router = useRouter()

  const initialPackageId =
    packages.find((p) => p.id === selectedPackageId)?.id ??
    packages[0]?.id ??
    ''

  const [packageId, setPackageId] = useState(initialPackageId)
  const [paymentTab, setPaymentTab] = useState<'paymongo' | 'stripe'>('paymongo')
  const [payMongoMethod, setPayMongoMethod] = useState<PayMongoMethod>('gcash')
  const [terms, setTerms] = useState(false)
  const [promo, setPromo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === packageId) ?? packages[0],
    [packages, packageId]
  )

  const method = paymentTab === 'stripe' ? 'stripe_card' : payMongoMethod
  const currency = paymentTab === 'stripe' ? 'USD' : 'PHP'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      full_name: profile?.full_name ?? '',
      email: profile?.email || userEmail,
      phone: profile?.phone ?? '',
      location_country: profile?.location_country || 'Philippines',
      location_province: profile?.location_province ?? '',
      location_city: profile?.location_city ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!terms) {
      toast.error('Please accept the Terms & Conditions')
      return
    }
    if (!selectedPackage) {
      toast.error('Please select a package')
      return
    }

    setSubmitting(true)
    setFailed(false)

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId: design.id,
          packageId: selectedPackage.id,
          buyer: {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            location_city: data.location_city ?? '',
            location_province: data.location_province,
            location_country: data.location_country,
          },
          paymentMethod: method,
        }),
      })

      if (res.status === 401) {
        router.push(`/auth/login?returnTo=${encodeURIComponent(`/checkout?design=${design.slug}&package=${selectedPackage.id}`)}`)
        return
      }

      const json = (await res.json()) as {
        purchaseId?: string
        status?: string
        error?: string
      }

      if (res.ok && json.status === 'completed' && json.purchaseId) {
        router.push(`/success?purchase=${json.purchaseId}`)
        return
      }

      // Failure path (402 or other).
      setFailed(true)
      toast.error('Payment failed. Please try again or use a different method.')
    } catch {
      setFailed(true)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const total = Number(selectedPackage?.price ?? 0)
  const includes = selectedPackage?.includes ?? []

  return (
    <div className="min-h-screen bg-pc-bg">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-navy mb-2">
          Checkout
        </h1>
        <p className="text-text-light mb-8">
          Complete your purchase to download your plans instantly.
        </p>

        {/* Mobile summary (top) */}
        <div className="lg:hidden mb-6">
          <OrderSummary
            design={design}
            packageName={selectedPackage?.package_name ?? ''}
            includes={includes}
            total={total}
            currency={currency}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid lg:grid-cols-[1fr_380px] gap-8 items-start"
          noValidate
        >
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* 1. Package selector */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-semibold text-navy mb-4">
                1. Choose your package
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {packages.map((p) => {
                  const active = p.id === packageId
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPackageId(p.id)}
                      className={`text-left rounded-xl border-2 p-4 transition-all min-h-[44px] ${
                        active
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-navy">
                          {p.package_name}
                        </span>
                        {active && (
                          <span className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                            <Check className="w-3 h-3 text-navy" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <span className="text-gold font-bold">
                        {formatPHP(Number(p.price))}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* 2. Buyer details */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-semibold text-navy mb-4">
                2. Your details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" error={errors.full_name?.message} className="sm:col-span-2">
                  <input
                    {...register('full_name')}
                    className="cc-input"
                    placeholder="Juan Dela Cruz"
                  />
                </Field>

                <Field label="Email" error={errors.email?.message}>
                  <input
                    {...register('email')}
                    type="email"
                    className="cc-input"
                    placeholder="you@email.com"
                  />
                </Field>

                <Field label="Phone" error={errors.phone?.message}>
                  <input
                    {...register('phone')}
                    className="cc-input"
                    placeholder="09xx xxx xxxx"
                  />
                </Field>

                <Field label="Country" error={errors.location_country?.message}>
                  <select {...register('location_country')} className="cc-input">
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Province" error={errors.location_province?.message}>
                  <select {...register('location_province')} className="cc-input">
                    <option value="">Select province</option>
                    {PH_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="City (optional)" className="sm:col-span-2">
                  <input
                    {...register('location_city')}
                    className="cc-input"
                    placeholder="City / Municipality"
                  />
                </Field>
              </div>
            </section>

            {/* 3. Payment method */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-semibold text-navy mb-4">
                3. Payment method
              </h2>

              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 mb-5">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  Demo mode — payments are simulated. No real charge is made.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentTab('paymongo')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium border-2 transition-colors min-h-[44px] ${
                    paymentTab === 'paymongo'
                      ? 'border-navy bg-navy text-white'
                      : 'border-gray-200 text-text-light'
                  }`}
                >
                  Philippines (PayMongo)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('stripe')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium border-2 transition-colors min-h-[44px] ${
                    paymentTab === 'stripe'
                      ? 'border-navy bg-navy text-white'
                      : 'border-gray-200 text-text-light'
                  }`}
                >
                  International (Stripe)
                </button>
              </div>

              {paymentTab === 'paymongo' ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {PAYMONGO_OPTIONS.map((opt) => {
                    const active = payMongoMethod === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPayMongoMethod(opt.value)}
                        className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all min-h-[44px] ${
                          active
                            ? 'border-gold bg-gold/5 text-navy'
                            : 'border-gray-200 text-text-light hover:border-gray-300'
                        }`}
                      >
                        <span>{opt.badge}</span>
                        {active && (
                          <Check className="w-4 h-4 text-gold" strokeWidth={3} />
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-gold bg-gold/5 px-4 py-4">
                  <p className="font-medium text-navy">💳 Card / Apple Pay / Google Pay</p>
                  <p className="text-sm text-text-light mt-1">
                    Charged in USD via Stripe.
                  </p>
                </div>
              )}
            </section>

            {/* 4. Promo code */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-semibold text-navy mb-4">
                Promo code
              </h2>
              <div className="flex gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="cc-input flex-1"
                  placeholder="Enter promo code"
                />
                <button
                  type="button"
                  onClick={() => toast.info('Promo codes coming soon')}
                  className="rounded-lg border-2 border-gray-200 px-5 text-sm font-medium text-navy hover:bg-gray-50 min-h-[44px]"
                >
                  Apply
                </button>
              </div>
            </section>

            {/* 5. Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#C9A84C]"
              />
              <label htmlFor="terms" className="text-sm text-text-dark leading-relaxed">
                I agree to the{' '}
                <a href="/legal/terms" className="text-navy underline font-medium">
                  Terms &amp; Conditions
                </a>{' '}
                and understand plans are conceptual reference documents.
              </label>
            </div>

            {failed && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                Your payment did not go through. Please review your details and try
                again.
              </div>
            )}

            {/* 6. Submit */}
            <button
              type="submit"
              disabled={!terms || !isValid || submitting}
              className="w-full gradient-gold text-navy font-bold text-lg rounded-xl py-4 shadow-gold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Complete Purchase
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN — sticky summary (desktop) */}
          <div className="hidden lg:block sticky top-24">
            <OrderSummary
              design={design}
              packageName={selectedPackage?.package_name ?? ''}
              includes={includes}
              total={total}
              currency={currency}
            />
          </div>
        </form>
      </div>

      <style jsx global>{`
        .cc-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          padding: 0.625rem 0.875rem;
          font-size: 0.9rem;
          min-height: 44px;
          background: #fff;
        }
        .cc-input:focus {
          outline: none;
          border-color: #c9a84c;
          box-shadow: 0 0 0 2px rgba(201, 168, 76, 0.25);
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-text-dark mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

function OrderSummary({
  design,
  packageName,
  includes,
  total,
  currency,
}: {
  design: Design
  packageName: string
  includes: string[]
  total: number
  currency: string
}) {
  const thumb = design.preview_images?.[0]
  const visible = includes.slice(0, 4)
  const remaining = includes.length - visible.length

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="bg-navy p-5">
        <div className="flex gap-3">
          <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-navy-dark shrink-0">
            {thumb && (
              <Image
                src={thumb}
                alt={design.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-white font-semibold leading-tight line-clamp-2">
              {design.title}
            </h3>
            <span className="inline-block mt-1 text-xs text-gold font-medium">
              {packageName} Package
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {visible.length > 0 && (
          <>
            <p className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2">
              What&apos;s included
            </p>
            <ul className="space-y-1.5 mb-4">
              {visible.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-text-dark"
                >
                  <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
              {remaining > 0 && (
                <li className="text-sm text-text-light pl-6">
                  and {remaining} more
                </li>
              )}
            </ul>
          </>
        )}

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <span className="font-semibold text-navy">Total</span>
          <span className="font-heading text-2xl font-bold text-gold">
            {formatPHP(total)}
          </span>
        </div>

        {currency === 'USD' && (
          <p className="text-xs text-text-light mt-2">
            International payments are charged in USD at checkout.
          </p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-2 text-xs text-text-light">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" /> Secure payment
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gold" /> Instant delivery
          </span>
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-navy" /> 5 downloads / 30-day access
          </span>
        </div>
      </div>
    </div>
  )
}
