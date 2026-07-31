/**
 * Единый источник правды для ключей запросов `auction.bets`.
 * Мутация `setBet` (features/set-bet) должна использовать эту фабрику,
 * а не дублировать литералы ключей.
 */
export const betQueryKeys = {
  list: (auctionUuid: string, all?: boolean) => ['auction.bets', auctionUuid, all] as const,
  /** Префикс для инвалидации всех вариантов списка ставок (с `all` и без). */
  listPrefix: (auctionUuid: string) => ['auction.bets', auctionUuid] as const,
}
