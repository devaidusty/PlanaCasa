import type { GuideCategory } from '@/types'

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  foundation: 'Foundation',
  structural: 'Structural',
  roofing: 'Roofing',
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  finishing: 'Finishing',
  permits: 'Permits',
  budgeting: 'Budgeting',
  diy_tips: 'DIY Tips',
}

export const GUIDE_CATEGORY_COLORS: Record<GuideCategory, string> = {
  foundation: 'bg-amber-100 text-amber-700',
  structural: 'bg-orange-100 text-orange-700',
  roofing: 'bg-slate-100 text-slate-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  plumbing: 'bg-blue-100 text-blue-700',
  finishing: 'bg-purple-100 text-purple-700',
  permits: 'bg-green-100 text-green-700',
  budgeting: 'bg-emerald-100 text-emerald-700',
  diy_tips: 'bg-pink-100 text-pink-700',
}

export const GUIDE_CATEGORY_BAND: Record<GuideCategory, string> = {
  foundation: 'bg-amber-400',
  structural: 'bg-orange-400',
  roofing: 'bg-slate-400',
  electrical: 'bg-yellow-400',
  plumbing: 'bg-blue-400',
  finishing: 'bg-purple-400',
  permits: 'bg-green-400',
  budgeting: 'bg-emerald-400',
  diy_tips: 'bg-pink-400',
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  'foundation',
  'structural',
  'roofing',
  'electrical',
  'plumbing',
  'finishing',
  'permits',
  'budgeting',
  'diy_tips',
]
