import { queryOptions, useQuery } from '@tanstack/react-query'
import { mapAuctionDetailDtoToVm } from '../model/map-auction-detail'
import { fetchAuctionDetail } from './auction.api'
import { auctionQueryKeys } from './auction.query-keys'

/**
 * Exported as reusable options (not just the hook) so Task 8's hover
 * prefetch can call `queryClient.prefetchQuery(auctionDetailQueryOptions(uuid))`
 * with the exact same key/fetcher the page's `useQuery` uses.
 */
export const auctionDetailQueryOptions = (auctionUuid: string) =>
  queryOptions({
    queryKey: auctionQueryKeys.detail(auctionUuid),
    queryFn: () => fetchAuctionDetail(auctionUuid),
    select: mapAuctionDetailDtoToVm,
  })

export const useAuctionDetailQuery = (auctionUuid: string) => useQuery(auctionDetailQueryOptions(auctionUuid))
