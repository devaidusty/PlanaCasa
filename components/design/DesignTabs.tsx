'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Grid } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import DesignSpecs from '@/components/design/DesignSpecs'
import CostBreakdown from '@/components/design/CostBreakdown'
import ClimateAdaptation from '@/components/design/ClimateAdaptation'
import type { Design, DesignPackage } from '@/types'

interface DesignTabsProps {
  design: Design
  packages: DesignPackage[]
}

const DIY_PHASES = [
  {
    title: 'Phase 1: Site Preparation',
    content: `Before ground breaks, verify the exact lot boundaries with a licensed geodetic engineer. Have the site cleared and leveled. Confirm soil bearing capacity — soft or clayey soil may require additional footing depth or soil improvement. Ensure proper temporary fencing and permit signages are posted as required by your LGU.`,
  },
  {
    title: 'Phase 2: Foundation',
    content: `Inspect footing dimensions and steel reinforcement placement before the concrete pour. Check that rebar spacing, size, and cover distances match the approved structural plans. Slump test the concrete on delivery (target 100–125mm for footings). Never allow water to be added to the mix on site. After pouring, cure foundation concrete for at least 7 days before loading.`,
  },
  {
    title: 'Phase 3: Structural Frame',
    content: `Verify column and beam dimensions against the structural drawings. Check that all stirrups and ties are correctly spaced — especially within the 2D zone at column tops and bottoms. Ensure all anchor bolts for steel elements are correctly positioned. Use a spirit level and plumb bob to verify columns are truly vertical before and after the pour.`,
  },
  {
    title: 'Phase 4: Roofing',
    content: `Inspect purlins for correct spacing and secure connection to rafters. Check that roofing sheets overlap per manufacturer specs (minimum 150mm side lap, 200mm end lap). Verify all ridge caps, flashing, and gutters are properly installed and sealed. In typhoon zones, use tek screws with neoprene washers — not nails. Perform a water test before ceiling work begins.`,
  },
  {
    title: 'Phase 5: MEP Rough-In (Electrical & Plumbing)',
    content: `For electrical: verify conduit routing follows the approved electrical plans. Ensure boxes are correctly positioned at switch and outlet heights (300mm and 450mm AFF respectively, or per plan). For plumbing: pressure-test supply lines at 150 psi for 2 hours before enclosing walls. Verify all waste line slopes (minimum 1:50 for horizontal runs). Never pour concrete over unchecked MEP rough-in.`,
  },
  {
    title: 'Phase 6: Finishing',
    content: `Paint: ensure surfaces are fully cured (minimum 28 days for concrete) before applying primer. Apply two coats of finish paint minimum. Tiles: check layout and grout alignment before adhesive sets. Spot-check hollow tiles — any hollow sound indicates poor adhesion; rip and redo. Fixtures: use Teflon tape on all threaded connections; test all faucets and flush all toilets before sign-off. Final punch list: check every door, window, and cabinet for proper operation.`,
  },
]

export default function DesignTabs({ design, packages }: DesignTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full flex flex-wrap gap-1 h-auto p-1 mb-6">
        <TabsTrigger value="overview" className="flex-1 min-w-fit text-sm">Overview</TabsTrigger>
        <TabsTrigger value="floorplans" className="flex-1 min-w-fit text-sm">Floor Plans</TabsTrigger>
        <TabsTrigger value="costs" className="flex-1 min-w-fit text-sm">Cost Breakdown</TabsTrigger>
        <TabsTrigger value="diy" className="flex-1 min-w-fit text-sm">DIY Tips</TabsTrigger>
        <TabsTrigger value="climate" className="flex-1 min-w-fit text-sm">Climate Notes</TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview" className="space-y-6">
        <DesignSpecs design={design} />
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 leading-relaxed">{design.description}</p>
        </div>
        {design.tags && design.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {design.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Floor Plans */}
      <TabsContent value="floorplans">
        {design.floor_plan_images && design.floor_plan_images.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              Detailed dimensioned floor plans are included in all purchase packages.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {design.floor_plan_images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100">
                  <Image
                    src={img}
                    alt={`Floor plan ${i + 1}`}
                    fill
                    className="object-contain bg-white"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Grid className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2" style={{ color: '#1B2A4A' }}>
              Floor plan images coming soon
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">
              Detailed dimensioned floor plans are included in all purchase packages.
            </p>
          </div>
        )}
      </TabsContent>

      {/* Cost Breakdown */}
      <TabsContent value="costs">
        <CostBreakdown design={design} />
      </TabsContent>

      {/* DIY Tips */}
      <TabsContent value="diy" className="space-y-4">
        <p className="text-sm text-gray-500">
          Key supervision checkpoints for owner-builders and project managers. These apply to most Philippine residential builds.
        </p>

        <Accordion className="space-y-2">
          {DIY_PHASES.map((phase, i) => (
            <AccordionItem
              key={i}
              value={`phase-${i}`}
              className="border border-gray-100 rounded-xl overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-semibold py-4 hover:no-underline" style={{ color: '#1B2A4A' }}>
                {phase.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-4">
                {phase.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#C9A84C' }}
        >
          Get the full DIY guide for your design →
        </Link>
      </TabsContent>

      {/* Climate Notes */}
      <TabsContent value="climate">
        <ClimateAdaptation notes={design.climate_notes} style={design.style} />
      </TabsContent>
    </Tabs>
  )
}
