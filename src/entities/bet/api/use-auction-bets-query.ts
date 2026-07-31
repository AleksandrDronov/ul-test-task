import { queryOptions, useQuery } from '@tanstack/react-query'
import { auctionQueryKeys } from '@/entities/auction/api/auction.query-keys'
import { mapBetListToVm } from '../model/map-bet-item'
import { fetchAuctionBets } from './bet.api'

type AuctionBetsQueryOptions = {
  enabled?: boolean
}

export const auctionBetsQueryOptions = (
  auctionUuid: string,
  all?: boolean,
  options?: AuctionBetsQueryOptions,
) =>
  queryOptions({
    queryKey: auctionQueryKeys.bets(auctionUuid, all),
    queryFn: () => fetchAuctionBets(auctionUuid, all),
    select: (data) => mapBetListToVm(data.bets),
    enabled: options?.enabled,
  })

export const useAuctionBetsQuery = (
  auctionUuid: string,
  all?: boolean,
  options?: AuctionBetsQueryOptions,
) => useQuery(auctionBetsQueryOptions(auctionUuid, all, options))
