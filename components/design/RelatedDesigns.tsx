import DesignCard from '@/components/gallery/DesignCard'
import type { Design } from '@/types'

interface RelatedDesignsProps {
  designs: Design[]
  currentSlug: string
}

export default function RelatedDesigns({ designs, currentSlug }: RelatedDesignsProps) {
  const filtered = designs.filter((d) => d.slug !== currentSlug).slice(0, 3)

  if (filtered.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-3xl font-semibold mb-8" style={{ color: '#1B2A4A' }}>
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      </div>
    </section>
  )
}
