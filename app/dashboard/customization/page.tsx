import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CustomizationList, {
  type CustomizationWithDesign,
} from '@/components/dashboard/CustomizationList'
import type { Design } from '@/types'

export default async function CustomizationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: requests }, { data: designs }] = await Promise.all([
    supabase
      .from('customization_requests')
      .select('*, design:designs ( title, slug )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('designs').select('id, title').order('title'),
  ])

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-navy mb-1">
        Customization Requests
      </h1>
      <p className="text-text-light mb-8">
        Need changes to a plan? Request a custom quote from our team.
      </p>
      <CustomizationList
        initialRequests={(requests ?? []) as CustomizationWithDesign[]}
        designs={(designs ?? []) as Pick<Design, 'id' | 'title'>[]}
      />
    </div>
  )
}
