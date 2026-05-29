'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, ShieldCheck, BadgeCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ContractorCardSkeleton } from '@/components/shared/LoadingSkeleton'
import ScrollReveal from '@/components/shared/ScrollReveal'
import type { Contractor } from '@/types'

const REGIONS = ['NCR', 'Luzon', 'Visayas', 'Mindanao']

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

interface ContractorCardProps {
  contractor: Contractor
  delay: number
}

function ContractorCard({ contractor, delay }: ContractorCardProps) {
  return (
    <ScrollReveal delay={delay}>
      <div
        className="bg-white rounded-xl p-6 flex flex-col gap-4 h-full"
        style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
            style={{ backgroundColor: '#1B2A4A' }}
          >
            {getInitials(contractor.business_name)}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-base leading-tight" style={{ color: '#1B2A4A' }}>
              {contractor.business_name}
            </h3>
            <p className="text-sm text-gray-500">{contractor.owner_name}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm" style={{ color: '#C9A84C' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{contractor.province}, {contractor.region}</span>
        </div>

        {/* Specializations */}
        {contractor.specializations?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {contractor.specializations.slice(0, 3).map(spec => (
              <span
                key={spec}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(27,42,74,0.08)', color: '#1B2A4A' }}
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Rating + Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          {contractor.average_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {contractor.average_rating.toFixed(1)}
              </span>
              {contractor.total_reviews > 0 && (
                <span className="text-xs text-gray-400">({contractor.total_reviews})</span>
              )}
            </div>
          )}
          {contractor.is_verified && (
            <div className="flex items-center gap-1 text-blue-600 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          )}
          {contractor.pcab_accredited && (
            <div className="flex items-center gap-1 text-emerald-600 text-xs">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>PCAB</span>
            </div>
          )}
        </div>

        {/* Price range */}
        {contractor.price_range_min > 0 && (
          <p className="text-sm text-gray-500">
            ₱{contractor.price_range_min.toLocaleString()}–₱{contractor.price_range_max.toLocaleString()}/sqm
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/constructors/${contractor.id}`}
          className="mt-auto block w-full text-center py-2.5 rounded-lg text-sm font-medium border-2 transition-all hover:bg-[#1B2A4A] hover:text-white"
          style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
        >
          View Profile
        </Link>
      </div>
    </ScrollReveal>
  )
}

export default function ContractorPreview() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContractors = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('is_featured', true)
        .limit(3)

      if (!error && data) {
        setContractors(data as Contractor[])
      }
      setLoading(false)
    }
    fetchContractors()
  }, [])

  return (
    <section className="py-20" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1B2A4A' }}>
              Find Trusted Builders Near You
            </h2>
            <p className="text-gray-500 text-lg">
              Our verified contractor network covers all Philippine regions
            </p>
          </div>
        </ScrollReveal>

        {/* Decorative region strip */}
        <ScrollReveal delay={0.05}>
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {REGIONS.map(region => (
              <div
                key={region}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
                style={{ borderColor: 'rgba(27,42,74,0.2)', color: '#1B2A4A' }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#C9A84C' }}
                />
                {region}
              </div>
            ))}
            <span className="text-sm text-gray-400 ml-2">Coverage</span>
          </div>
        </ScrollReveal>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ContractorCardSkeleton key={i} />
            ))}
          </div>
        ) : contractors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contractors.map((contractor, i) => (
              <ContractorCard key={contractor.id} contractor={contractor} delay={i * 0.12} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Contractor profiles coming soon.</p>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-10">
            <Link
              href="/constructors"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#1B2A4A' }}
            >
              Browse All Contractors →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
