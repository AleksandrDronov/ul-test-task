import type { components } from '@/shared/api/types/openapi'
import { getAuctionStatusCode } from '@/shared/config/auction-status-map'
import { SEED_AUCTIONS } from './seed'

type AuctionListRequest = components['schemas']['AuctionListRequest']
type AuctionListResponseBase = components['schemas']['AuctionListResponseBase']
type AuctionListItem = components['schemas']['AuctionListItem']
type AuctionListMeta = components['schemas']['AuctionListMeta']
type AuctionShowResponse = components['schemas']['AuctionShowResponse']
type BetItem = components['schemas']['BetItem']
type BetListResponse = components['schemas']['BetListResponse']
type ProblemDetail = components['schemas']['ProblemDetail']
type ValidationProblem = components['schemas']['ValidationProblem']
type ListStatusMobile = NonNullable<NonNullable<AuctionListItem['trading']>['status_mobile']>

export type AuctionRecord = {
  detail: AuctionShowResponse
  listItem: AuctionListItem
  bets: BetItem[]
}

export type SetBetResult =
  | { ok: true }
  | { ok: false; status: 404; body: ProblemDetail }
  | { ok: false; status: 422; body: ValidationProblem }

/**
 * The single mocked carrier acting as "the current user" across the app.
 * Kept in sync with the seed data's own bets so "my bet" logic is coherent
 * (see resolution #2 in the task-5 brief).
 */
const CURRENT_USER = {
  organizationId: 14,
  organizationName: 'ООО Перевозчик',
  organizationInn: '9616244307',
  subscriberId: 13,
  contactName: 'Иванов Иван',
} as const

const VAT_RATE = 0.2
const FLOAT_EPSILON = 1e-6

const round2 = (value: number): number => Math.round(value * 100) / 100
const toNoVat = (value: number): number => round2(value / (1 + VAT_RATE))

let auctions: AuctionRecord[] = cloneSeed()

function cloneSeed(): AuctionRecord[] {
  return SEED_AUCTIONS.map((record) => structuredClone(record))
}

/** Resets the in-memory store to its seeded state. Intended for tests. */
export const resetStore = (): void => {
  auctions = cloneSeed()
}

const findRecord = (uuid: string): AuctionRecord | undefined =>
  auctions.find((record) => record.detail.main.order_uid === uuid)

const notFoundProblem = (): ProblemDetail => ({
  code: 'resource_not_found',
  title: 'Не найдено',
  message: 'Аукцион не найден.',
  trace_id: null,
})

const priceFieldProblem = (message: string, code: string): ValidationProblem => ({
  code: 'validation_failed',
  title: 'Ошибка валидации',
  message: 'Запрос содержит некорректные поля.',
  trace_id: null,
  errors: [{ field: 'price', message, code }],
})

const isOnStep = (price: number, max: number, step: number): boolean => {
  if (step <= 0) return true
  const stepsFromMax = (max - price) / step
  return Math.abs(stepsFromMax - Math.round(stepsFromMax)) < FLOAT_EPSILON
}

