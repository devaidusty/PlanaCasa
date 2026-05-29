import { Skeleton } from '@/components/ui/skeleton'

export function DesignCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 bg-white">
      <Skeleton className="w-full aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  )
}

export function ContractorCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  )
}

export function GuideCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
      <Skeleton className="h-2 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}
