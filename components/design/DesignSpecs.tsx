import { Bed, Bath, Layers, Car, MapPin, Ruler } from 'lucide-react'
import { formatPHP, formatRange } from '@/lib/utils/formatCurrency'
import type { Design, DesignStyle } from '@/types'

interface DesignSpecsProps {
  design: Design
}

const STYLE_LABELS: Record<DesignStyle, string> = {
  modern_filipino: 'Modern Filipino',
  tropical_modern: 'Tropical Modern',
  european_modern: 'European Modern',
  uk_contemporary: 'UK Contemporary',
  scandinavian: 'Scandinavian',
  ofw_dream: 'OFW Dream',
  small_lot: 'Small Lot',
  two_storey_rental: '2-Storey + Rental',
  bungalow: 'Bungalow',
}

const rows = [
  {
    label: 'Floor Area',
    icon: Ruler,
    getValue: (d: Design) => `${d.floor_area_sqm} sqm`,
  },
  {
    label: 'Lot Area',
    icon: MapPin,
    getValue: (d: Design) => d.lot_area_sqm ? `${d.lot_area_sqm} sqm` : 'Varies',
  },
  {
    label: 'Bedrooms',
    icon: Bed,
    getValue: (d: Design) => d.bedrooms.toString(),
  },
  {
    label: 'Bathrooms',
    icon: Bath,
    getValue: (d: Design) => d.bathrooms.toString(),
  },
  {
    label: 'Floors',
    icon: Layers,
    getValue: (d: Design) => d.floors.toString(),
  },
  {
    label: 'Garage',
    icon: Car,
    getValue: (d: Design) => (d.garage ? 'Included' : 'Not included'),
  },
  {
    label: 'Design Style',
    icon: null,
    getValue: (d: Design) => STYLE_LABELS[d.style],
  },
  {
    label: 'Estimated Build Cost',
    icon: null,
    getValue: (d: Design) => formatRange(d.estimated_build_cost_min, d.estimated_build_cost_max),
  },
  {
    label: 'Plan Price From',
    icon: null,
    getValue: (d: Design) => formatPHP(d.plan_price),
  },
]

export default function DesignSpecs({ design }: DesignSpecsProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      {rows.map((row, i) => {
        const Icon = row.icon
        return (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {Icon && <Icon className="w-4 h-4" />}
              {row.label}
            </div>
            <span className="text-sm font-medium" style={{ color: '#1B2A4A' }}>
              {row.getValue(design)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
