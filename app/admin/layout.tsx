import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await requireAdmin()
  if (!ctx) redirect('/')

  return (
    <div className="min-h-screen bg-pc-bg md:flex">
      <AdminSidebar
        name={ctx.profile.full_name}
        email={ctx.profile.email}
      />
      <div className="flex-1 min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  )
}
