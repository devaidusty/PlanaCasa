import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  BadgeCheck,
  Award,
  Briefcase,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { specLabel } from '@/lib/constants/contractors'
import ImageGallery from '@/components/design/ImageGallery'
import ContactButton from '@/components/constructors/ContactButton'
import ReviewsSection from '@/components/constructors/ReviewsSection'
import type { ReviewWithUser } from '@/components/constructors/ReviewCard'
import type { Contractor } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

async function getContractor(id: string): Promise<Contractor | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contractors')
    .select('*')
    .eq('id', id)
    .single()
  return (data as Contractor) ?? null
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const contractor = await getContractor(id)
  if (!contractor) {
    return { title: 'Contractor Not Found | PlanaCasa' }
  }
  return {
    title: `${contractor.business_name} — ${contractor.city}, ${contractor.province} | PlanaCasa`,
    description:
      contractor.description?.slice(0, 155) ??
      `Verified contractor in ${contractor.province}, Philippines.`,
  }
}

export default async function ContractorProfilePage({ params }: PageProps) {
  const { id } = await params
  const contractor = await getContractor(id)
  if (!contractor) notFound()

  const supabase = await createClient()
  const { data: reviewData } = await supabase
    .from('contractor_reviews')
    .select('id, rating, review_text, project_type, project_location, created_at, user:users(full_name, avatar_url)')
    .eq('contractor_id', id)
    .order('created_at', { ascending: false })

  const reviews = ((reviewData ?? []) as unknown[]).map((r) => {
    const row = r as {
      id: string
      rating: number
      review_text: string
      project_type: string | null
      project_location: string | null
      created_at: string
      user: { full_name: string | null; avatar_url: string | null } | { full_name: string | null; avatar_url: string | null }[] | null
    }
    const user = Array.isArray(row.user) ? row.user[0] ?? null : row.user
    return { ...row, user } as ReviewWithUser
  })

  const coverImage = contractor.portfolio_images?.[0]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>{' '}
        ›{' '}
        <Link href="/constructors" className="hover:text-gray-700">
          Contractors
        </Link>{' '}
        › <span style={{ color: '#1B2A4A' }}>{contractor.business_name}</span>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
        >
          {/* Cover band */}
          <div
            className="h-40 w-full bg-cover bg-center"
            style={
              coverImage
                ? { backgroundImage: `url(${coverImage})` }
                : { background: 'linear-gradient(135deg, #1B2A4A 0%, #111c31 100%)' }
            }
          />
          <div className="bg-white p-6">
            <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div
                className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-white text-2xl font-bold"
                style={{ backgroundColor: '#1B2A4A', color: '#C9A84C' }}
              >
                {getInitials(contractor.business_name)}
              </div>
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold" style={{ color: '#1B2A4A' }}>
                  {contractor.business_name}
                </h1>
                <p className="text-gray-500">{contractor.owner_name}</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" style={{ color: '#C9A84C' }} />
                  {contractor.city}, {contractor.province}
                  {contractor.region && (
                    <span className="text-gray-400">· {contractor.region}</span>
                  )}
                </div>
              </div>
              {/* Rating summary + badges */}
              <div className="flex flex-col items-start gap-2 sm:items-end">
                {contractor.total_reviews > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold" style={{ color: '#1B2A4A' }}>
                      {contractor.average_rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({contractor.total_reviews})
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No reviews yet</span>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {contractor.is_featured && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: 'rgba(201,168,76,0.18)', color: '#9a7d2e' }}>
                      <Award className="h-3 w-3" /> Featured
                    </span>
                  )}
                  {contractor.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {contractor.description && (
              <section>
                <h2 className="mb-3 font-heading text-xl font-semibold" style={{ color: '#1B2A4A' }}>
                  About
                </h2>
                <p className="leading-relaxed text-gray-600">
                  {contractor.description}
                </p>
              </section>
            )}

            {contractor.specializations?.length > 0 && (
              <section>
                <h2 className="mb-3 font-heading text-xl font-semibold" style={{ color: '#1B2A4A' }}>
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {contractor.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full px-3 py-1.5 text-sm"
                      style={{ backgroundColor: 'rgba(27,42,74,0.08)', color: '#1B2A4A' }}
                    >
                      {specLabel(spec)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {contractor.coverage_areas?.length > 0 && (
              <section>
                <h2 className="mb-3 font-heading text-xl font-semibold" style={{ color: '#1B2A4A' }}>
                  Coverage Areas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {contractor.coverage_areas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm"
                      style={{ borderColor: 'rgba(27,42,74,0.2)', color: '#1B2A4A' }}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {area}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(contractor.pcab_accredited ||
              contractor.prc_licensed ||
              contractor.license_number) && (
              <section>
                <h2 className="mb-3 font-heading text-xl font-semibold" style={{ color: '#1B2A4A' }}>
                  License & Accreditation
                </h2>
                <div className="space-y-2 text-sm">
                  {contractor.pcab_accredited && (
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Shield className="h-4 w-4" />
                      PCAB Accredited
                      {contractor.license_number && (
                        <span className="text-gray-500">
                          · License #{contractor.license_number}
                        </span>
                      )}
                    </div>
                  )}
                  {contractor.prc_licensed && (
                    <div className="flex items-center gap-2 text-blue-700">
                      <BadgeCheck className="h-4 w-4" />
                      PRC Licensed
                    </div>
                  )}
                  {!contractor.pcab_accredited && contractor.license_number && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="h-4 w-4" />
                      License #{contractor.license_number}
                    </div>
                  )}
                </div>
              </section>
            )}

            {contractor.portfolio_images?.length > 0 && (
              <section>
                <h2 className="mb-3 font-heading text-xl font-semibold" style={{ color: '#1B2A4A' }}>
                  Portfolio
                </h2>
                <ImageGallery
                  images={contractor.portfolio_images}
                  title={contractor.business_name}
                />
              </section>
            )}
          </div>

          {/* Right — sticky contact card */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 rounded-2xl bg-white p-6"
              style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
            >
              {contractor.price_range_min > 0 && (
                <div className="mb-4 border-b border-gray-100 pb-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Price Range
                  </p>
                  <p className="font-heading text-xl font-bold" style={{ color: '#1B2A4A' }}>
                    {formatPHP(contractor.price_range_min)} –{' '}
                    {formatPHP(contractor.price_range_max)}
                  </p>
                  <p className="text-xs text-gray-400">per sqm</p>
                </div>
              )}

              {contractor.years_experience > 0 && (
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" style={{ color: '#C9A84C' }} />
                  {contractor.years_experience} years of experience
                </div>
              )}

              <div className="mb-4 space-y-2">
                {contractor.contact_phone && (
                  <a
                    href={`tel:${contractor.contact_phone}`}
                    className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Phone className="h-4 w-4" style={{ color: '#1B2A4A' }} />
                    {contractor.contact_phone}
                  </a>
                )}
                {contractor.contact_email && (
                  <a
                    href={`mailto:${contractor.contact_email}`}
                    className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Mail className="h-4 w-4" style={{ color: '#1B2A4A' }} />
                    <span className="truncate">{contractor.contact_email}</span>
                  </a>
                )}
                {(contractor.contact_messenger || contractor.facebook_page) && (
                  <a
                    href={
                      contractor.contact_messenger
                        ? contractor.contact_messenger.startsWith('http')
                          ? contractor.contact_messenger
                          : `https://m.me/${contractor.contact_messenger}`
                        : contractor.facebook_page.startsWith('http')
                          ? contractor.facebook_page
                          : `https://facebook.com/${contractor.facebook_page}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <MessageCircle className="h-4 w-4" style={{ color: '#1B2A4A' }} />
                    Message on Facebook
                  </a>
                )}
              </div>

              <ContactButton contractor={contractor} label="Request Quote" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSection
        contractorId={contractor.id}
        reviews={reviews}
        averageRating={contractor.average_rating}
        totalReviews={contractor.total_reviews}
      />

      {/* Disclaimer */}
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <p className="rounded-xl bg-white p-4 text-center text-xs leading-relaxed text-gray-400">
          PlanaCasa connects you with independent contractors and is not party to
          any agreement between you and any contractor. We do not employ,
          guarantee, or warrant the work of any contractor listed.
        </p>
      </div>
    </div>
  )
}
