import type { components } from '@/shared/api'

type AuctionListRequest = components['schemas']['AuctionListRequest']

/**
 * Единый источник правды для ключей запросов аукционов.
 * Хуки, prefetch и мутации (например, `setBet`) должны использовать эту фабрику,
 * а не дублировать литералы ключей.
 */
export const auctionQueryKeys = {
  /**
   * Ключ списка аукционов с учётом фильтров и пагинации.
   *
   * @param body — тело запроса списка аукционов (фильтры, пагинация).
   */
  list: (body: AuctionListRequest) => ['auctions.list', body] as const,
  /**
   * Ключ детальной страницы аукциона.
   *
   * @param auctionUuid — UUID аукциона.
   */
  detail: (auctionUuid: string) => ['auction.detail', auctionUuid] as const,
}
