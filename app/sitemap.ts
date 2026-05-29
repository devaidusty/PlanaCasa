import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planacasa.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/constructors`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()

    const [designs, guides, contractors] = await Promise.all([
      supabase.from('designs').select('slug, updated_at'),
      supabase.from('guides').select('slug, created_at'),
      supabase.from('contractors').select('id, created_at'),
    ])

    const designRoutes: MetadataRoute.Sitemap = (designs.data ?? []).map((d) => ({
      url: `${SITE_URL}/design/${d.slug}`,
      lastModified: d.updated_at ? new Date(d.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const guideRoutes: MetadataRoute.Sitemap = (guides.data ?? []).map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: g.created_at ? new Date(g.created_at) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    const contractorRoutes: MetadataRoute.Sitemap = (
      contractors.data ?? []
    ).map((c) => ({
      url: `${SITE_URL}/constructors/${c.id}`,
      lastModified: c.created_at ? new Date(c.created_at) : now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    dynamicRoutes = [...designRoutes, ...guideRoutes, ...contractorRoutes]
  } catch {
    // If DB is unreachable at build/request time, ship the static sitemap.
    dynamicRoutes = []
  }

  return [...staticRoutes, ...dynamicRoutes]
}
