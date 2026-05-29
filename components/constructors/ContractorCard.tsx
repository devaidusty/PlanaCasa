'use client'

import Link from 'next/link'
import { MapPin, Star, BadgeCheck, Award, Shield, Briefcase } from 'lucide-react'
import { formatPHP } from '@/lib/utils/formatCurrency'
import { specLabel } from '@/lib/constants/contractors'
import ContactButton from './ContactButton'
import type { Contractor } from '@/types'

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function ContractorCard({
  contractor,
}: {
  contractor: Contractor
}) {
  return (
    <div
      className="group flex h-full flex-col gap-4 rounded-2xl bg-white p-6 transition-all hover:-translate-y-1"
      style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: '#1B2A4A', color: '#C9A84C' }}
        >
          {getInitials(contractor.business_name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-heading text-base font-semibold leading-tight"
              style={{ color: '#1B2A4A' }}
            >
              {contractor.business_name}
            </h3>
          </div>
          <p className="truncate text-sm text-gray-500">{contractor.owner_name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {contractor.is_featured && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: 'rgba(201,168,76,0.18)', color: '#9a7d2e' }}
              >
                <Award className="h-3 w-3" /> Featured
              </span>
            )}
            {contractor.is_verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm" style={{ color: '#C9A84C' }}>
        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-gray-700">
          {contractor.city}, {contractor.province}
        </span>
        {contractor.region && (
          <span className="text-xs text-gray-400">· {contractor.region}</span>
        )}
      </div>

      {/* Specializations */}
      {contractor.specializations?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {contractor.specializations.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="rounded-full px-2.5 py-1 text-xs"
              style={{ backgroundColor: 'rgba(27,42,74,0.08)', color: '#1B2A4A' }}
            >
              {specLabel(spec)}
            </span>
          ))}
        </div>
      )}

      {/* License badges */}
      {(contractor.pcab_accredited || contractor.prc_licensed) && (
        <div className="flex flex-wrap gap-2">
          {contractor.pcab_accredited && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
              <Shield className="h-3 w-3" /> PCAB Accredited
            </span>
          )}
          {contractor.prc_licensed && (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
              <BadgeCheck className="h-3 w-3" /> PRC Licensed
            </span>
          )}
        </div>
      )}

      {/* Rating + experience */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
        {contractor.total_reviews > 0 ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700">
              {contractor.average_rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({contractor.total_reviews} review
              {contractor.total_reviews !== 1 ? 's' : ''})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Star className="h-4 w-4 text-gray-300" />
            No reviews yet
          </div>
        )}
        {contractor.years_experience > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Briefcase className="h-3.5 w-3.5" />
            {contractor.years_experience} yrs experience
          </div>
        )}
      </div>

      {/* Price range */}
      {contractor.price_range_min > 0 && (
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {formatPHP(contractor.price_range_min)} –{' '}
            {formatPHP(contractor.price_range_max)}
          </span>{' '}
          /sqm
        </p>
      )}

      {/* CTAs */}
      <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
        <Link
          href={`/constructors/${contractor.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all hover:bg-[#1B2A4A] hover:text-white"
          style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
        >
          View Profile
        </Link>
        <ContactButton contractor={contractor} label="Contact" />
      </div>
    </div>
  )
}
