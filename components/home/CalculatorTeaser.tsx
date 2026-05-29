'use client'

import { useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/shared/ScrollReveal'
import { formatRange } from '@/lib/utils/formatCurrency'
import { motion, AnimatePresence } from 'framer-motion'

const REGION_RATES: Record<string, { low: number; high: number }> = {
  NCR: { low: 18000, high: 38000 },
  'Region III': { low: 14000, high: 28000 },
  'Region IV-A': { low: 14500, high: 30000 },
  'Region VII': { low: 15000, high: 32000 },
  'Region XI': { low: 13000, high: 26000 },
  'Region VI': { low: 12500, high: 25000 },
  'Region X': { low: 12000, high: 24000 },
}

export default function CalculatorTeaser() {
  const [floorArea, setFloorArea] = useState('')
  const [region, setRegion] = useState('')
  const [result, setResult] = useState<{ min: number; max: number; region: string } | null>(null)

  const handleCalculate = () => {
    const area = parseFloat(floorArea)
    if (!area || !region || area <= 0) return

    const rates = REGION_RATES[region]
    setResult({
      min: area * rates.low,
      max: area * rates.high,
      region,
    })
  }

  return (
    <section className="py-20" style={{ backgroundColor: '#F8F5F0' }}>
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1B2A4A' }}>
              How Much Will Your Build Cost?
            </h2>
            <p className="text-gray-500 text-lg">
              Get an instant estimate based on your province and floor area
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div
            className="bg-white rounded-xl p-8 max-w-2xl mx-auto"
            style={{ boxShadow: '0 2px 20px rgba(27,42,74,0.08)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Floor Area (sqm)
                </label>
                <input
                  type="number"
                  value={floorArea}
                  onChange={e => setFloorArea(e.target.value)}
                  placeholder="e.g. 150"
                  min="20"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Region
                </label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white"
                >
                  <option value="">Select region</option>
                  {Object.keys(REGION_RATES).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!floorArea || !region}
              className="w-full py-3.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
            >
              Calculate Estimate
            </button>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 p-5 rounded-lg border"
                  style={{ backgroundColor: 'rgba(27,42,74,0.04)', borderColor: 'rgba(27,42,74,0.1)' }}
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Build Cost</p>
                  <p className="font-heading text-2xl font-bold mb-1" style={{ color: '#1B2A4A' }}>
                    {formatRange(result.min, result.max)}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Based on standard construction quality in {result.region}
                  </p>
                  <Link
                    href="/calculator"
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#C9A84C' }}
                  >
                    Get a detailed breakdown →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Estimates are for reference only. Actual costs vary by design complexity and contractor.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-8">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border-2 transition-all hover:bg-[#1B2A4A] hover:text-white"
              style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
            >
              Use Full Calculator →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
