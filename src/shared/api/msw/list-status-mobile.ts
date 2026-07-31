import type { components } from '@/shared/api/types/openapi'

type AuctionListItem = components['schemas']['AuctionListItem']
type TradingStatus = components['schemas']['TradingStatus']
type ListStatusMobile = NonNullable<NonNullable<AuctionListItem['trading']>['status_mobile']>

/**
 * `AuctionListItemTrading.status_mobile` allows a narrower enum than the
 * detail-level `TradingStatus` (see task-5 brief note on enum asymmetry).
 * All values used by the seed data fall within the narrower set, so this
 * is a safe, exhaustive-by-construction mapping. Shared by `seed.ts`
 * (initial state) and `store.ts` (post-bet sync) so the two can't diverge.
 */
export const toListStatusMobile = (status: TradingStatus | undefined): ListStatusMobile => {
  switch (status) {
    case 'NotParticipating':
    case 'Leading':
    case 'Losing':
    case 'Winner':
    case 'Confirmed':
      return status
    default:
      return 'Unknown'
  }
}
