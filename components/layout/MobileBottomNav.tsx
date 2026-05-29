'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Calculator, User } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home',       href: '/',           icon: Home },
  { label: 'Gallery',    href: '/gallery',     icon: LayoutGrid },
  { label: 'Calculator', href: '/calculator',  icon: Calculator },
  { label: 'Dashboard',  href: '/dashboard',   icon: User },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_16px_rgba(27,42,74,0.10)]"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 h-16">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 min-h-[44px] relative group"
              aria-label={label}
            >
              {/* Active dot indicator */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gold" />
              )}

              <Icon
                className={`w-5 h-5 transition-colors ${
                  active ? 'text-gold' : 'text-text-light group-hover:text-navy'
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium leading-none transition-colors ${
                  active ? 'text-gold' : 'text-text-light group-hover:text-navy'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
