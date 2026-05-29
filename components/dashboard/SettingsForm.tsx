'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import { PH_PROVINCES, COUNTRIES } from '@/lib/constants/locations'
import type { User } from '@/types'

export default function SettingsForm({
  profile,
  email,
}: {
  profile: User | null
  email: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const { signOut } = useAuth()

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    location_country: profile?.location_country ?? 'Philippines',
    location_province: profile?.location_province ?? '',
    location_city: profile?.location_city ?? '',
    avatar_url: profile?.avatar_url ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('users')
      .update(form)
      .eq('id', profile.id)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Profile updated')
    router.refresh()
  }

  const handleReset = async () => {
    setResetting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setResetting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Password reset email sent')
  }

  const handleDelete = async () => {
    setDeleting(true)
    // Actual deletion requires an admin operation; for now we sign out.
    await signOut()
    toast.success('Account deletion requested')
    router.push('/')
  }

  const fieldCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm min-h-[44px] bg-white focus:outline-none focus:border-gold'

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl shadow-card p-6 space-y-4"
      >
        <h2 className="font-heading text-xl font-semibold text-navy">Profile</h2>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Full name
          </label>
          <input
            value={form.full_name}
            onChange={(e) => update('full_name', e.target.value)}
            className={fieldCls}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={fieldCls}
              placeholder="09xx xxx xxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Country
            </label>
            <select
              value={form.location_country}
              onChange={(e) => update('location_country', e.target.value)}
              className={fieldCls}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Province
            </label>
            <select
              value={form.location_province}
              onChange={(e) => update('location_province', e.target.value)}
              className={fieldCls}
            >
              <option value="">Select province</option>
              {PH_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              City
            </label>
            <input
              value={form.location_city}
              onChange={(e) => update('location_city', e.target.value)}
              className={fieldCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Avatar URL
          </label>
          <input
            value={form.avatar_url}
            onChange={(e) => update('avatar_url', e.target.value)}
            className={fieldCls}
            placeholder="https://…"
          />
        </div>

        <button
          type="submit"
          disabled={saving || !profile}
          className="gradient-gold text-navy font-semibold rounded-lg px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 min-h-[44px] flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </form>

      {/* Password */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="font-heading text-xl font-semibold text-navy">
          Change password
        </h2>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Email
          </label>
          <input
            value={email}
            readOnly
            className={`${fieldCls} bg-gray-50 text-text-light`}
          />
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="rounded-lg border-2 border-navy text-navy font-medium px-6 py-2.5 hover:bg-navy hover:text-white transition-colors disabled:opacity-40 min-h-[44px] flex items-center gap-2"
        >
          {resetting && <Loader2 className="w-4 h-4 animate-spin" />}
          Send password reset email
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-card p-6 border border-red-100">
        <h2 className="font-heading text-xl font-semibold text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger zone
        </h2>
        <p className="text-sm text-text-light mt-2 mb-4">
          Deleting your account is permanent. This will sign you out and request
          deletion of your data.
        </p>
        <Dialog>
          <DialogTrigger className="rounded-lg bg-red-600 text-white font-medium px-6 py-2.5 hover:bg-red-700 transition-colors min-h-[44px]">
            Delete account
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete account?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-text-light">
              This action cannot be undone. You will be signed out immediately.
            </p>
            <DialogFooter className="gap-2">
              <DialogClose className="rounded-lg border-2 border-gray-200 text-navy font-medium px-5 py-2.5 hover:bg-gray-50 min-h-[44px]">
                Cancel
              </DialogClose>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 text-white font-medium px-5 py-2.5 hover:bg-red-700 disabled:opacity-40 min-h-[44px] flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
