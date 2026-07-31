import { queryOptions, useQuery } from '@tanstack/react-query'
import { betQueryKeys } from './bet.query-keys'
import { mapBetListToVm } from '../model'
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
    queryKey: betQueryKeys.list(auctionUuid, all),
    queryFn: () => fetchAuctionBets(auctionUuid, all),
    select: (data) => mapBetListToVm(data.bets),
    enabled: options?.enabled,
  })

export const useAuctionBetsQuery = (
  auctionUuid: string,
  all?: boolean,
  options?: AuctionBetsQueryOptions,
) => useQuery(auctionBetsQueryOptions(auctionUuid, all, options))
