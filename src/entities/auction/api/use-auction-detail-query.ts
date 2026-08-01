import { queryOptions, useQuery } from '@tanstack/react-query'
import { mapAuctionDetailDtoToVm } from '../model/map-auction-detail'
import { fetchAuctionDetail } from './auction.api'
import { auctionQueryKeys } from './auction.query-keys'

/**
 * Экспортируется как reusable options (не только хук), чтобы prefetch по hover в Task 8
 * мог вызвать `queryClient.prefetchQuery(auctionDetailQueryOptions(uuid))`
 * с тем же key/fetcher, что использует `useQuery` на странице.
 */
export const auctionDetailQueryOptions = (auctionUuid: string) =>
  queryOptions({
    queryKey: auctionQueryKeys.detail(auctionUuid),
    queryFn: () => fetchAuctionDetail(auctionUuid),
    select: mapAuctionDetailDtoToVm,
  })

export const useAuctionDetailQuery = (auctionUuid: string) =>
  useQuery(auctionDetailQueryOptions(auctionUuid))
