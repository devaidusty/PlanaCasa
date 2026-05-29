'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import FilterSidebar from '@/components/gallery/FilterSidebar'
import type { GalleryFilters } from '@/types'

interface FilterMobileProps {
  filters: GalleryFilters
  onFilterChange: (key: string, value: unknown) => void
  onReset: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  activeCount: number
}

export default function FilterMobile({
  filters,
  onFilterChange,
  onReset,
  open,
  onOpenChange,
  activeCount,
}: FilterMobileProps) {
  const handleReset = () => {
    onReset()
  }

  const handleFilterChange = (key: string, value: unknown) => {
    onFilterChange(key, value)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => onOpenChange(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-white text-sm font-medium md:hidden"
        style={{ backgroundColor: '#1B2A4A' }}
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold" style={{ backgroundColor: '#C9A84C' }}>
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom sheet */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-0">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-gray-100">
            <SheetTitle className="font-heading text-lg" style={{ color: '#1B2A4A' }}>
              Filter Designs
            </SheetTitle>
          </SheetHeader>

          <div className="px-5 py-4">
            {/* Inline filter sections — reuse sidebar but without the sticky wrapper */}
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Apply button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 pb-safe">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1B2A4A' }}
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors py-1"
            >
              Reset all
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
