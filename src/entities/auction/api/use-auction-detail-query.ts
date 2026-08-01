import { queryOptions, useQuery } from '@tanstack/react-query'
import { mapAuctionDetailDtoToVm } from '../model/map-auction-detail'
import { fetchAuctionDetail } from './auction.api'
import { auctionQueryKeys } from './auction.query-keys'

/**
 * Экспортируется как reusable options (не только хук), чтобы prefetch и loader
 * могли вызвать `queryClient.prefetchQuery(auctionDetailQueryOptions(uuid))`
 * с тем же key/fetcher, что использует `useQuery` на странице деталей.
 *
 * Ответ API маппится в `AuctionDetailVm` через `select`.
 *
 * @param auctionUuid — UUID аукциона.
 */
export const auctionDetailQueryOptions = (auctionUuid: string) =>
  queryOptions({
    queryKey: auctionQueryKeys.detail(auctionUuid),
    queryFn: () => fetchAuctionDetail(auctionUuid),
    select: mapAuctionDetailDtoToVm,
  })

/**
 * React Query-хук для загрузки детальной информации об аукционе.
 *
 * @param auctionUuid — UUID аукциона.
 * @returns Результат `useQuery` с данными типа `AuctionDetailVm`.
 */
export const useAuctionDetailQuery = (auctionUuid: string) =>
  useQuery(auctionDetailQueryOptions(auctionUuid))
