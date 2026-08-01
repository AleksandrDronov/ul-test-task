import { Skeleton } from '@/shared/ui'

export const PageSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
)

export const BetsSkeleton = () => <Skeleton className="h-64 w-full" />
