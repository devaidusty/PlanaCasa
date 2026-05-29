import Link from 'next/link'
import { Home } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'Gallery',     href: '/gallery' },
  { label: 'Styles',      href: '/gallery#styles' },
  { label: 'Calculator',  href: '/calculator' },
  { label: 'Guides',      href: '/guides' },
]

const SUPPORT_LINKS = [
  { label: 'How It Works',  href: '/how-it-works' },
  { label: 'Constructors',  href: '/constructors' },
  { label: 'FAQ',           href: '/faq' },
  { label: 'Contact Us',    href: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Terms of Service',  href: '/legal/terms' },
  { label: 'Privacy Policy',    href: '/legal/privacy' },
  { label: 'Disclaimer',        href: '/legal/disclaimer' },
]

// All social icons as inline SVGs (lucide-react v1 removed brand icons)
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-navy text-warm-white">

      {/* Gold accent line */}
      <div className="h-0.5 bg-gold w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
                <Home className="w-5 h-5 text-navy" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-heading font-bold text-xl leading-none">PlanaCasa</p>
                <p className="font-accent text-gold text-[10px] tracking-widest mt-0.5">
                  HOUSE PLAN MARKETPLACE
                </p>
              </div>
            </Link>

            <p className="text-warm-white/65 text-sm leading-relaxed mt-4 max-w-xs">
              Your dream home starts with the right plan. Browse ready-made house designs
              built for the Philippine climate, culture, and budget.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <SocialLink href="https://facebook.com" aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://pinterest.com" aria-label="Pinterest">
                <PinterestIcon className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://youtube.com" aria-label="YouTube">
                <YoutubeIcon className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://tiktok.com" aria-label="TikTok">
                <TikTokIcon className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://instagram.com" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </SocialLink>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider text-gold uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-warm-white/65 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Support */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider text-gold uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-warm-white/65 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider text-gold uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-warm-white/65 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warm-white/40">
            <p>© {new Date().getFullYear()} PlanaCasa. All rights reserved.</p>
            <p className="text-center sm:text-right max-w-sm">
              All house plans are prepared by or in collaboration with licensed architects
              registered with the Professional Regulation Commission (PRC), Philippines.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  children,
  'aria-label': ariaLabel,
}: {
  href: string
  children: React.ReactNode
  'aria-label': string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-warm-white/60 hover:bg-gold hover:text-navy transition-colors"
    >
      {children}
    </a>
  )
}
