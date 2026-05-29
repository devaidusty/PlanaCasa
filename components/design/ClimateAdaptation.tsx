import { Leaf, Wind, Droplets, Sun, Shield } from 'lucide-react'
import type { DesignStyle } from '@/types'

interface ClimateAdaptationProps {
  notes: string
  style: DesignStyle
}

const STYLE_NOTES: Partial<Record<DesignStyle, string[]>> = {
  tropical_modern: ['Designed for hot-humid lowland climate zones.'],
  modern_filipino: ['Designed for hot-humid lowland climate zones.'],
  scandinavian: ['Adapted for cooler highland climates (Baguio, Tagaytay, Bukidnon).'],
  bungalow: ['Adapted for cooler highland climates (Baguio, Tagaytay, Bukidnon).'],
  ofw_dream: ['Extra typhoon-strap specification included for Signal No. 3+ resistance.'],
}

const CLIMATE_CARDS = [
  {
    icon: Shield,
    title: 'Typhoon Resistance',
    description:
      'Structural design meets NSCP 2015 wind load requirements. Reinforced connections and roof anchorage rated for Signal No. 3 conditions.',
    color: '#1B2A4A',
  },
  {
    icon: Wind,
    title: 'Natural Ventilation',
    description:
      'Cross-ventilation pathways built into the floor plan. Strategic window and louver placement maximizes airflow and reduces reliance on air conditioning.',
    color: '#0d9488',
  },
  {
    icon: Droplets,
    title: 'Flood Mitigation',
    description:
      'Raised floor datum and elevated entry points designed for flood-prone zones. Proper site drainage incorporated into foundation design.',
    color: '#2563eb',
  },
  {
    icon: Sun,
    title: 'Heat Management',
    description:
      'Extended roof overhangs and strategic shading reduce solar heat gain. East-west orientation minimizes afternoon sun exposure.',
    color: '#d97706',
  },
]

export default function ClimateAdaptation({ notes, style }: ClimateAdaptationProps) {
  const styleNotes = STYLE_NOTES[style] ?? []

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex items-center gap-2">
        <Leaf className="w-5 h-5 text-emerald-500" />
        <h2 className="font-heading text-2xl font-semibold" style={{ color: '#1B2A4A' }}>
          Climate Adaptation Notes
        </h2>
      </div>

      {/* General compliance note */}
      <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200">
        <p className="text-sm text-emerald-800">
          All PlanaCasa designs comply with NSCP 2015 typhoon load requirements for their intended zone.
        </p>
        {styleNotes.map((note, i) => (
          <p key={i} className="text-sm text-emerald-800 mt-1">
            {note}
          </p>
        ))}
      </div>

      {/* Design-specific notes from DB */}
      {notes && (
        <div className="rounded-xl p-4 bg-gray-50 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-1">Design-Specific Notes</p>
          <p className="text-sm text-gray-600 leading-relaxed">{notes}</p>
        </div>
      )}

      {/* 2×2 climate cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CLIMATE_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="rounded-xl p-5 border border-gray-100 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <h3 className="font-semibold text-sm" style={{ color: '#1B2A4A' }}>
                  {card.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
