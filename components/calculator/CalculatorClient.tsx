'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Share2, Home, Building2, Sparkles } from 'lucide-react'
import { calculateCost } from '@/lib/utils/calculateCost'
import { formatPHP } from '@/lib/utils/formatCurrency'
import type { CostCalculatorData, CostBreakdownItem } from '@/types'

type Quality = 'economy' | 'standard' | 'premium'

const QUALITY_OPTIONS: Array<{ value: Quality; label: string }> = [
  { value: 'economy', label: 'Economy' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
]

/** Optional toggleable phases mapped to phase names in calculateCost. */
const TOGGLE_PHASES: Array<{ key: string; label: string; phases: string[] }> = [
  { key: 'foundation', label: 'Foundation', phases: ['Site Preparation', 'Foundation'] },
  { key: 'structural', label: 'Structural', phases: ['Structural', 'Walls & Masonry'] },
  { key: 'roofing', label: 'Roofing', phases: ['Roofing'] },
  { key: 'electrical', label: 'Electrical', phases: ['Electrical'] },
  { key: 'plumbing', label: 'Plumbing', phases: ['Plumbing'] },
  {
    key: 'finishing',
    label: 'Finishing',
    phases: ['Doors & Windows', 'Tiling & Flooring', 'Painting', 'Fixtures', 'Contingency'],
  },
]

const MIN_SQM = 30
const MAX_SQM = 500

interface CalculatorClientProps {
  costData: CostCalculatorData[]
}

function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const start = display
    const delta = value - start
    if (delta === 0) return
    const duration = 600
    const startTime = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(start + delta * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <>{formatPHP(display)}</>
}

export default function CalculatorClient({ costData }: CalculatorClientProps) {
  const regions = useMemo(
    () => Array.from(new Set(costData.map((d) => d.region))).sort(),
    [costData]
  )

  // Read initial URL params
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return null
    return new URLSearchParams(window.location.search)
  }, [])

  const [sqm, setSqm] = useState<number>(() => {
    const v = initial?.get('sqm')
    const n = v ? parseInt(v, 10) : NaN
    return !isNaN(n) ? Math.min(MAX_SQM, Math.max(MIN_SQM, n)) : 120
  })
  const [region, setRegion] = useState<string>(
    () => initial?.get('region') ?? regions[0] ?? ''
  )
  const [province, setProvince] = useState<string>(
    () => initial?.get('province') ?? ''
  )
  const [quality, setQuality] = useState<Quality>(() => {
    const q = initial?.get('quality')
    return q === 'economy' || q === 'standard' || q === 'premium' ? q : 'standard'
  })
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TOGGLE_PHASES.map((p) => [p.key, true]))
  )

  const provincesInRegion = useMemo(
    () =>
      Array.from(
        new Set(
          costData.filter((d) => d.region === region).map((d) => d.province)
        )
      ).sort(),
    [costData, region]
  )

  const handleRegionChange = (next: string) => {
    setRegion(next)
    // Drop the province if it doesn't belong to the newly selected region
    const valid = costData.some(
      (d) => d.region === next && d.province === province
    )
    if (!valid) setProvince('')
  }

  // Set of phase names that are currently excluded
  const excludedPhases = useMemo(() => {
    const set = new Set<string>()
    TOGGLE_PHASES.forEach((p) => {
      if (!enabled[p.key]) p.phases.forEach((name) => set.add(name))
    })
    return set
  }, [enabled])

  const estimate = useMemo(
    () => calculateCost(sqm, region, quality, costData),
    [sqm, region, quality, costData]
  )

  const breakdown: CostBreakdownItem[] = useMemo(
    () => estimate.breakdown.filter((b) => !excludedPhases.has(b.phase)),
    [estimate.breakdown, excludedPhases]
  )

  const totals = useMemo(() => {
    const min = breakdown.reduce((sum, b) => sum + b.min, 0)
    const avg = breakdown.reduce((sum, b) => sum + b.avg, 0)
    const max = breakdown.reduce((sum, b) => sum + b.max, 0)
    return { min, avg, max }
  }, [breakdown])

  const maxAvg = useMemo(
    () => Math.max(1, ...breakdown.map((b) => b.avg)),
    [breakdown]
  )

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('sqm', String(sqm))
    if (region) params.set('region', region)
    if (province) params.set('province', province)
    params.set('quality', quality)
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', url)
  }, [sqm, region, province, quality])

  const handleShare = async () => {
    const url = window.location.href
    const shareData = {
      title: 'My PlanaCasa Cost Estimate',
      text: `Estimated build cost: ${formatPHP(totals.min)} – ${formatPHP(totals.max)}`,
      url,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Estimate link copied to clipboard')
      }
    } catch {
      // user cancelled share — ignore
    }
  }

  const toggleClass = (active: boolean) =>
    `inline-flex flex-1 min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      active ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
    }`

  const selectClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-gray-400'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl bg-white p-6"
            style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
          >
            <h2 className="mb-5 font-heading text-xl font-semibold" style={{ color: '#1B2A4A' }}>
              Your Project
            </h2>

            {/* Floor area */}
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Floor Area
                </label>
                <span className="font-heading text-lg font-bold" style={{ color: '#1B2A4A' }}>
                  {sqm} sqm
                </span>
              </div>
              <input
                type="range"
                min={MIN_SQM}
                max={MAX_SQM}
                value={sqm}
                onChange={(e) => setSqm(parseInt(e.target.value, 10))}
                className="w-full accent-[#C9A84C]"
              />
              <input
                type="number"
                min={MIN_SQM}
                max={MAX_SQM}
                value={sqm}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10)
                  if (!isNaN(n)) setSqm(Math.min(MAX_SQM, Math.max(MIN_SQM, n)))
                }}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Region */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className={selectClass}
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Province
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={selectClass}
                disabled={provincesInRegion.length === 0}
              >
                <option value="">All provinces in region</option>
                {provincesInRegion.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Quality */}
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Quality
              </label>
              <div className="flex gap-1 rounded-lg border border-gray-200 p-0.5">
                {QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => setQuality(q.value)}
                    className={toggleClass(quality === q.value)}
                    style={
                      quality === q.value
                        ? { backgroundColor: '#1B2A4A' }
                        : undefined
                    }
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase checkboxes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Include Phases
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TOGGLE_PHASES.map((p) => (
                  <label
                    key={p.key}
                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={enabled[p.key]}
                      onChange={(e) =>
                        setEnabled((prev) => ({
                          ...prev,
                          [p.key]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[#C9A84C]"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3">
          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #111c31 100%)' }}
          >
            <p className="text-xs uppercase tracking-wider text-white/60">
              Estimated Build Cost
            </p>
            <p className="mt-1 font-heading text-3xl font-bold sm:text-4xl">
              <AnimatedTotal value={totals.min} /> –{' '}
              <AnimatedTotal value={totals.max} />
            </p>
            <p className="mt-1 text-sm text-white/60">
              {sqm} sqm · {estimate.region}
              {province ? ` · ${province}` : ''} ·{' '}
              {quality.charAt(0).toUpperCase() + quality.slice(1)} quality
            </p>
          </div>

          {/* Bar chart */}
          {breakdown.length > 0 && (
            <div
              className="mt-6 rounded-2xl bg-white p-6"
              style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
            >
              <h3 className="mb-4 font-heading text-lg font-semibold" style={{ color: '#1B2A4A' }}>
                Cost Breakdown
              </h3>
              <div className="space-y-3">
                {breakdown.map((b) => (
                  <div key={b.phase}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-700">{b.phase}</span>
                      <span className="font-medium" style={{ color: '#1B2A4A' }}>
                        {formatPHP(b.avg)}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: '#C9A84C' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(b.avg / maxAvg) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="py-2 pr-2 font-medium">Phase</th>
                      <th className="py-2 px-2 text-right font-medium">Min</th>
                      <th className="py-2 px-2 text-right font-medium">Avg</th>
                      <th className="py-2 pl-2 text-right font-medium">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((b) => (
                      <tr key={b.phase} className="border-b border-gray-50">
                        <td className="py-2 pr-2 text-gray-700">{b.phase}</td>
                        <td className="py-2 px-2 text-right text-gray-500">
                          {formatPHP(b.min)}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-700">
                          {formatPHP(b.avg)}
                        </td>
                        <td className="py-2 pl-2 text-right text-gray-500">
                          {formatPHP(b.max)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold" style={{ color: '#1B2A4A' }}>
                      <td className="py-2 pr-2">Total</td>
                      <td className="py-2 px-2 text-right">{formatPHP(totals.min)}</td>
                      <td className="py-2 px-2 text-right">{formatPHP(totals.avg)}</td>
                      <td className="py-2 pl-2 text-right">{formatPHP(totals.max)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/gallery?cost_max=${totals.max}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1B2A4A' }}
            >
              <Home className="h-4 w-4" /> Browse Designs Within Your Budget
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
            >
              <Share2 className="h-4 w-4" /> Share Estimate
            </button>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-gray-400">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            Estimates are for reference only and based on regional averages. Actual
            costs vary by design complexity, finishes, site conditions, and your
            chosen contractor. Always get a detailed quote before building.
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <Building2 className="h-3.5 w-3.5" />
            Consult a licensed engineer or architect for a final budget.
          </p>
        </div>
      </div>
    </div>
  )
}
