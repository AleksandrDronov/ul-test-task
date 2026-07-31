import type { components } from '@/shared/api/types/openapi'

type AuctionListRequest = components['schemas']['AuctionListRequest']

/**
 * Single source of truth for every `auction.*` / `auctions.*` query key.
 * Task 7's `setBet` mutation and Task 8's prefetching must go through this
 * factory rather than repeating key literals (task-6 brief resolution #5).
 */
export const auctionQueryKeys = {
  list: (body: AuctionListRequest) => ['auctions.list', body] as const,
  detail: (auctionUuid: string) => ['auction.detail', auctionUuid] as const,
  bets: (auctionUuid: string, all?: boolean) => ['auction.bets', auctionUuid, all] as const,
}
