import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import DesignHero from '@/components/design/DesignHero'
import ImageGallery from '@/components/design/ImageGallery'
import DesignTabs from '@/components/design/DesignTabs'
import PricingPackages from '@/components/design/PricingPackages'
import RelatedDesigns from '@/components/design/RelatedDesigns'
import ContractorMatch from '@/components/design/ContractorMatch'
import type { Design, DesignPackage } from '@/types'

interface DesignPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DesignPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('designs')
    .select('title, description, preview_images')
    .eq('slug', slug)
    .single()

  if (!data) {
    return { title: 'Design Not Found | PlanaCasa' }
  }

  const imageUrl = (data.preview_images as string[])?.[0]

  return {
    title: `${data.title} House Plan | PlanaCasa`,
    description: data.description,
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl, width: 1200, height: 630 }],
        }
      : undefined,
  }
}

export default async function DesignPage({ params }: DesignPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch design with packages
  const { data: designData, error } = await supabase
    .from('designs')
    .select('*, design_packages(*)')
    .eq('slug', slug)
    .single()

  if (error || !designData) {
    notFound()
  }

  const { design_packages, ...designFields } = designData as typeof designData & {
    design_packages: DesignPackage[]
  }

  const design = designFields as unknown as Design
  const packages = (design_packages ?? []) as DesignPackage[]

  // Fetch related designs (same style, different slug, limit 3)
  const { data: relatedData } = await supabase
    .from('designs')
    .select('*')
    .eq('style', design.style)
    .neq('slug', slug)
    .limit(3)

  const relatedDesigns = (relatedData ?? []) as Design[]

  const heroImage = design.preview_images?.[0] ?? ''

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Hero */}
      <DesignHero title={design.title} style={design.style} imageUrl={heroImage} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left column — 65% */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Image gallery */}
            <ImageGallery images={design.preview_images ?? []} title={design.title} />

            {/* Tabs */}
            <DesignTabs design={design} packages={packages} />
          </div>

          {/* Right column — sticky sidebar */}
          <div className="md:w-[340px] shrink-0">
            <div className="sticky top-24">
              <PricingPackages packages={packages} design={design} />
            </div>
          </div>
        </div>
      </div>

      {/* Related designs */}
      <div style={{ backgroundColor: '#FAFAF8' }}>
        <RelatedDesigns designs={relatedDesigns} currentSlug={slug} />
      </div>

      {/* Contractor match */}
      <ContractorMatch designTitle={design.title} />

      {/* Mobile bottom padding to avoid overlap with sticky CTA */}
      <div className="md:hidden h-20" />
    </div>
  )
}
