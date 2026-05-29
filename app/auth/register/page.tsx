'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Home, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z
  .object({
    full_name:        z.string().min(2, 'Full name must be at least 2 characters'),
    email:            z.string().email('Please enter a valid email address'),
    password:         z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
    location_country:  z.string().min(1, 'Country is required'),
    location_province: z.string().optional(),
    location_city:     z.string().optional(),
    terms:            z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type FormData = z.infer<typeof schema>

const COUNTRIES = [
  'Philippines',
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Singapore',
  'Japan',
  'South Korea',
  'Hong Kong',
  'Italy',
  'Other',
]

export default function RegisterPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [showPw, setShowPw]     = useState(false)
  const [showCPw, setShowCPw]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { location_country: 'Philippines' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options: {
        data: {
          full_name:         data.full_name,
          location_city:     data.location_city ?? '',
          location_province: data.location_province ?? '',
          location_country:  data.location_country,
        },
      },
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Account created! Check your email to confirm.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-pc-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-card">
              <Home className="w-5 h-5 text-gold" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-2xl text-navy">PlanaCasa</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-text-dark mt-4">
            Create your account
          </h1>
          <p className="text-text-light text-sm mt-1">
            Free to join — start browsing plans in minutes
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Full name */}
            <FormField
              id="full_name"
              label="Full name"
              placeholder="Juan dela Cruz"
              error={errors.full_name?.message}
              {...register('full_name')}
            />

            {/* Email */}
            <FormField
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  {...register('password')}
                  className={[
                    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors pr-11',
                    errors.password ? 'border-red-400' : 'border-gray-200 focus:border-navy',
                  ].join(' ')}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark" aria-label="Toggle password">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5" htmlFor="confirm_password">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={showCPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  {...register('confirm_password')}
                  className={[
                    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors pr-11',
                    errors.confirm_password ? 'border-red-400' : 'border-gray-200 focus:border-navy',
                  ].join(' ')}
                />
                <button type="button" onClick={() => setShowCPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark" aria-label="Toggle confirm password">
                  {showCPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5" htmlFor="location_country">
                Country
              </label>
              <select
                id="location_country"
                {...register('location_country')}
                className={[
                  'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white',
                  errors.location_country ? 'border-red-400' : 'border-gray-200 focus:border-navy',
                ].join(' ')}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.location_country && <p className="text-red-500 text-xs mt-1">{errors.location_country.message}</p>}
            </div>

            {/* Province + City */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="location_province"
                label="Province / State"
                placeholder="e.g. Pampanga"
                error={errors.location_province?.message}
                {...register('location_province')}
              />
              <FormField
                id="location_city"
                label="City / Municipality"
                placeholder="e.g. San Fernando"
                error={errors.location_city?.message}
                {...register('location_city')}
              />
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('terms')}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
                />
                <span className="text-sm text-text-light leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-navy underline hover:text-gold">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-navy underline hover:text-gold">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold text-navy font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-light mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-navy font-medium hover:text-gold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

// ── Shared form field ──────────────────────────────────────────────────────────

import { forwardRef } from 'react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, error, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium text-text-dark mb-1.5" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        {...props}
        className={[
          'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors',
          error ? 'border-red-400' : 'border-gray-200 focus:border-navy',
          props.className ?? '',
        ].join(' ')}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
)
FormField.displayName = 'FormField'
