import { useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionQueryKeys } from '@/entities/auction'
import { postSetBet, betQueryKeys } from '@/entities/bet'

/**
 * React Query-хук для размещения ставки на аукционе.
 *
 * После успешного запроса инвалидирует список аукционов, детали текущего аукциона
 * и все варианты списка ставок по `auctionUuid`.
 *
 * @param auctionUuid — UUID аукциона, на котором размещается ставка.
 * @returns Результат `useMutation`; в `mutate`/`mutateAsync` передаётся сумма ставки (`price`).
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
