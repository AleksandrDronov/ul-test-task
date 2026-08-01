import { Skeleton } from '@/shared/ui'

export const PageSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-32 w-full" />
    ))}
  </div>
)
