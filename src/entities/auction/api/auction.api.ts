import { apiRequest } from '@/shared/api/http-client'
import type { components } from '@/shared/api/types/openapi'

type AuctionListRequest = components['schemas']['AuctionListRequest']
type AuctionListResponseBase = components['schemas']['AuctionListResponseBase']
type AuctionShowResponse = components['schemas']['AuctionShowResponse']

export const fetchAuctionsList = (body: AuctionListRequest): Promise<AuctionListResponseBase> =>
  apiRequest<AuctionListResponseBase>('/auctions/list', {
    method: 'POST',
    body: JSON.stringify(body),
  })

export const fetchAuctionDetail = (auctionUuid: string): Promise<AuctionShowResponse> =>
  apiRequest<AuctionShowResponse>(`/auctions/${auctionUuid}`)
