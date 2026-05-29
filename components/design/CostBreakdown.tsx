import Link from 'next/link'
import { formatPHPCompact, formatPHP } from '@/lib/utils/formatCurrency'
import type { Design } from '@/types'

interface CostBreakdownProps {
  design: Design
}

// NCR rates (hardcoded fallback for server component display without DB)
const NCR_RATES = {
  cost_per_sqm_low: 18000,
  cost_per_sqm_mid: 25000,
  cost_per_sqm_high: 35000,
}

const PHASES = [
  { phase: 'Site Preparation', percentage: 3 },
  { phase: 'Foundation', percentage: 15 },
  { phase: 'Structural', percentage: 20 },
  { phase: 'Roofing', percentage: 10 },
  { phase: 'Walls & Masonry', percentage: 12 },
  { phase: 'Electrical', percentage: 8 },
  { phase: 'Plumbing', percentage: 8 },
  { phase: 'Doors & Windows', percentage: 7 },
  { phase: 'Tiling & Flooring', percentage: 6 },
  { phase: 'Painting', percentage: 5 },
  { phase: 'Fixtures', percentage: 4 },
  { phase: 'Contingency', percentage: 2 },
]

const PHASE_COLORS = [
  '#1B2A4A', '#C9A84C', '#1B2A4A', '#C9A84C',
  '#1B2A4A', '#C9A84C', '#1B2A4A', '#C9A84C',
  '#1B2A4A', '#C9A84C', '#1B2A4A', '#C9A84C',
]

export default function CostBreakdown({ design }: CostBreakdownProps) {
  const sqm = design.floor_area_sqm

  // Standard quality = 1.35x multiplier
  const multiplier = 1.35
  const totalLow = NCR_RATES.cost_per_sqm_low * multiplier * sqm
  const totalMid = NCR_RATES.cost_per_sqm_mid * multiplier * sqm
  const totalHigh = NCR_RATES.cost_per_sqm_high * multiplier * sqm

  const breakdown = PHASES.map(({ phase, percentage }, i) => {
    const factor = percentage / 100
    return {
      phase,
      percentage,
      min: Math.round(totalLow * factor),
      avg: Math.round(totalMid * factor),
      max: Math.round(totalHigh * factor),
      color: PHASE_COLORS[i],
    }
  })

  const subtotalMin = breakdown.slice(0, -1).reduce((s, r) => s + r.min, 0)
  const subtotalMax = breakdown.slice(0, -1).reduce((s, r) => s + r.max, 0)
  const subtotalAvg = breakdown.slice(0, -1).reduce((s, r) => s + r.avg, 0)

  const contingency = breakdown[breakdown.length - 1]
  const grandMin = Math.round(totalLow)
  const grandAvg = Math.round(totalMid)
  const grandMax = Math.round(totalHigh)

  return (
    <div className="space-y-6">
      {/* Note */}
      <div className="rounded-xl p-4 bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          Estimated costs for <strong>standard quality</strong> build in NCR.
          Rates: ₱{(NCR_RATES.cost_per_sqm_low * multiplier / 1000).toFixed(0)}K–₱{(NCR_RATES.cost_per_sqm_high * multiplier / 1000).toFixed(0)}K per sqm.
          Use our calculator for your region.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div>Phase</div>
          <div className="text-right">Min</div>
          <div className="text-right">Avg</div>
          <div className="text-right">Max</div>
        </div>

        {/* Phase rows */}
        {breakdown.slice(0, -1).map((row, i) => (
          <div
            key={row.phase}
            className={`grid grid-cols-4 gap-2 px-4 py-3 text-sm border-t border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
          >
            <div className="font-medium text-gray-700">{row.phase}</div>
            <div className="text-right text-gray-500">{formatPHPCompact(row.min)}</div>
            <div className="text-right text-gray-500">{formatPHPCompact(row.avg)}</div>
            <div className="text-right text-gray-500">{formatPHPCompact(row.max)}</div>
          </div>
        ))}

        {/* Subtotal */}
        <div className="grid grid-cols-4 gap-2 px-4 py-3 border-t-2 border-gray-200" style={{ backgroundColor: '#1B2A4A' }}>
          <div className="font-semibold text-white text-sm">Subtotal</div>
          <div className="text-right text-white/80 text-sm">{formatPHPCompact(subtotalMin)}</div>
          <div className="text-right text-white/80 text-sm">{formatPHPCompact(subtotalAvg)}</div>
          <div className="text-right text-white/80 text-sm">{formatPHPCompact(subtotalMax)}</div>
        </div>

        {/* Contingency */}
        <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-white border-t border-gray-100 text-sm">
          <div className="font-medium text-gray-700">Contingency (2%)</div>
          <div className="text-right text-gray-500">{formatPHPCompact(contingency.min)}</div>
          <div className="text-right text-gray-500">{formatPHPCompact(contingency.avg)}</div>
          <div className="text-right text-gray-500">{formatPHPCompact(contingency.max)}</div>
        </div>

        {/* Total */}
        <div className="grid grid-cols-4 gap-2 px-4 py-3.5 border-t-2 border-gray-200" style={{ backgroundColor: '#C9A84C' }}>
          <div className="font-bold text-white">Total</div>
          <div className="text-right text-white font-bold">{formatPHPCompact(grandMin)}</div>
          <div className="text-right text-white font-bold">{formatPHPCompact(grandAvg)}</div>
          <div className="text-right text-white font-bold">{formatPHPCompact(grandMax)}</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cost Distribution</p>
        {breakdown.slice(0, -1).map((row, i) => (
          <div key={row.phase} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-36 shrink-0 truncate">{row.phase}</span>
            <div className="flex-1 h-4 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${row.percentage * (100 / 20)}%`, backgroundColor: row.color }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10 text-right">{row.percentage}%</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/calculator"
        className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ color: '#C9A84C' }}
      >
        Get Your Region&apos;s Estimate →
      </Link>

      <p className="text-xs text-gray-400 leading-relaxed">
        Construction costs vary significantly by region, design complexity, and material choice.
        These figures are for planning purposes only.
      </p>
    </div>
  )
}
