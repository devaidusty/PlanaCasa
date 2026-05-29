import { createClient } from '@/lib/supabase/server'

export interface AdminProfile {
  id: string
  role: 'customer' | 'admin'
  full_name: string
  email: string
}

export interface AdminContext {
  user: { id: string; email?: string }
  profile: AdminProfile
}

/**
 * Returns the current session's admin context, or null when the caller is not
 * an authenticated admin. Used as belt-and-suspenders alongside the proxy in
 * both admin server pages and /api/admin/* route handlers.
 */
export async function requireAdmin(): Promise<AdminContext | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase
    .from('users')
    .select('id, role, full_name, email')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'admin') return null

  return {
    user: { id: user.id, email: user.email },
    profile: profile as AdminProfile,
  }
}

/** Convenience boolean check. */
export async function isAdmin(): Promise<boolean> {
  return (await requireAdmin()) !== null
}
