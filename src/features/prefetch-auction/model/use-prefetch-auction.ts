import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { auctionDetailQueryOptions } from '@/entities/auction/api/use-auction-detail-query'

/**
 * Не дублирует запрос при каждом повторном hover/focus на карточке (разрешение #4):
 * пока кэшированные данные детали моложе этого значения, `prefetchQuery` — no-op.
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
