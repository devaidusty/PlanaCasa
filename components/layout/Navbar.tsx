'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Home,
  ChevronDown,
  LayoutGrid,
  Calculator,
  BookOpen,
  HardHat,
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Menu,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/components/providers/AuthProvider'
import MobileMenu from '@/components/layout/MobileMenu'
import type { DesignStyle } from '@/types'

const STYLES: Array<{ label: string; value: DesignStyle }> = [
  { label: 'Modern Filipino',     value: 'modern_filipino' },
  { label: 'Tropical Modern',     value: 'tropical_modern' },
  { label: 'European Modern',     value: 'european_modern' },
  { label: 'UK Contemporary',     value: 'uk_contemporary' },
  { label: 'Scandinavian',        value: 'scandinavian' },
  { label: 'OFW Dream',           value: 'ofw_dream' },
  { label: 'Small Lot',           value: 'small_lot' },
  { label: 'Two-Storey Rental',   value: 'two_storey_rental' },
  { label: 'Bungalow',            value: 'bungalow' },
]

const NAV_LINKS = [
  { label: 'Browse Designs', href: '/gallery', icon: LayoutGrid },
  { label: 'Constructors',   href: '/constructors', icon: HardHat },
  { label: 'Cost Calculator',href: '/calculator', icon: Calculator },
  { label: 'Guides',         href: '/guides', icon: BookOpen },
]

export default function Navbar() {
  const pathname            = usePathname()
  const router              = useRouter()
  const { user, signOut }   = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stylesOpen, setStylesOpen] = useState(false)
  const stylesRef = useRef<HTMLDivElement>(null)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close styles dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (stylesRef.current && !stylesRef.current.contains(e.target as Node)) {
        setStylesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-navy/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-5',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shadow-gold transition-transform group-hover:scale-105">
                <Home className="w-5 h-5 text-navy" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-xl text-warm-white tracking-tight">
                  PlanaCasa
                </span>
                <span className="font-accent text-gold text-[11px] tracking-widest hidden sm:block">
                  HOUSE PLAN MARKETPLACE
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-1">

              {/* Browse Designs */}
              <NavLink href="/gallery" active={isActive('/gallery')}>
                Browse Designs
              </NavLink>

              {/* Styles dropdown */}
              <div ref={stylesRef} className="relative">
                <button
                  onClick={() => setStylesOpen((v) => !v)}
                  className={[
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    stylesOpen || pathname.startsWith('/gallery?style')
                      ? 'text-gold'
                      : 'text-warm-white/80 hover:text-warm-white hover:bg-white/10',
                  ].join(' ')}
                >
                  Styles
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${stylesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {stylesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-gray-100 py-2 z-50"
                    >
                      {STYLES.map(({ label, value }) => (
                        <Link
                          key={value}
                          href={`/gallery?style=${value}`}
                          onClick={() => setStylesOpen(false)}
                          className="block px-4 py-2.5 text-sm text-text-dark hover:bg-warm-white hover:text-navy transition-colors"
                        >
                          {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {NAV_LINKS.slice(1).map(({ label, href }) => (
                <NavLink key={href} href={href} active={isActive(href)}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* ── Auth Area ── */}
            <div className="hidden lg:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-warm-white border border-white/25 hover:border-gold hover:text-gold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-5 py-2 rounded-full text-sm font-semibold bg-gold text-navy hover:bg-gold-light transition-colors shadow-gold"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-white/10 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar_url} alt={user.full_name} />
                      <AvatarFallback className="bg-gold text-navy text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-warm-white max-w-[120px] truncate">
                      {user.full_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-warm-white/60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard')}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/purchases')}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" /> My Purchases
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/wishlist')}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Heart className="w-4 h-4" /> Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-red-500 focus:text-red-500"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              className="lg:hidden p-2 rounded-lg text-warm-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        styles={STYLES}
        navLinks={NAV_LINKS}
      />
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={[
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'text-gold'
          : 'text-warm-white/80 hover:text-warm-white hover:bg-white/10',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}
