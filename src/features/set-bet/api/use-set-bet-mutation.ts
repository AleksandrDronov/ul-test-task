import { useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionQueryKeys } from '@/entities/auction'
import { postSetBet } from '@/entities/bet'

/**
 * При успехе инвалидирует все три ключи запросов через фабрику `auctionQueryKeys`
 * (разрешение task-7 #3), чтобы деталь, список ставок и список аукционов обновились без перезагрузки:
 *
 * - `list({})`: частичное сопоставление TanStack Query сравнивает сегменты ключа;
 *   пустой объект фильтров не имеет собственных ключей для сравнения,
 *   поэтому совпадает с любым закэшированным `auctions.list` независимо от фильтров.
 * - `detail(auctionUuid)`: точное совпадение, только запрос детали этого аукциона.
 * - `bets(auctionUuid).slice(0, 2)`: без завершающего сегмента `all`, чтобы
 *   обновились и дефолтный (без отклонённых), и `all=true` варианты списка ставок,
 *   а не только тот, из которого вызван этот хук.
 */
export const useSetBetMutation = (auctionUuid: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['setBet', auctionUuid],
    mutationFn: (price: number) => postSetBet(auctionUuid, price),
    onSuccess: () => {
      const betsKey = auctionQueryKeys.bets(auctionUuid)

      void queryClient.invalidateQueries({ queryKey: auctionQueryKeys.list({}) })
      void queryClient.invalidateQueries({ queryKey: auctionQueryKeys.detail(auctionUuid) })
      void queryClient.invalidateQueries({ queryKey: betsKey.slice(0, 2) })
    },
  })
}
