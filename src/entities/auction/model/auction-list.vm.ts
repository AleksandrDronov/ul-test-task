import type { components } from '@/shared/api/types/openapi'

type AuctionType = components['schemas']['AuctionType']
type AuctionStatus = components['schemas']['AuctionStatus']
type AuctionListItem = components['schemas']['AuctionListItem']

/** Уже, чем detail-level `TradingStatus` (см. `AuctionListItemTrading.status_mobile`). */
export type ListStatusMobile = NonNullable<NonNullable<AuctionListItem['trading']>['status_mobile']>

export type PrimaryAction =
  | { type: 'setBet'; label: 'Сделать ставку' }
  | { type: 'changeBet'; label: 'Изменить ставку' }
  | { type: 'viewBets'; label: 'Смотреть ставки' }
  | { type: 'disabled'; label: 'Ставка недоступна' }

export type AuctionListRoutePointVm = {
  city: string | null
  address: string | null
  date: string | null
}

export type AuctionListCargoVm = {
  name: string | null
  weight: number | null
  volume: number | null
  bodyType: string | null
}

export type AuctionListItemVm = {
  auctionUuid: string | null
  cargoNum: string | null
  aucType: AuctionType | null
  status: AuctionStatus | null
  statusMobile: ListStatusMobile | null
  route: {
    load: AuctionListRoutePointVm | null
    unload: AuctionListRoutePointVm | null
  }
  cargo: AuctionListCargoVm
  currentPrice: number | null
  pricePerKm: number | null
  hasBet: boolean
  canSetBet: boolean
  hidePointsAddressAndContacts: boolean
  primaryAction: PrimaryAction
}

export type AuctionListMetaVm = {
  currentPage: number | null
  from: number | null
  lastPage: number | null
  perPage: number | null
  to: number | null
  total: number | null
}

export type AuctionListVm = {
  items: AuctionListItemVm[]
  meta: AuctionListMetaVm
}
