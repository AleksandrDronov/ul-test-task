import { Skeleton } from '@/shared/ui'

export const RoutePendingFallback = () => (
  <div
    className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:px-8"
    role="status"
    aria-busy="true"
    aria-label="Загрузка страницы"
  >
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-64 w-full" />
  </div>
)
