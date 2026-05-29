'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Home, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const supabase          = createClient()
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setSentEmail(data.email)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-pc-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-card">
              <Home className="w-5 h-5 text-gold" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-2xl text-navy">PlanaCasa</span>
          </Link>

          {!sent ? (
            <>
              <h1 className="font-heading text-2xl font-bold text-text-dark mt-4">
                Reset your password
              </h1>
              <p className="text-text-light text-sm mt-1">
                Enter your email and we'll send you a reset link
              </p>
            </>
          ) : (
            <div className="mt-4">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-text-dark">
                Check your email
              </h1>
              <p className="text-text-light text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                We've sent a password reset link to{' '}
                <strong className="text-text-dark">{sentEmail}</strong>.
                Check your inbox (and spam folder).
              </p>
            </div>
          )}
        </div>

        {!sent && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label
                  className="block text-sm font-medium text-text-dark mb-1.5"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={[
                    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors',
                    errors.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-navy',
                  ].join(' ')}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-navy text-warm-white font-semibold text-sm hover:bg-navy-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-text-light hover:text-navy transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
