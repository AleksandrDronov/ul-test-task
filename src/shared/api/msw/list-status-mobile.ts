import type { components } from '@/shared/api/types/openapi'

type AuctionListItem = components['schemas']['AuctionListItem']
type TradingStatus = components['schemas']['TradingStatus']
type ListStatusMobile = NonNullable<NonNullable<AuctionListItem['trading']>['status_mobile']>

/**
 * `AuctionListItemTrading.status_mobile` разрешает более узкий enum, чем
 * detail-level `TradingStatus` (заметка brief task-5 об асимметрии enum).
 * Все значения из seed data укладываются в узкий набор — безопасное,
 * exhaustive-by-construction отображение. Используется в `seed.ts`
 * (начальное состояние) и `store.ts` (синхронизация после ставки), чтобы
 * они не расходились.
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
