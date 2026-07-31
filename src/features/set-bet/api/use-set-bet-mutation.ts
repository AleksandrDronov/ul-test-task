import { useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionQueryKeys } from '@/entities/auction/api/auction.query-keys'
import { postSetBet } from '@/entities/bet/api/bet.api'

/**
 * On success, invalidates all three query keys through the
 * `auctionQueryKeys` factory (task-7 resolution #3) so the detail, the bets
 * list, and the auctions list all refetch without a reload:
 *
 * - `list({})`: TanStack Query's default partial matching compares each key
 *   segment; an empty filter object has no own keys to fail the comparison,
 *   so it matches every cached `auctions.list` query regardless of filters.
 * - `detail(auctionUuid)`: exact match, this auction's detail query only.
 * - `bets(auctionUuid).slice(0, 2)`: dropping the trailing `all` segment so
 *   both the default (non-rejected) and `all=true` bets queries refetch,
 *   instead of only the exact variant this hook happens to be called from.
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