const toListStatusMobile = (status: components['schemas']['TradingStatus'] | undefined): ListStatusMobile => {
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

const syncListItem = (record: AuctionRecord): void => {
  const { detail, listItem } = record
  const detailTrading = detail.trading
  const listTrading = listItem.trading

  if (listTrading) {
    listTrading.status_mobile = toListStatusMobile(detailTrading.status_mobile)
    listTrading.is_bidder = detailTrading.is_bidder
    listTrading.price = {
      ...listTrading.price,
      current: detailTrading.price?.current ?? listTrading.price?.current,
      current_no_vat: detailTrading.price?.current_no_vat ?? listTrading.price?.current_no_vat,
    }
    listTrading.your = {
      bet: detailTrading.your?.bet ?? false,
      last_bet: detailTrading.your?.last_bet ?? null,
    }
  }

  if (listItem.main) {
    listItem.main.price_per_km = detailTrading.price?.price_per_km ?? listItem.main.price_per_km ?? null
  }
}

const applyAcceptedBet = (record: AuctionRecord, price: number): void => {
  const trading = record.detail.trading
  const step = trading.price?.step ?? 0
  const min = trading.price?.min ?? null
  const distance = record.detail.cargo.distance ?? 0

  const rawAvailable = price - step
  const available = min !== null ? Math.max(rawAvailable, min) : rawAvailable
  const currentNoVat = toNoVat(price)
  const availableNoVat = toNoVat(available)

  const nextId = record.bets.reduce((max, bet) => Math.max(max, bet.id ?? 0), 0) + 1

  const bet: BetItem = {
    id: nextId,
    created_at: new Date().toISOString(),
    auction_id: record.detail.main.id ?? 0,
    subscriber_id: CURRENT_USER.subscriberId,
    contact_name: CURRENT_USER.contactName,
    contact_phone: '',
    price_with_vat: price,
    price_no_vat: currentNoVat,
    organization_id: CURRENT_USER.organizationId,
    organization_inn: CURRENT_USER.organizationInn,
    organization_name: CURRENT_USER.organizationName,
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: 1,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: {
      price_with_vat: price,
      price_no_vat: currentNoVat,
      payment_type: record.detail.payment.form ?? null,
      vat_rate: '20',
    },
  }

  record.bets.push(bet)

  trading.price = {
    ...trading.price,
    current: price,
    current_no_vat: currentNoVat,
    available,
    available_no_vat: availableNoVat,
    price_per_km: distance > 0 ? round2(currentNoVat / distance) : 0,
  }

  trading.your = {
    ...trading.your,
    bet: true,
    last_bet: price,
    last_bet_with_vat: price,
  }

  trading.status_mobile = 'Leading'
  trading.is_bidder = true

  syncListItem(record)
}

/**
 * Validation order (see task-5 brief resolution #4):
 * 1. unknown auction -> 404
 * 2. `trading.can_set_bet === false` -> 422 (field: price)
 * 3. price <= 0 -> 422
 * 4. price above `max` -> 422
 * 5. price below `min` (when `min` is set) -> 422
 * 6. price not a whole multiple of `step` measured from `max` -> 422
 */
export const setBet = (uuid: string, price: number): SetBetResult => {
  const record = findRecord(uuid)
  if (!record) {
    return { ok: false, status: 404, body: notFoundProblem() }
  }

  const trading = record.detail.trading

  if (!trading.can_set_bet) {
    return {
      ok: false,
      status: 422,
      body: priceFieldProblem('Ставки по этому аукциону недоступны.', 'bet_not_allowed'),
    }
  }

  const { max, min, step } = trading.price ?? {}

  if (price <= 0) {
    return { ok: false, status: 422, body: priceFieldProblem('Цена должна быть больше 0.', 'invalid_price') }
  }

  if (typeof max === 'number' && price > max) {
    return {
      ok: false,
      status: 422,
      body: priceFieldProblem(`Цена не может быть больше ${String(max)}.`, 'price_too_high'),
    }
  }

  if (typeof min === 'number' && price < min) {
    return {
      ok: false,
      status: 422,
      body: priceFieldProblem(`Цена не может быть меньше ${String(min)}.`, 'price_too_low'),
    }
  }

  if (typeof max === 'number' && typeof step === 'number' && !isOnStep(price, max, step)) {
    return {
      ok: false,
      status: 422,
      body: priceFieldProblem(`Цена должна быть кратна шагу ${String(step)} (считая от максимальной цены).`, 'invalid_step'),
    }
  }

  applyAcceptedBet(record, price)

  return { ok: true }
}

export const getAuction = (uuid: string): AuctionShowResponse | null => {
  const record = findRecord(uuid)
  return record ? structuredClone(record.detail) : null
}

export const listBets = (uuid: string, all?: boolean): BetListResponse | null => {
  const record = findRecord(uuid)
  if (!record) {
    return null
  }

  if (record.detail.hide_bets_history) {
    return { bets: [] }
  }

  const bets = all ? record.bets : record.bets.filter((bet) => !bet.is_rejected)
  return { bets: structuredClone(bets) }
}

const citiesMatch = (candidate: string | undefined, filter: string | undefined): boolean => {
  if (!filter) return true
  if (!candidate) return false
  return candidate.localeCompare(filter, 'ru', { sensitivity: 'base' }) === 0
}

const dateWithinRange = (date: string | undefined, from: string | undefined, to: string | undefined): boolean => {
  if (!from && !to) return true
  if (!date) return false

  const time = Date.parse(date)
  if (Number.isNaN(time)) return false
  if (from && time < Date.parse(from)) return false
  if (to && time > Date.parse(to)) return false
  return true
}

const matchesFilters = (item: AuctionListItem, filters: AuctionListRequest): boolean => {
  if (filters.cargo_num && item.main?.cargo_num !== filters.cargo_num) {
    return false
  }

  if (filters.auc_type?.length) {
    const aucType = item.main?.auc_type
    if (!aucType || aucType === 'Unknown' || !filters.auc_type.includes(aucType)) {
      return false
    }
  }

  if (filters.status?.length) {
    const statusMobile = item.trading?.status_mobile
    if (!statusMobile || !filters.status.includes(statusMobile)) {
      return false
    }
  }

  if (filters.statuses?.length) {
    const code = item.trading?.status ? getAuctionStatusCode(item.trading.status) : undefined
    if (code === undefined || !filters.statuses.includes(code)) {
      return false
    }
  }

  if (!citiesMatch(item.route?.load?.city, filters.load_city)) {
    return false
  }

  if (!citiesMatch(item.route?.unload?.city, filters.unload_city)) {
    return false
  }

  if (!dateWithinRange(item.route?.load?.date, filters.load_date_from, filters.load_date_to)) {
    return false
  }

  if (filters.is_available !== undefined && item.trading?.is_available !== filters.is_available) {
    return false
  }

  if (filters.is_bidder !== undefined && item.trading?.is_bidder !== filters.is_bidder) {
    return false
  }

  const currentPrice = item.trading?.price?.current
  if (filters.current_price_from !== undefined && filters.current_price_from !== null) {
    if (currentPrice === undefined || currentPrice < filters.current_price_from) {
      return false
    }
  }

  if (filters.current_price_to !== undefined && filters.current_price_to !== null) {
    if (currentPrice === undefined || currentPrice > filters.current_price_to) {
      return false
    }
  }

  return true
}

const buildMeta = (total: number, currentPage: number, perPage: number): AuctionListMeta => {
  const lastPage = total === 0 ? 1 : Math.max(1, Math.ceil(total / perPage))
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const to = total === 0 ? 0 : Math.min(currentPage * perPage, total)

  return { current_page: currentPage, from, last_page: lastPage, per_page: perPage, to, total }
}

export const listAuctions = (body: AuctionListRequest): AuctionListResponseBase => {
  const perPage = body.per_page && body.per_page > 0 ? body.per_page : 20
  const requestedPage = body.page && body.page > 0 ? body.page : 1

  const filtered = auctions.filter((record) => matchesFilters(record.listItem, body))
  const lastPage = filtered.length === 0 ? 1 : Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(Math.max(requestedPage, 1), lastPage)

  const start = (currentPage - 1) * perPage
  const data = filtered.slice(start, start + perPage).map((record) => structuredClone(record.listItem))

  return { data, meta: buildMeta(filtered.length, currentPage, perPage) }
}
