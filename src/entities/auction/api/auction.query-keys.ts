import type { components } from '@/shared/api'

type AuctionListRequest = components['schemas']['AuctionListRequest']

/**
 * Единый источник правды для всех ключей запросов `auction.*` / `auctions.*`.
 * Мутация `setBet` (Task 7) и prefetch (Task 8) должны использовать эту фабрику,
 * а не дублировать литералы ключей (разрешение task-6 #5).
 */
export const auctionQueryKeys = {
  list: (body: AuctionListRequest) => ['auctions.list', body] as const,
  detail: (auctionUuid: string) => ['auction.detail', auctionUuid] as const,
  bets: (auctionUuid: string, all?: boolean) => ['auction.bets', auctionUuid, all] as const,
}
