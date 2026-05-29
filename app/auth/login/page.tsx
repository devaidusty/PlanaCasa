'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Home, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Metadata } from 'next'

const schema = z.object({
  email:    z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const returnTo     = searchParams.get('returnTo') ?? '/dashboard'
  const supabase     = createClient()

  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Welcome back!')
    router.push(returnTo)
    router.refresh()
  }

  const handleGoogleSignIn = async () => {
    setOauthLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?returnTo=${returnTo}` },
    })
    if (error) {
      toast.error(error.message)
      setOauthLoading(false)
    }
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
          <h1 className="font-heading text-2xl font-bold text-text-dark mt-4">
            Welcome back
          </h1>
          <p className="text-text-light text-sm mt-1">
            Sign in to access your purchases and wishlist
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-8">

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-text-dark text-sm font-medium hover:border-navy hover:bg-warm-white transition-colors disabled:opacity-50 mb-6"
          >
            {oauthLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-text-light">
              <span className="bg-white px-3">or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5" htmlFor="email">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-text-dark" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-navy hover:text-gold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={[
                    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors pr-11',
                    errors.password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-navy',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-navy text-warm-white font-semibold text-sm hover:bg-navy-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-text-light mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-navy font-medium hover:text-gold transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
