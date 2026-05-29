'use client'

import dynamic from 'next/dynamic'
import type { Contractor } from '@/types'

const Inner = dynamic(() => import('./ContractorMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-xl bg-gray-100 animate-pulse">
      <span className="text-sm text-gray-400">Loading map…</span>
    </div>
  ),
})

export default function ContractorMap({
  contractors,
}: {
  contractors: Contractor[]
}) {
  return <Inner contractors={contractors} />
}
