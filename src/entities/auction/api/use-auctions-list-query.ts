import { queryOptions, useQuery } from '@tanstack/react-query'
import type { components } from '@/shared/api'
import { mapAuctionListItemDtoToVm, mapAuctionListMetaToVm } from '../model/map-auction-list-item'
import type { AuctionListVm } from '../model/auction-list.vm'
import { fetchAuctionsList } from './auction.api'
import { auctionQueryKeys } from './auction.query-keys'

type AuctionListRequest = components['schemas']['AuctionListRequest']

export const auctionsListQueryOptions = (body: AuctionListRequest) =>
  queryOptions({
    queryKey: auctionQueryKeys.list(body),
    queryFn: () => fetchAuctionsList(body),
    select: (data): AuctionListVm => ({
      items: (data.data ?? []).map(mapAuctionListItemDtoToVm),
      meta: mapAuctionListMetaToVm(data.meta),
    }),
  })

export const useAuctionsListQuery = (body: AuctionListRequest) => useQuery(auctionsListQueryOptions(body))
