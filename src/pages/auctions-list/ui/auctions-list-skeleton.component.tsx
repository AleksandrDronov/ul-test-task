import { Skeleton } from '@/shared/ui/skeleton'

const CardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
    <div className="flex items-start justify-between gap-2">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-9 w-32" />
    </div>
  </div>
)

export const AuctionsListSkeletonComponent = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
    {Array.from({ length: 6 }, (_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
)
