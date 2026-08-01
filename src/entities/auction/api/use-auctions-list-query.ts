import { queryOptions, useQuery } from '@tanstack/react-query'
import type { components } from '@/shared/api'
import { mapAuctionListItemDtoToVm, mapAuctionListMetaToVm } from '../model/map-auction-list-item'
import type { AuctionListVm } from '../model/auction-list.vm'
import { fetchAuctionsList } from './auction.api'
import { auctionQueryKeys } from './auction.query-keys'

type AuctionListRequest = components['schemas']['AuctionListRequest']

/**
 * Экспортируется как reusable options (не только хук), чтобы prefetch и loader
 * могли вызвать `queryClient.prefetchQuery(auctionsListQueryOptions(body))`
 * с тем же key/fetcher, что использует `useQuery` на странице списка.
 *
 * Ответ API маппится в `AuctionListVm` через `select`.
 *
 * @param body — тело запроса списка аукционов (фильтры, пагинация).
 */
export const auctionsListQueryOptions = (body: AuctionListRequest) =>
  queryOptions({
    queryKey: auctionQueryKeys.list(body),
    queryFn: () => fetchAuctionsList(body),
    select: (data): AuctionListVm => ({
      items: (data.data ?? []).map(mapAuctionListItemDtoToVm),
      meta: mapAuctionListMetaToVm(data.meta),
    }),
  })

/**
 * React Query-хук для загрузки списка аукционов.
 *
 * @param body — тело запроса списка аукционов (фильтры, пагинация).
 * @returns Результат `useQuery` с данными типа `AuctionListVm`.
 */
export const useAuctionsListQuery = (body: AuctionListRequest) =>
  useQuery(auctionsListQueryOptions(body))
