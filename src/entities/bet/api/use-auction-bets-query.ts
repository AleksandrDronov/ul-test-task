import { queryOptions, useQuery } from '@tanstack/react-query'
import { auctionQueryKeys } from '@/entities/auction'
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
