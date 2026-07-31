import type { components } from '@/shared/api'
import type {
  AuctionListCargoVm,
  AuctionListItemVm,
  AuctionListMetaVm,
  AuctionListRoutePointVm,
  PrimaryAction,
} from './auction-list.vm'

type AuctionListItem = components['schemas']['AuctionListItem']
type AuctionListItemRoutePoint = components['schemas']['AuctionListItemRoutePoint']
type AuctionListMeta = components['schemas']['AuctionListMeta']
type AuctionStatus = components['schemas']['AuctionStatus']

/**
 * `AuctionListItemTrading` не содержит `hide_bets_history` — этот флаг только в ответе детали
 * (глобальные ограничения task-6). На уровне списка как эвристика: история ставок
 * «недоступна для просмотра» только пока аукцион в `Planning` (торги не начались,
 * смотреть нечего); любой другой статус считается доступным для просмотра.
 * Отмечено как допущение в отчёте task-6.
 */
const isBetHistoryViewableFromListStatus = (status: AuctionStatus | undefined): boolean =>
  status !== 'Planning'

const resolvePrimaryAction = (params: {
  canSetBet: boolean
  hasBet: boolean
  historyViewable: boolean
}): PrimaryAction => {
  if (params.canSetBet && !params.hasBet) {
    return { type: 'setBet', label: 'Сделать ставку' }
  }

  if (params.canSetBet && params.hasBet) {
    return { type: 'changeBet', label: 'Изменить ставку' }
  }

  if (params.historyViewable) {
    return { type: 'viewBets', label: 'Смотреть ставки' }
  }

  return { type: 'disabled', label: 'Ставка недоступна' }
}

const mapRoutePoint = (point: AuctionListItemRoutePoint | undefined): AuctionListRoutePointVm | null => {
  if (!point) return null

  return {
    city: point.city ?? null,
    address: point.address ?? null,
    date: point.date ?? null,
  }
}

const mapCargo = (cargo: AuctionListItem['cargo']): AuctionListCargoVm => ({
  name: cargo?.name ?? null,
  weight: cargo?.weight ?? null,
  volume: cargo?.volume ?? null,
  bodyType: cargo?.body_type ?? null,
})

export const mapAuctionListItemDtoToVm = (dto: AuctionListItem): AuctionListItemVm => {
  const { main, trading, route } = dto

  // Absent restriction flags → not applied; absent can_set_bet → bidding not offered.
  const canSetBet = trading?.can_set_bet ?? false
  const hasBet = trading?.your?.bet ?? false
  const historyViewable = isBetHistoryViewableFromListStatus(trading?.status)

  return {
    auctionUuid: main?.order_uid ?? null,
    cargoNum: main?.cargo_num ?? null,
    aucType: main?.auc_type ?? null,
    status: trading?.status ?? null,
    statusMobile: trading?.status_mobile ?? null,
    route: {
      load: mapRoutePoint(route?.load),
      unload: mapRoutePoint(route?.unload),
    },
    cargo: mapCargo(dto.cargo),
    currentPrice: trading?.price?.current ?? null,
    pricePerKm: main?.price_per_km ?? null,
    hasBet,
    canSetBet,
    hidePointsAddressAndContacts: trading?.hide_points_address_and_contacts ?? false,
    primaryAction: resolvePrimaryAction({ canSetBet, hasBet, historyViewable }),
  }
}

export const mapAuctionListMetaToVm = (meta: AuctionListMeta | undefined): AuctionListMetaVm => ({
  currentPage: meta?.current_page ?? null,
  from: meta?.from ?? null,
  lastPage: meta?.last_page ?? null,
  perPage: meta?.per_page ?? null,
  to: meta?.to ?? null,
  total: meta?.total ?? null,
})
