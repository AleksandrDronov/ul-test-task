import { apiRequest } from '@/shared/api/http-client'
import type { components } from '@/shared/api/types/openapi'

type BetListResponse = components['schemas']['BetListResponse']
type SetBetRequest = components['schemas']['SetBetRequest']

export const fetchAuctionBets = (auctionUuid: string, all?: boolean): Promise<BetListResponse> =>
  apiRequest<BetListResponse>(`/auctions/${auctionUuid}/bets${all ? '?all=true' : ''}`)

/** Task 7 owns the mutation hook; this is only the raw API call it wraps. */
export const postSetBet = (auctionUuid: string, price: number): Promise<void> =>
  apiRequest(`/auctions/${auctionUuid}/bets`, {
    method: 'POST',
    body: JSON.stringify({ price } satisfies SetBetRequest),
  })
