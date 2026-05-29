'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'

interface ContractorMatchProps {
  designTitle: string
}

const PROVINCES = [
  'Metro Manila',
  'Cebu',
  'Davao del Sur',
  'Pampanga',
  'Laguna',
  'Batangas',
  'Iloilo',
  'Negros Occidental',
  'Misamis Oriental',
  'Bulacan',
  'Cavite',
  'Rizal',
  'Quezon',
  'Nueva Ecija',
  'Tarlac',
  'Zambales',
  'Bohol',
  'Leyte',
  'Zamboanga del Sur',
  'Bukidnon',
]

export default function ContractorMatch({ designTitle }: ContractorMatchProps) {
  const [province, setProvince] = useState('')
  const router = useRouter()

  const handleFind = () => {
    if (!province) return
    router.push(`/constructors?province=${encodeURIComponent(province)}`)
  }

  return (
    <section className="py-16" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: 'rgba(201,168,76,0.2)' }}>
          <MapPin className="w-6 h-6" style={{ color: '#C9A84C' }} />
        </div>

        <h2 className="font-heading text-3xl font-semibold text-white mb-2">
          Ready to Build? Find Contractors Near You
        </h2>
        <p className="text-white/70 mb-8">
          Connect with verified, licensed builders in your province.
        </p>

        <div className="flex gap-3 max-w-md mx-auto">
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': '#C9A84C' } as React.CSSProperties}
          >
            <option value="" className="bg-gray-900">Select your province</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p} className="bg-gray-900">
                {p}
              </option>
            ))}
          </select>
          <button
            onClick={handleFind}
            disabled={!province}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
          >
            Find
          </button>
        </div>

        <p className="mt-6 text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
          PlanaCasa connects you with independent contractors. We do not employ or guarantee any contractor&apos;s work.
        </p>
      </div>
    </section>
  )
}
