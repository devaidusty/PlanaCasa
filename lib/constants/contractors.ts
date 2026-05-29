export const SPECIALIZATIONS = [
  'residential',
  'renovation',
  'two-storey',
  'luxury',
  'tropical-modern',
  'coastal',
  'bungalow',
  'budget-builds',
  'structural',
  'commercial',
  'social-housing',
  'design-build',
  'OFW-homes',
  'small-lot',
  'scandinavian',
  'contemporary',
  'large-residential',
] as const

export type Specialization = (typeof SPECIALIZATIONS)[number]

export const SPECIALIZATION_LABELS: Record<string, string> = {
  residential: 'Residential',
  renovation: 'Renovation',
  'two-storey': 'Two-Storey',
  luxury: 'Luxury',
  'tropical-modern': 'Tropical Modern',
  coastal: 'Coastal',
  bungalow: 'Bungalow',
  'budget-builds': 'Budget Builds',
  structural: 'Structural',
  commercial: 'Commercial',
  'social-housing': 'Social Housing',
  'design-build': 'Design-Build',
  'OFW-homes': 'OFW Homes',
  'small-lot': 'Small Lot',
  scandinavian: 'Scandinavian',
  contemporary: 'Contemporary',
  'large-residential': 'Large Residential',
}

export function specLabel(spec: string): string {
  return SPECIALIZATION_LABELS[spec] ?? spec
}

export type ContractorSort = 'featured' | 'rating' | 'experience'

export const CONTRACTOR_SORT_OPTIONS: Array<{
  value: ContractorSort
  label: string
}> = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'experience', label: 'Most Experience' },
]

/** Province → [lat, lng] centroids for map markers. */
export const PROVINCE_COORDS: Record<string, [number, number]> = {
  'Metro Manila': [14.5995, 120.9842],
  Cebu: [10.3157, 123.8854],
  'Davao del Sur': [6.7656, 125.3284],
  Pampanga: [15.0794, 120.62],
  Laguna: [14.17, 121.2436],
  Batangas: [13.7565, 121.0583],
  Iloilo: [10.7202, 122.5621],
  'Negros Occidental': [10.6407, 122.9689],
  'Misamis Oriental': [8.5046, 124.622],
  Bulacan: [14.7943, 120.8799],
  Cavite: [14.2829, 120.8686],
  Rizal: [14.6037, 121.3084],
}

export const PH_CENTER: [number, number] = [12.8797, 121.774]
