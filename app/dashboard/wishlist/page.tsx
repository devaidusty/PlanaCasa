import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WishlistGrid from '@/components/dashboard/WishlistGrid'
import type { Design } from '@/types'

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data } = await supabase
    .from('wishlists')
    .select('design:designs ( * )')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const designs = (data ?? [])
    .map((row) => {
      const d = (row as { design: Design | Design[] | null }).design
      return Array.isArray(d) ? d[0] : d
    })
    .filter((d): d is Design => Boolean(d))

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-navy mb-1">
        Saved Designs
      </h1>
      <p className="text-text-light mb-8">
        Plans you&apos;ve saved for later.
      </p>
      <WishlistGrid initialDesigns={designs} />
    </div>
  )
}
