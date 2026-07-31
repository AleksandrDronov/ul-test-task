import { useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionQueryKeys } from '@/entities/auction'
import { postSetBet, betQueryKeys } from '@/entities/bet'

/**
 * При успехе инвалидирует все три ключа запросов через `auctionQueryKeys` и `betQueryKeys`
 * (разрешение task-7 #3), чтобы деталь, список ставок и список аукционов обновились без перезагрузки:
 *
 * - `list({})`: частичное сопоставление TanStack Query сравнивает сегменты ключа;
 *   пустой объект фильтров не имеет собственных ключей для сравнения,
 *   поэтому совпадает с любым закэшированным `auctions.list` независимо от фильтров.
 * - `detail(auctionUuid)`: точное совпадение, только запрос детали этого аукциона.
 * - `listPrefix(auctionUuid)`: без сегмента `all`, чтобы обновились и дефолтный
 *   (без отклонённых), и `all=true` варианты списка ставок.
 */
export const useSetBetMutation = (auctionUuid: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['setBet', auctionUuid],
    mutationFn: (price: number) => postSetBet(auctionUuid, price),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: auctionQueryKeys.list({}) })
      void queryClient.invalidateQueries({ queryKey: auctionQueryKeys.detail(auctionUuid) })
      void queryClient.invalidateQueries({ queryKey: betQueryKeys.listPrefix(auctionUuid) })
    },
  })
}
