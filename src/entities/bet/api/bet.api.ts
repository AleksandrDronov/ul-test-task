import { apiRequest } from '@/shared/api'
import type { components } from '@/shared/api'

type BetListResponse = components['schemas']['BetListResponse']
type SetBetRequest = components['schemas']['SetBetRequest']

/**
 * Запрашивает список ставок аукциона.
 *
 * @param auctionUuid — идентификатор аукциона
 * @param all — если `true`, возвращает полный список ставок (`?all=true`)
 * @returns список ставок аукциона
 */
export const fetchAuctionBets = (auctionUuid: string, all?: boolean): Promise<BetListResponse> =>
  apiRequest<BetListResponse>(`/auctions/${auctionUuid}/bets${all ? '?all=true' : ''}`)

/**
 * Размещает ставку на аукционе.
 *
 * @param auctionUuid — идентификатор аукциона
 * @param price — сумма ставки
 */
export const postSetBet = (auctionUuid: string, price: number): Promise<void> =>
  apiRequest(`/auctions/${auctionUuid}/bets`, {
    method: 'POST',
    body: JSON.stringify({ price } satisfies SetBetRequest),
  })
