import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/dashboard/SettingsForm'
import type { User } from '@/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-navy mb-1">
        Account Settings
      </h1>
      <p className="text-text-light mb-8">
        Manage your profile and account preferences.
      </p>
      <SettingsForm
        profile={(profile ?? null) as User | null}
        email={user.email ?? ''}
      />
    </div>
  )
}
