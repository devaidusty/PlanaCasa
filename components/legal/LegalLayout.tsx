import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <div className="bg-pc-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-light mb-6">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-navy font-medium">{title}</span>
        </nav>

        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-navy">
            {title}
          </h1>
          <p className="text-sm text-text-light mt-2">
            Last updated: {lastUpdated}
          </p>
        </header>

        <article
          className="max-w-none text-text-dark leading-relaxed
            [&_h2]:font-heading [&_h2]:text-navy [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:font-heading [&_h3]:text-navy [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:leading-relaxed [&_p]:my-4 [&_p]:text-text-dark
            [&_a]:text-gold hover:[&_a]:underline
            [&_strong]:text-navy [&_strong]:font-semibold
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-2
            [&_li]:leading-relaxed"
        >
          {children}
        </article>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
        </footer>
      </div>
    </div>
  )
}
