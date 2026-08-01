import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { auctionDetailQueryOptions } from '@/entities/auction'

const PREFETCH_STALE_TIME_MS = 30_000

/**
 * Предзагружает данные детальной страницы аукциона в кэш React Query.
 *
 * Возвращает стабильный колбэк для событий наведения или фокуса (например,
 * `onMouseEnter` / `onFocus` на карточке). Использует те же `queryKey` и
 * `queryFn`, что `useAuctionDetailQuery`, чтобы при переходе данные уже были
 * в кэше. Если `auctionUuid` равен `null`, колбэк ничего не делает.
 *
 * @param auctionUuid — UUID аукциона для предзагрузки или `null`, если UUID недоступен.
 * @returns Колбэк без аргументов, запускающий `prefetchQuery` с `staleTime` 30 с.
 */
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
