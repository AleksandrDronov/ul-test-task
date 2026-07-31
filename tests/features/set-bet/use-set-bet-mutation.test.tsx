import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { auctionQueryKeys } from '@/entities/auction/api/auction.query-keys'
import { useSetBetMutation } from '@/features/set-bet/api/use-set-bet-mutation'
import * as betApi from '@/entities/bet/api/bet.api'

vi.mock('@/entities/bet/api/bet.api', () => ({
  postSetBet: vi.fn(),
}))

const postSetBetMock = vi.mocked(betApi.postSetBet)

const AUCTION_UUID = 'uuid-1'

describe('useSetBetMutation', () => {
  beforeEach(() => {
    postSetBetMock.mockReset()
  })

  it('invalidates the auctions list (any filter body), the detail, and the bets (any "all" variant) through the factory', async () => {
    postSetBetMock.mockResolvedValue(undefined)
    const queryClient = new QueryClient()

    // Seed the cache with entries that a real page would have, including a
    // list filtered by an arbitrary body and both bets variants ("all" and
    // default) - the invalidation must reach every one of these.
    const listKey = auctionQueryKeys.list({ page: 2, per_page: 10, cargo_num: '0001' })
    const detailKey = auctionQueryKeys.detail(AUCTION_UUID)
    const betsDefaultKey = auctionQueryKeys.bets(AUCTION_UUID)
    const betsAllKey = auctionQueryKeys.bets(AUCTION_UUID, true)
    const otherAuctionBetsKey = auctionQueryKeys.bets('uuid-2')

    queryClient.setQueryData(listKey, { data: [], meta: {} })
    queryClient.setQueryData(detailKey, {})
    queryClient.setQueryData(betsDefaultKey, { bets: [] })
    queryClient.setQueryData(betsAllKey, { bets: [] })
    queryClient.setQueryData(otherAuctionBetsKey, { bets: [] })

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useSetBetMutation(AUCTION_UUID), { wrapper })

    result.current.mutate(45000)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(postSetBetMock).toHaveBeenCalledWith(AUCTION_UUID, 45000)
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(betsDefaultKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(betsAllKey)?.isInvalidated).toBe(true)
    // A different auction's bets must not be touched.
    expect(queryClient.getQueryState(otherAuctionBetsKey)?.isInvalidated).toBe(false)
  })
})
