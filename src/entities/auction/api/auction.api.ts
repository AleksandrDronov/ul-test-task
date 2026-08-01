import { apiRequest } from '@/shared/api'
import type { components } from '@/shared/api'

type AuctionListRequest = components['schemas']['AuctionListRequest']
type AuctionListResponseBase = components['schemas']['AuctionListResponseBase']
type AuctionShowResponse = components['schemas']['AuctionShowResponse']

/**
 * Запрашивает список аукционов с фильтрами и пагинацией.
 *
 * @param body — фильтры, сортировка и параметры пагинации
 * @returns страница аукционов с метаданными пагинации
 */
export const fetchAuctionsList = (body: AuctionListRequest): Promise<AuctionListResponseBase> =>
  apiRequest<AuctionListResponseBase>('/auctions/list', {
    method: 'POST',
    body: JSON.stringify(body),
  })

/**
 * Запрашивает детальную информацию об аукционе по UUID.
 *
 * @param auctionUuid — идентификатор аукциона
 * @returns данные аукциона
 */
export const fetchAuctionDetail = (auctionUuid: string): Promise<AuctionShowResponse> =>
  apiRequest<AuctionShowResponse>(`/auctions/${auctionUuid}`)
