import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-pc-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 large text */}
        <div className="font-heading text-8xl font-bold text-navy/10 leading-none mb-4 select-none">
          404
        </div>

        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-6 -mt-8 shadow-card">
          <Home className="w-8 h-8 text-gold" strokeWidth={2} />
        </div>

        <h1 className="font-heading text-2xl font-bold text-text-dark mb-2">
          This page doesn't exist
        </h1>
        <p className="text-text-light text-sm leading-relaxed mb-8">
          The page you're looking for may have been moved, renamed, or never existed.
          Browse our house plans to find your dream home design.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/gallery"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-navy font-semibold text-sm hover:bg-gold-light transition-colors shadow-gold"
          >
            <Search className="w-4 h-4" />
            Browse Designs
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-text-dark font-medium text-sm hover:border-navy transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Popular styles */}
        <div className="mt-10">
          <p className="text-xs text-text-light font-accent tracking-wider uppercase mb-3">
            Popular styles
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Modern Filipino', 'OFW Dream', 'Bungalow', 'Tropical Modern', 'Small Lot'].map(
              (style) => (
                <Link
                  key={style}
                  href={`/gallery?style=${style.toLowerCase().replace(/\s+/g, '_')}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-text-dark hover:border-gold hover:text-gold transition-colors"
                >
                  {style}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
