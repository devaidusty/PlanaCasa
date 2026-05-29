import type { CostCalculatorData, CostEstimate, CostBreakdownItem } from '@/types'

type Quality = 'economy' | 'standard' | 'premium'

const QUALITY_MULTIPLIER: Record<Quality, number> = {
  economy:  1.00,
  standard: 1.35,
  premium:  1.75,
}

const PHASES: Array<{ phase: string; percentage: number }> = [
  { phase: 'Site Preparation',   percentage: 3  },
  { phase: 'Foundation',         percentage: 15 },
  { phase: 'Structural',         percentage: 20 },
  { phase: 'Roofing',            percentage: 10 },
  { phase: 'Walls & Masonry',    percentage: 12 },
  { phase: 'Electrical',         percentage: 8  },
  { phase: 'Plumbing',           percentage: 8  },
  { phase: 'Doors & Windows',    percentage: 7  },
  { phase: 'Tiling & Flooring',  percentage: 6  },
  { phase: 'Painting',           percentage: 5  },
  { phase: 'Fixtures',           percentage: 4  },
  { phase: 'Contingency',        percentage: 2  },
]

/**
 * Calculate a construction cost estimate for a given floor area, region and quality.
 *
 * @param sqm            - Floor area in square metres
 * @param region         - Region name (matched against CostCalculatorData.region)
 * @param quality        - 'economy' | 'standard' | 'premium'
 * @param data           - Array of cost data rows from the DB
 */
export function calculateCost(
  sqm: number,
  region: string,
  quality: Quality,
  data: CostCalculatorData[]
): CostEstimate {
  // Find matching region data — fall back to NCR if not found
  const row =
    data.find((d) => d.region.toLowerCase() === region.toLowerCase()) ??
    data.find((d) => d.region === 'NCR') ??
    data[0]

  const multiplier = QUALITY_MULTIPLIER[quality]

  const baseLow  = row.cost_per_sqm_low  * multiplier
  const baseMid  = row.cost_per_sqm_mid  * multiplier
  const baseHigh = row.cost_per_sqm_high * multiplier

  const totalLow  = baseLow  * sqm
  const totalMid  = baseMid  * sqm
  const totalHigh = baseHigh * sqm

  const breakdown: CostBreakdownItem[] = PHASES.map(({ phase, percentage }) => {
    const factor = percentage / 100
    return {
      phase,
      min:        Math.round(totalLow  * factor),
      avg:        Math.round(totalMid  * factor),
      max:        Math.round(totalHigh * factor),
      percentage,
    }
  })

  return {
    region:        row.region,
    province:      row.province,
    floor_area_sqm: sqm,
    quality,
    breakdown,
    total_min: Math.round(totalLow),
    total_max: Math.round(totalHigh),
  }
}
