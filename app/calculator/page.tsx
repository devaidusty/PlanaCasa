import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CalculatorClient from '@/components/calculator/CalculatorClient'
import type { CostCalculatorData } from '@/types'

export const metadata: Metadata = {
  title: 'Construction Cost Calculator | PlanaCasa Philippines',
  description:
    'Estimate your home construction cost in the Philippines by floor area, region, and build quality. Get an instant phase-by-phase breakdown.',
}

export default async function CalculatorPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cost_calculator_data')
    .select('*')
    .order('region', { ascending: true })

  const costData = (data ?? []) as CostCalculatorData[]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Header band */}
      <div className="py-14" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-3 font-heading text-4xl font-bold text-white md:text-5xl">
            Construction Cost Calculator
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Get an instant, phase-by-phase estimate for your home build based on
            floor area, region, and quality.
          </p>
        </div>
      </div>

      {costData.length === 0 ? (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <p className="font-heading text-lg" style={{ color: '#1B2A4A' }}>
            Cost data is currently unavailable
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please check back soon.
          </p>
        </div>
      ) : (
        <CalculatorClient costData={costData} />
      )}
    </div>
  )
}
