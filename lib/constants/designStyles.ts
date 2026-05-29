import type { DesignStyle } from '@/types'

export const DESIGN_STYLE_LABELS: Record<DesignStyle, string> = {
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

export const DESIGN_STYLES: DesignStyle[] = [
  'modern_filipino',
  'tropical_modern',
  'european_modern',
  'uk_contemporary',
  'scandinavian',
  'ofw_dream',
  'small_lot',
  'two_storey_rental',
  'bungalow',
]

export function designStyleLabel(style: string): string {
  return DESIGN_STYLE_LABELS[style as DesignStyle] ?? style
}

/** Default packages cloned from supabase/seed.sql, used when creating designs. */
export const DEFAULT_PACKAGES: Array<{
  package_name: 'Basic' | 'Standard' | 'Premium'
  price: number
  includes: string[]
}> = [
  {
    package_name: 'Basic',
    price: 999,
    includes: [
      'Architectural floor plans (PDF)',
      'Front & rear elevations',
      'Site development plan',
      'Basic material specifications',
      '1 revision request',
    ],
  },
  {
    package_name: 'Standard',
    price: 1999,
    includes: [
      'Everything in Basic',
      'Structural drawings',
      'Electrical layout plan',
      'Plumbing layout plan',
      'Bill of Materials (BoM)',
      '3D perspective renders (4 views)',
      '3 revision requests',
    ],
  },
  {
    package_name: 'Premium',
    price: 3499,
    includes: [
      'Everything in Standard',
      'Full working drawings (CAD files)',
      'Detailed BoM with cost estimates',
      'Interior design mood board',
      'As-built drawing template',
      'Construction schedule (Gantt)',
      'Permit-ready document set',
      'Unlimited revisions (30 days)',
      'Dedicated architect consultation (1 hr)',
    ],
  },
]
