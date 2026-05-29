'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Wrench,
  Settings,
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/purchases', label: 'My Purchases', icon: ShoppingBag },
  { href: '/dashboard/wishlist', label: 'Saved Designs', icon: Heart },
  { href: '/dashboard/customization', label: 'Customization Requests', icon: Wrench },
  { href: '/dashboard/settings', label: 'Account Settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useAuth()

  const initials =
    user?.full_name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U'

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-pc-bg">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        {/* Sidebar */}
        <aside className="mb-6 lg:mb-0">
          <div className="bg-white rounded-2xl shadow-card p-5 lg:sticky lg:top-24">
            {/* User */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-navy text-gold flex items-center justify-center font-semibold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-navy text-sm truncate">
                  {user?.full_name || 'Welcome'}
                </p>
                <p className="text-xs text-text-light truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                      active
                        ? 'bg-gold/15 text-navy'
                        : 'text-text-light hover:bg-gray-50 hover:text-navy'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${active ? 'text-gold' : ''}`}
                    />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
