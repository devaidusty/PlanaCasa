'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { GalleryFilters, DesignStyle } from '@/types'

interface FilterSidebarProps {
  filters: GalleryFilters
  onFilterChange: (key: string, value: unknown) => void
  onReset: () => void
}

const STYLES: Array<{ value: DesignStyle; label: string }> = [
  { value: 'modern_filipino', label: 'Modern Filipino' },
  { value: 'tropical_modern', label: 'Tropical Modern' },
  { value: 'european_modern', label: 'European Modern' },
  { value: 'uk_contemporary', label: 'UK Contemporary' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'ofw_dream', label: 'OFW Dream' },
  { value: 'small_lot', label: 'Small Lot' },
  { value: 'two_storey_rental', label: '2-Storey + Rental' },
  { value: 'bungalow', label: 'Bungalow' },
]

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2 text-sm font-semibold text-left"
      style={{ color: '#1B2A4A' }}
    >
      {title}
      {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  )
}

function countActiveFilters(filters: GalleryFilters): number {
  let count = 0
  if (filters.search) count++
  if (filters.style && filters.style.length > 0) count++
  if (filters.bedrooms && filters.bedrooms.length > 0) count++
  if (filters.bathrooms && filters.bathrooms.length > 0) count++
  if (filters.floors && filters.floors.length > 0) count++
  if (filters.garage !== undefined) count++
  if (filters.cost_min) count++
  if (filters.cost_max) count++
  return count
}

export default function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    search: true,
    style: true,
    bedrooms: true,
    bathrooms: false,
    floors: false,
    garage: false,
    cost: false,
    sort: true,
  })

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

  const activeCount = countActiveFilters(filters)

  const handleStyleToggle = (style: DesignStyle, checked: boolean) => {
    const current = filters.style ?? []
    if (checked) {
      onFilterChange('style', [...current, style])
    } else {
      onFilterChange('style', current.filter((s) => s !== style))
    }
  }

  return (
    <aside className="w-72 shrink-0 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-semibold" style={{ color: '#1B2A4A' }}>
              Filters
            </span>
            {activeCount > 0 && (
              <span className="text-xs text-white font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#C9A84C' }}>
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        <div className="space-y-4 divide-y divide-gray-100">
          {/* Sort By */}
          <div className="pt-1">
            <SectionHeader title="Sort By" open={openSections.sort} onToggle={() => toggle('sort')} />
            {openSections.sort && (
              <div className="mt-2">
                <Select
                  value={filters.sort ?? 'featured'}
                  onValueChange={(v) => onFilterChange('sort', v)}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="area">Floor Area</SelectItem>
                    <SelectItem value="bedrooms">Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="pt-3">
            <SectionHeader title="Search" open={openSections.search} onToggle={() => toggle('search')} />
            {openSections.search && (
              <Input
                placeholder="Search designs..."
                value={filters.search ?? ''}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="mt-2 text-sm"
              />
            )}
          </div>

          {/* Design Style */}
          <div className="pt-3">
            <SectionHeader title="Design Style" open={openSections.style} onToggle={() => toggle('style')} />
            {openSections.style && (
              <div className="mt-2 space-y-2">
                {STYLES.map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox
                      id={`style-${value}`}
                      checked={(filters.style ?? []).includes(value)}
                      onCheckedChange={(checked) => handleStyleToggle(value, !!checked)}
                    />
                    <Label htmlFor={`style-${value}`} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bedrooms */}
          <div className="pt-3">
            <SectionHeader title="Bedrooms" open={openSections.bedrooms} onToggle={() => toggle('bedrooms')} />
            {openSections.bedrooms && (
              <RadioGroup
                value={filters.bedrooms?.[0]?.toString() ?? 'any'}
                onValueChange={(v) => onFilterChange('bedrooms', v === 'any' ? undefined : [Number(v)])}
                className="mt-2 space-y-2"
              >
                {['any', '1', '2', '3', '4', '5'].map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem value={val} id={`bed-${val}`} />
                    <Label htmlFor={`bed-${val}`} className="text-sm cursor-pointer">
                      {val === 'any' ? 'Any' : val === '5' ? '5+' : val}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Bathrooms */}
          <div className="pt-3">
            <SectionHeader title="Bathrooms" open={openSections.bathrooms} onToggle={() => toggle('bathrooms')} />
            {openSections.bathrooms && (
              <RadioGroup
                value={filters.bathrooms?.[0]?.toString() ?? 'any'}
                onValueChange={(v) => onFilterChange('bathrooms', v === 'any' ? undefined : [Number(v)])}
                className="mt-2 space-y-2"
              >
                {['any', '1', '2', '3'].map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem value={val} id={`bath-${val}`} />
                    <Label htmlFor={`bath-${val}`} className="text-sm cursor-pointer">
                      {val === 'any' ? 'Any' : val === '3' ? '3+' : val}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Floors */}
          <div className="pt-3">
            <SectionHeader title="Floors" open={openSections.floors} onToggle={() => toggle('floors')} />
            {openSections.floors && (
              <RadioGroup
                value={filters.floors?.[0]?.toString() ?? 'any'}
                onValueChange={(v) => onFilterChange('floors', v === 'any' ? undefined : [Number(v)])}
                className="mt-2 space-y-2"
              >
                {['any', '1', '2', '3'].map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem value={val} id={`floor-${val}`} />
                    <Label htmlFor={`floor-${val}`} className="text-sm cursor-pointer">
                      {val === 'any' ? 'Any' : val}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Garage */}
          <div className="pt-3">
            <SectionHeader title="With Garage" open={openSections.garage} onToggle={() => toggle('garage')} />
            {openSections.garage && (
              <div className="flex items-center gap-3 mt-2">
                <Switch
                  checked={filters.garage === true}
                  onCheckedChange={(v) => onFilterChange('garage', v ? true : undefined)}
                  id="garage-switch"
                />
                <Label htmlFor="garage-switch" className="text-sm cursor-pointer">
                  {filters.garage ? 'With garage only' : 'Any'}
                </Label>
              </div>
            )}
          </div>

          {/* Build Cost */}
          <div className="pt-3">
            <SectionHeader title="Build Cost" open={openSections.cost} onToggle={() => toggle('cost')} />
            {openSections.cost && (
              <div className="mt-2 space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₱</span>
                  <Input
                    type="number"
                    placeholder="Min cost"
                    value={filters.cost_min ?? ''}
                    onChange={(e) => onFilterChange('cost_min', e.target.value ? Number(e.target.value) : undefined)}
                    className="pl-7 text-sm"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₱</span>
                  <Input
                    type="number"
                    placeholder="Max cost"
                    value={filters.cost_max ?? ''}
                    onChange={(e) => onFilterChange('cost_max', e.target.value ? Number(e.target.value) : undefined)}
                    className="pl-7 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
