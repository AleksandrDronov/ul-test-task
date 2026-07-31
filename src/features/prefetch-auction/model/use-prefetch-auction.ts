import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { auctionDetailQueryOptions } from '@/entities/auction/api/use-auction-detail-query'

/**
 * Keeps a hovered/focused card from re-triggering a fetch on every repeated
 * hover (resolution #4): as long as the cached detail data is younger than
 * this, `prefetchQuery` is a no-op.
 */
const PREFETCH_STALE_TIME_MS = 30_000

export const usePrefetchAuction = (auctionUuid: string | null) => {
  const queryClient = useQueryClient()

  return useCallback(() => {
    if (!auctionUuid) return

    void queryClient.prefetchQuery({
      ...auctionDetailQueryOptions(auctionUuid),
      staleTime: PREFETCH_STALE_TIME_MS,
    })
  }, [queryClient, auctionUuid])
}
