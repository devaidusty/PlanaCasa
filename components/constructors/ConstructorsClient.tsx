'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, List, Map as MapIcon, SlidersHorizontal } from 'lucide-react'
import { PH_PROVINCES } from '@/lib/constants/locations'
import {
  SPECIALIZATIONS,
  specLabel,
  CONTRACTOR_SORT_OPTIONS,
} from '@/lib/constants/contractors'
import ContractorCard from './ContractorCard'
import ContractorMap from './ContractorMap'
import type { Contractor } from '@/types'

export interface ConstructorsFilters {
  province?: string
  search?: string
  verified?: boolean
  specialization?: string
  sort?: string
}

interface ConstructorsClientProps {
  initialContractors: Contractor[]
  initialFilters: ConstructorsFilters
}

export default function ConstructorsClient({
  initialContractors,
  initialFilters,
}: ConstructorsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialFilters.search ?? '')
  const [view, setView] = useState<'list' | 'map'>('list')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstRender = useRef(true)

  const province = initialFilters.province ?? ''
  const verified = initialFilters.verified ?? false
  const specialization = initialFilters.specialization ?? ''
  const sort = initialFilters.sort ?? 'featured'

  const updateParam = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      })
      const qs = params.toString()
      router.push(qs ? `/constructors?${qs}` : '/constructors')
    },
    [router, searchParams]
  )

  // Debounced search → URL sync
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam({ search: search.trim() || null })
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const hasFilters = useMemo(
    () => Boolean(province || search || verified || specialization || sort !== 'featured'),
    [province, search, verified, specialization, sort]
  )

  const resetFilters = () => {
    setSearch('')
    router.push('/constructors')
  }

  const selectClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-gray-400'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Filter bar */}
      <div
        className="mb-6 rounded-2xl bg-white p-4 sm:p-5"
        style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business name…"
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Province */}
          <select
            value={province}
            onChange={(e) => updateParam({ province: e.target.value || null })}
            className={selectClass}
          >
            <option value="">All provinces</option>
            {PH_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Specialization */}
          <select
            value={specialization}
            onChange={(e) =>
              updateParam({ specialization: e.target.value || null })
            }
            className={selectClass}
          >
            <option value="">All specializations</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {specLabel(s)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateParam({ sort: e.target.value })}
            className={selectClass}
          >
            {CONTRACTOR_SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Second row: verified toggle + view toggle + reset */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateParam({ verified: verified ? null : 'true' })}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                verified
                  ? 'border-transparent text-white'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              style={verified ? { backgroundColor: '#1B2A4A' } : undefined}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Verified only
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* View toggle segmented control */}
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                view === 'list' ? 'text-white' : 'text-gray-600'
              }`}
              style={view === 'list' ? { backgroundColor: '#1B2A4A' } : undefined}
            >
              <List className="h-4 w-4" /> List
            </button>
            <button
              type="button"
              onClick={() => setView('map')}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                view === 'map' ? 'text-white' : 'text-gray-600'
              }`}
              style={view === 'map' ? { backgroundColor: '#1B2A4A' } : undefined}
            >
              <MapIcon className="h-4 w-4" /> Map
            </button>
          </div>
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && initialContractors.length > 0 && (
        <div className="mb-6 space-y-3">
          <ContractorMap contractors={initialContractors} />
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#9CA3AF' }} />
              Free
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#2563EB' }} />
              Verified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#C9A84C' }} />
              Featured
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {initialContractors.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center" style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}>
          <p className="mb-2 font-heading text-lg" style={{ color: '#1B2A4A' }}>
            No contractors found
          </p>
          <p className="mb-4 text-sm text-gray-500">
            Try adjusting your filters or browse all provinces.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-11 items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: '#1B2A4A' }}
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {initialContractors.map((contractor) => (
            <ContractorCard key={contractor.id} contractor={contractor} />
          ))}
        </div>
      )}
    </div>
  )
}
