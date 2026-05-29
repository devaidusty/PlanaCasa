// ─── Design Types ─────────────────────────────────────────────────────────────

export type DesignStyle =
  | 'modern_filipino'
  | 'tropical_modern'
  | 'european_modern'
  | 'uk_contemporary'
  | 'scandinavian'
  | 'ofw_dream'
  | 'small_lot'
  | 'two_storey_rental'
  | 'bungalow'

export interface Design {
  id: string
  title: string
  slug: string
  description: string
  style: DesignStyle
  bedrooms: number
  bathrooms: number
  floor_area_sqm: number
  lot_area_sqm: number
  estimated_build_cost_min: number
  estimated_build_cost_max: number
  plan_price: number
  floors: number
  garage: boolean
  featured: boolean
  climate_notes: string
  preview_images: string[]
  floor_plan_images: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface DesignPackage {
  id: string
  design_id: string
  package_name: 'Basic' | 'Standard' | 'Premium'
  price: number
  includes: string[]
  file_urls: string[]
}

export interface Purchase {
  id: string
  user_id: string
  design_id: string
  package_id: string
  amount_paid: number
  currency: string
  payment_method: 'paymongo' | 'stripe' | 'mock'
  payment_status: 'pending' | 'completed' | 'failed'
  transaction_id: string
  download_count: number
  max_downloads: number
  created_at: string
}

export interface User {
  id: string
  full_name: string
  email: string
  phone: string
  location_city: string
  location_province: string
  location_country: string
  avatar_url: string
  role: 'customer' | 'admin'
  created_at: string
}

export type ListingTier = 'free' | 'verified' | 'featured'

export interface Contractor {
  id: string
  business_name: string
  owner_name: string
  description: string
  city: string
  province: string
  region: string
  coverage_areas: string[]
  specializations: string[]
  years_experience: number
  license_number: string
  pcab_accredited: boolean
  prc_licensed: boolean
  portfolio_images: string[]
  contact_phone: string
  contact_email: string
  contact_messenger: string
  facebook_page: string
  price_range_min: number
  price_range_max: number
  is_verified: boolean
  is_featured: boolean
  listing_tier: ListingTier
  average_rating: number
  total_reviews: number
  created_at: string
}

export interface ContractorReview {
  id: string
  contractor_id: string
  user_id: string
  purchase_id: string
  rating: number
  review_text: string
  project_type: string
  project_location: string
  created_at: string
}

export type GuideCategory =
  | 'foundation'
  | 'structural'
  | 'roofing'
  | 'electrical'
  | 'plumbing'
  | 'finishing'
  | 'permits'
  | 'budgeting'
  | 'diy_tips'

export interface Guide {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: GuideCategory
  read_time_minutes: number
  cover_image: string
  is_free: boolean
  tags: string[]
  created_at: string
}

export interface CostCalculatorData {
  id: string
  region: string
  province: string
  cost_per_sqm_low: number
  cost_per_sqm_mid: number
  cost_per_sqm_high: number
  last_updated: string
}

export type CustomizationStatus = 'pending' | 'reviewing' | 'quoted' | 'completed'

export interface CustomizationRequest {
  id: string
  user_id: string
  design_id: string
  changes_requested: string
  budget: number
  contact_phone: string
  status: CustomizationStatus
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string
  source: string
  subscribed_at: string
}

export interface Wishlist {
  id: string
  user_id: string
  design_id: string
  created_at: string
}

// ─── Filter Types ──────────────────────────────────────────────────────────────

export interface GalleryFilters {
  search?: string
  style?: DesignStyle[]
  bedrooms?: number[]
  bathrooms?: number[]
  floor_area_min?: number
  floor_area_max?: number
  cost_min?: number
  cost_max?: number
  plan_price_min?: number
  plan_price_max?: number
  floors?: number[]
  garage?: boolean
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'area' | 'bedrooms'
}

// ─── Calculator Types ──────────────────────────────────────────────────────────

export interface CostEstimate {
  region: string
  province: string
  floor_area_sqm: number
  quality: 'economy' | 'standard' | 'premium'
  breakdown: CostBreakdownItem[]
  total_min: number
  total_max: number
}

export interface CostBreakdownItem {
  phase: string
  min: number
  avg: number
  max: number
  percentage: number
}

// ─── Payment Types ─────────────────────────────────────────────────────────────

export interface CheckoutData {
  design: Design
  package: DesignPackage
  buyer: {
    full_name: string
    email: string
    phone: string
    location_city: string
    location_province: string
    location_country: string
  }
  payment_method: 'paymongo' | 'stripe'
}
