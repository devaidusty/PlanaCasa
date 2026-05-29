'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  Users,
  ShoppingBag,
  BookOpen,
  Mail,
  ChevronRight,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/designs', label: 'Designs', icon: Home },
  { href: '/admin/contractors', label: 'Contractors', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/guides', label: 'Guides', icon: BookOpen },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
]

interface AdminSidebarProps {
  name: string
  email: string
}

export default function AdminSidebar({ name, email }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 gradient-navy text-warm-white min-h-screen sticky top-0">
        <div className="px-5 py-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
              <Home className="w-5 h-5 text-navy" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-heading font-bold text-lg leading-none">
                PlanaCasa
              </p>
              <p className="font-accent text-gold text-[10px] tracking-widest mt-0.5">
                ADMIN PANEL
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium min-h-[44px] transition-colors ${
                  active
                    ? 'bg-gold/20 text-gold'
                    : 'text-warm-white/70 hover:bg-white/5 hover:text-warm-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-warm-white/60 hover:text-gold transition-colors min-h-[44px]"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to site
          </Link>
          <div className="px-3 pt-3 mt-1 border-t border-white/10">
            <p className="text-sm font-medium text-warm-white truncate">
              {name || 'Admin'}
            </p>
            <p className="text-xs text-warm-white/50 truncate">{email}</p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden gradient-navy text-warm-white sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <Home className="w-4 h-4 text-navy" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-base">
              PlanaCasa <span className="text-gold text-xs">Admin</span>
            </span>
          </Link>
          <Link href="/" className="text-xs text-warm-white/70 hover:text-gold">
            Back to site
          </Link>
        </div>
        <nav className="flex gap-1 px-3 pb-2 overflow-x-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-gold/20 text-gold'
                    : 'text-warm-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
