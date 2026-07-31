import type { components } from '@/shared/api'

type AuctionListRequest = components['schemas']['AuctionListRequest']

/**
 * Единый источник правды для ключей запросов `auctions.list` и `auction.detail`.
 * Ключи ставок (`auction.bets`) живут в `entities/bet/api/bet.query-keys.ts`.
 */
export const auctionQueryKeys = {
  list: (body: AuctionListRequest) => ['auctions.list', body] as const,
  detail: (auctionUuid: string) => ['auction.detail', auctionUuid] as const,
}
