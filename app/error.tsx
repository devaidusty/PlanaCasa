'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to your error monitoring service (e.g., Sentry)
    console.error('[ErrorBoundary]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-pc-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-text-dark mb-2">
          Something went wrong
        </h1>
        <p className="text-text-light text-sm leading-relaxed mb-8">
          We encountered an unexpected error. This has been logged and our team
          will look into it. Please try again.
        </p>

        {/* Error detail (dev only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <p className="text-xs text-red-400 bg-red-50 rounded-lg px-3 py-2 mb-6 font-mono text-left break-all">
            {error.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-navy text-warm-white font-medium text-sm hover:bg-navy-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-text-dark font-medium text-sm hover:border-navy transition-colors"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
