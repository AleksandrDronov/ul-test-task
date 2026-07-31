import { queryOptions, useQuery } from '@tanstack/react-query'
import { auctionQueryKeys } from '@/entities/auction/api/auction.query-keys'
import { mapBetListToVm } from '../model/map-bet-item'
import { fetchAuctionBets } from './bet.api'

export const auctionBetsQueryOptions = (auctionUuid: string, all?: boolean) =>
  queryOptions({
    queryKey: auctionQueryKeys.bets(auctionUuid, all),
    queryFn: () => fetchAuctionBets(auctionUuid, all),
    select: (data) => mapBetListToVm(data.bets),
  })

export const useAuctionBetsQuery = (auctionUuid: string, all?: boolean) =>
  useQuery(auctionBetsQueryOptions(auctionUuid, all))
