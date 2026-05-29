'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
  X,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/components/providers/AuthProvider'
import type { DesignStyle } from '@/types'

interface NavLinkItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface StyleItem {
  label: string
  value: DesignStyle
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  styles: StyleItem[]
  navLinks: NavLinkItem[]
}

export default function MobileMenu({ open, onClose, styles, navLinks }: MobileMenuProps) {
  const pathname          = usePathname()
  const router            = useRouter()
  const { user, signOut } = useAuth()
  const [stylesExpanded, setStylesExpanded] = useState(false)

  const handleNav = (href: string) => {
    onClose()
    router.push(href)
  }

  const handleSignOut = async () => {
    onClose()
    await signOut()
    router.push('/')
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-80 max-w-full p-0 bg-navy border-l border-white/10 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <Home className="w-4 h-4 text-navy" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-lg text-warm-white">
                PlanaCasa
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-warm-white/60 hover:text-warm-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">

            {/* Browse Designs */}
            <MobileNavItem
              href="/gallery"
              active={isActive('/gallery')}
              icon={LayoutGrid}
              onClick={onClose}
            >
              Browse Designs
            </MobileNavItem>

            {/* Styles accordion */}
            <div>
              <button
                onClick={() => setStylesExpanded((v) => !v)}
                className={[
                  'w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                  stylesExpanded
                    ? 'text-gold bg-white/5'
                    : 'text-warm-white/80 hover:text-warm-white hover:bg-white/5',
                ].join(' ')}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5" />
                  <span>Styles</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${stylesExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {stylesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-11 pr-3 pb-2 space-y-1">
                      {styles.map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => handleNav(`/gallery?style=${value}`)}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-warm-white/70 hover:text-warm-white hover:bg-white/5 transition-colors"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remaining nav links */}
            {navLinks.slice(1).map(({ label, href, icon: Icon }) => (
              <MobileNavItem
                key={href}
                href={href}
                active={isActive(href)}
                icon={Icon}
                onClick={onClose}
              >
                {label}
              </MobileNavItem>
            ))}
          </div>
        </nav>

        {/* Auth section */}
        <div className="border-t border-white/10 p-4 flex-shrink-0">
          {!user ? (
            <div className="space-y-2">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="block w-full text-center px-4 py-3 rounded-xl text-sm font-medium text-warm-white border border-white/20 hover:border-gold hover:text-gold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-gold text-navy hover:bg-gold-light transition-colors"
              >
                Get Started — It's Free
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {/* User info row */}
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback className="bg-gold text-navy text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-warm-white truncate">{user.full_name}</p>
                  <p className="text-xs text-warm-white/50 truncate">{user.email}</p>
                </div>
              </div>

              <MobileNavItem href="/dashboard" active={isActive('/dashboard')} icon={User} onClick={onClose}>
                Dashboard
              </MobileNavItem>
              <MobileNavItem href="/dashboard/purchases" active={isActive('/dashboard/purchases')} icon={ShoppingBag} onClick={onClose}>
                My Purchases
              </MobileNavItem>
              <MobileNavItem href="/dashboard/wishlist" active={isActive('/dashboard/wishlist')} icon={Heart} onClick={onClose}>
                Wishlist
              </MobileNavItem>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Sub-component ────────────────────────────────────────────────────────────

function MobileNavItem({
  href,
  active,
  icon: Icon,
  onClick,
  children,
}: {
  href: string
  active: boolean
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
        active
          ? 'text-gold bg-white/5'
          : 'text-warm-white/80 hover:text-warm-white hover:bg-white/5',
      ].join(' ')}
    >
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  )
}
