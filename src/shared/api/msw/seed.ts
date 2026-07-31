import type { components } from '@/shared/api/types/openapi'
import { toListStatusMobile } from './list-status-mobile'
import type { AuctionRecord } from './store'

type AuctionShowMain = components['schemas']['AuctionShowMain']
type AuctionStatus = components['schemas']['AuctionStatus']
type AuctionType = components['schemas']['AuctionType']
type AuctionShowTradingPrice = components['schemas']['AuctionShowTradingPrice']
type AuctionListItemTradingPrice = components['schemas']['AuctionListItemTradingPrice']
type BetItem = components['schemas']['BetItem']
type RoutePoint = components['schemas']['RoutePoint']
type TradingStatus = components['schemas']['TradingStatus']

/** Общий организатор для всех seed-аукционов (один заказчик — «ЛИМ»). */
const ORGANIZER: components['schemas']['AuctionShowOrganizer'] = {
  subscriber_id: 98,
  subscriber_code: '12345',
  infobase_code: 'RU_Cargo_01',
  organization_name: 'ЛИМ',
  organization_inn: '7703769184',
  organization_kpp: '770301001',
  organization_id: 340,
}

const LIST_ORGANIZER: components['schemas']['AuctionListItemOrganizer'] = {
  subscriber_id: 98,
  organization_id: 340,
  organization_name: 'ЛИМ',
  organization_inn: '7703769184',
  organization_kpp: '770301001',
  is_hide_organization: false,
}

const CONTACTS: components['schemas']['Contact'][] = [
  {
    name: 'Иванова Мария',
    phone: '+79001112233',
    work_phone: null,
    uid: null,
    email: 'organizer@example.com',
  },
]

/**
 * Допущенные перевозчики для каждого seed-аукциона. `id: 14` — замоканный
 * текущий пользователь (разрешение task-5 #2); `id: 20` — конкурирующий перевозчик
 * для других ставок.
 */
const ADMITTED_ORGANIZATIONS: components['schemas']['AdmittedOrganization'][] = [
  {
    id: 14,
    inn: '9616244307',
    is_main: true,
    name: 'ООО Перевозчик',
    full_name: 'Общество с ограниченной ответственностью Перевозчик',
    site: null,
    subscriber_id: 13,
    subscriber_code: '54321',
    subscriber_role: null,
    infobase_code: 'RU_Cargo_01',
    infobase_address: null,
    nalog_key: null,
    hide_me: false,
    current_vat_rate: '20',
  },
  {
    id: 20,
    inn: '5000000000',
    is_main: false,
    name: 'ООО Логистика',
    full_name: 'Общество с ограниченной ответственностью Логистика',
    site: null,
    subscriber_id: 40,
    subscriber_code: '54322',
    subscriber_role: null,
    infobase_code: 'RU_Cargo_01',
    infobase_address: null,
    nalog_key: null,
    hide_me: false,
    current_vat_rate: '20',
  },
]

const PAYMENT: components['schemas']['AuctionShowPayment'] = {
  condition: 'По оригиналам накладных (ТН, ТТН, CMR)',
  condition_predefined: 'ПоОригиналамНакладных',
  form: 'Безналичная с НДС',
  delay: 15,
  delay_type: 'CalendarDays',
  currency_code: '643',
  prepay: '0',
}

const LIST_PAYMENT: components['schemas']['AuctionListItemPayment'] = {
  form: 'Безналичная с НДС',
  currency_code: '643',
}

const EMPTY_ASSEMBLY: components['schemas']['Assembly'] = { num: null, date: null }

const TRADING_SETTINGS: components['schemas']['AuctionShowTradingSettings'] = {
  prolong_after_bet: 10,
  winner_confirm: 1,
  winner_counter_mode: null,
  transmission_time_in: 24,
  coefficient: 10,
}

const buildRoutePoint = (params: {
  rowNum: number
  opType: components['schemas']['OperationType']
  cityName: string
  cityGcId: number
  address: string
  startDate: string
  endDate: string
  cargoName: string
  weight: number
  volume: number
}): RoutePoint => ({
  row_num: params.rowNum,
  op_type: params.opType,
  start_date: params.startDate,
  end_date: params.endDate,
  comment: null,
  contractor: '',
  contractor_inn: '',
  location: {
    city_name: params.cityName,
    city_full_name: `${params.cityName}, Россия`,
    city_gc_id: params.cityGcId,
    loading_address: params.address,
    lon: 0,
    lat: 0,
  },
  cargo: {
    name: params.cargoName,
    package_name: '',
    weight: params.weight.toFixed(3),
    volume: params.volume.toFixed(3),
    length: '0',
    width: '0',
    height: '0',
    oversized: false,
    package_amount: null,
  },
  contact: {
    name: '',
    phone: '',
  },
})

type BetSeed = {
  id: number
  createdAt: string
  organizationId: number
  organizationInn: string
  organizationName: string
  subscriberId: number
  contactName: string
  priceWithVat: number
  priceNoVat: number
  isRejected: boolean
  isWin: boolean
  place: number | null
  cancelReason?: string
}

const buildBet = (auctionId: number, seed: BetSeed): BetItem => ({
  id: seed.id,
  created_at: seed.createdAt,
  auction_id: auctionId,
  subscriber_id: seed.subscriberId,
  contact_name: seed.contactName,
  contact_phone: '',
  price_with_vat: seed.priceWithVat,
  price_no_vat: seed.priceNoVat,
  organization_id: seed.organizationId,
  organization_inn: seed.organizationInn,
  organization_name: seed.organizationName,
  transporter_comment: null,
  is_rejected: seed.isRejected,
  is_counter: false,
  place: seed.place,
  is_win: seed.isWin,
  run_number: 0,
  cancel_reason: seed.cancelReason ?? '',
  price_info: {
    price_with_vat: seed.priceWithVat,
    price_no_vat: seed.priceNoVat,
    payment_type: 'Безналичная с НДС',
    vat_rate: '20',
  },
})

type PriceSeed = {
  start: number
  startNoVat: number
  current: number
  currentNoVat: number
  available: number
  availableNoVat: number
  min: number
  minNoVat: number
  max: number
  maxNoVat: number
  step: number
  stepNoVat: number
  pricePerKm: number
}

const buildDetailPrice = (price: PriceSeed): AuctionShowTradingPrice => ({
  start: price.start,
  start_no_vat: price.startNoVat,
  current: price.current,
  current_no_vat: price.currentNoVat,
  available: price.available,
  available_no_vat: price.availableNoVat,
  min: price.min,
  min_no_vat: price.minNoVat,
  max: price.max,
  max_no_vat: price.maxNoVat,
  step: price.step,
  step_no_vat: price.stepNoVat,
  price_per_km: price.pricePerKm,
})

const buildListPrice = (price: PriceSeed): AuctionListItemTradingPrice => ({
  start: price.start,
  current: price.current,
  current_no_vat: price.currentNoVat,
})

type AuctionSeedConfig = {
  uuid: string
  id: number
  cargoNum: string
  aucType: AuctionType
  status: AuctionStatus
  statusMobile: TradingStatus
  createdAt: string
  cargoDate: string
  startTime: string
  stopTime: string
  canSetBet: boolean
  isAvailable: boolean
  isBidder: boolean
  isAccredited: boolean
  hideBetsHistory: boolean
  hidePointsAddressAndContacts: boolean
  noViewCargoPrice: boolean
  cargoName: string
  weight: number
  volume: number
  bodyType: string
  distance: number
  cargoPrice: string
  loadCity: string
  loadGcId: number
  loadAddress: string
  loadDate: string
  unloadCity: string
  unloadGcId: number
  unloadAddress: string
  unloadDate: string
  price: PriceSeed
  your: { bet: boolean; lastBet: number | null; win: boolean }
  bets: BetSeed[]
}

const buildAuction = (config: AuctionSeedConfig): AuctionRecord => {
  const main: AuctionShowMain = {
    id: config.id,
    cargo_num: config.cargoNum,
    cargo_date: config.cargoDate,
    order_uid: config.uuid,
    auc_type: config.aucType,
    created_at: config.createdAt,
  }

  const routes: RoutePoint[] = [
    buildRoutePoint({
      rowNum: 1,
      opType: 'Loading',
      cityName: config.loadCity,
      cityGcId: config.loadGcId,
      address: config.loadAddress,
      startDate: config.loadDate,
      endDate: config.loadDate,
      cargoName: config.cargoName,
      weight: config.weight,
      volume: config.volume,
    }),
    buildRoutePoint({
      rowNum: 2,
      opType: 'Unloading',
      cityName: config.unloadCity,
      cityGcId: config.unloadGcId,
      address: config.unloadAddress,
      startDate: config.unloadDate,
      endDate: config.unloadDate,
      cargoName: config.cargoName,
      weight: config.weight,
      volume: config.volume,
    }),
  ]

  const detail: AuctionRecord['detail'] = {
    main,
    organizer: ORGANIZER,
    contacts: CONTACTS,
    cargo: {
      price: config.cargoPrice,
      currency: 643,
      is_international: false,
      distance: config.distance,
      truck_count: 1,
      body_type: config.bodyType,
      temp_from: null,
      temp_to: null,
      conics: null,
      belts: null,
      adr: null,
      coupling: null,
      air_pass: null,
      low_loader: null,
      additional_load: null,
      containered: false,
      container_type: null,
      container_size: null,
      loading_types: { side: false, top: false, rear: true, full: false },
      docs: { tir: false, cmr: true, t1: false, med: false },
      car: { type: 'Тягач', weight: 20, volume: 82, width: 2.4, length: 13.6, height: 2.7 },
    },
    trading: {
      status: config.status,
      status_mobile: config.statusMobile,
      start_time: config.startTime,
      stop_time: config.stopTime,
      bid_measurement_type: 'PerRoute',
      can_set_bet: config.canSetBet,
      allow_counter_bets: true,
      hide_bets_history: config.hideBetsHistory,
      hide_places: false,
      no_view_cargo_price: config.noViewCargoPrice,
      hide_points_address_and_contacts: config.hidePointsAddressAndContacts,
      is_bidder: config.isBidder,
      is_favorite: false,
      is_last_bet_with_vat: config.your.bet ? true : null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      send_deal_before_load: false,
      chat_id: null,
      price: buildDetailPrice(config.price),
      your: {
        bet: config.your.bet,
        last_bet: config.your.lastBet,
        last_bet_with_vat: config.your.lastBet,
        win: config.your.win,
      },
      settings: TRADING_SETTINGS,
    },
    payment: PAYMENT,
    assembly: EMPTY_ASSEMBLY,
    routes,
    admitted_organizations: ADMITTED_ORGANIZATIONS,
    hide_bets_history: config.hideBetsHistory,
  }

  const listItem: AuctionRecord['listItem'] = {
    main: {
      id: config.id,
      cargo_num: config.cargoNum,
      cargo_date: config.cargoDate,
      auc_type: config.aucType,
      order_uid: config.uuid,
      created_at: config.createdAt,
      priority_sort: 0,
      is_assembly: false,
      price_per_km: config.price.pricePerKm,
    },
    organizer: LIST_ORGANIZER,
    route: {
      load: {
        city: config.loadCity,
        address: config.loadAddress,
        date: config.loadDate,
        city_gc_id: config.loadGcId,
        points_count: 1,
      },
      unload: {
        city: config.unloadCity,
        address: config.unloadAddress,
        date: config.unloadDate,
        city_gc_id: config.unloadGcId,
        points_count: 1,
      },
    },
    cargo: {
      name: config.cargoName,
      weight: config.weight,
      volume: config.volume,
      body_type: config.bodyType,
      truck_count: 1,
      is_cargo: true,
      is_international: false,
      containered: false,
    },
    trading: {
      status: config.status,
      status_mobile: toListStatusMobile(config.statusMobile),
      start_time: config.startTime,
      stop_time: config.stopTime,
      bid_measurement_type: 'PerRoute',
      can_set_bet: config.canSetBet,
      allow_counter_bets: true,
      hide_points_address_and_contacts: config.hidePointsAddressAndContacts,
      is_bidder: config.isBidder,
      is_available: config.isAvailable,
      is_accredited: config.isAccredited,
      is_favorite: false,
      price: buildListPrice(config.price),
      your: { bet: config.your.bet, last_bet: config.your.lastBet },
      red_bet_with_vat: false,
      red_bet_no_vat: false,
    },
    payment: LIST_PAYMENT,
  }

  const bets = config.bets.map((betSeed) => buildBet(config.id, betSeed))

  return { detail, listItem, bets }
}

const AUCTION_ACTIVE_WITH_BETS = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000501',
  id: 501,
  cargoNum: '00000000501',
  aucType: 'Down',
  status: 'Auction',
  statusMobile: 'NotParticipating',
  createdAt: '2026-07-25T09:00:00',
  cargoDate: '2026-07-25T09:00:00',
  startTime: '2026-08-01T10:00:00',
  stopTime: '2026-08-04T18:00:00',
  canSetBet: true,
  isAvailable: true,
  isBidder: false,
  isAccredited: true,
  hideBetsHistory: false,
  hidePointsAddressAndContacts: false,
  noViewCargoPrice: false,
  cargoName: 'Мороженое',
  weight: 5,
  volume: 30,
  bodyType: 'рефрижератор',
  distance: 1800,
  cargoPrice: '850000',
  loadCity: 'Пермь',
  loadGcId: 59,
  loadAddress: 'Транспортная 9',
  loadDate: '2026-08-05T09:00:00',
  unloadCity: 'Москва',
  unloadGcId: 100,
  unloadAddress: 'Складская 1',
  unloadDate: '2026-08-07T14:00:00',
  price: {
    start: 50000, startNoVat: 41666.67,
    current: 46000, currentNoVat: 38333.33,
    available: 45000, availableNoVat: 37500,
    min: 30000, minNoVat: 25000,
    max: 50000, maxNoVat: 41666.67,
    step: 1000, stepNoVat: 833.33,
    pricePerKm: 21.3,
  },
  your: { bet: false, lastBet: null, win: false },
  bets: [
    {
      id: 1,
      createdAt: '2026-07-26T10:00:00',
      organizationId: 20,
      organizationInn: '5000000000',
      organizationName: 'ООО Логистика',
      subscriberId: 40,
      contactName: 'Петров Пётр',
      priceWithVat: 48000,
      priceNoVat: 40000,
      isRejected: false,
      isWin: false,
      place: 2,
    },
    {
      id: 2,
      createdAt: '2026-07-26T11:00:00',
      organizationId: 21,
      organizationInn: '6000000000',
      organizationName: 'ООО Трансавто',
      subscriberId: 41,
      contactName: 'Сидоров Сидор',
      priceWithVat: 47000,
      priceNoVat: 39166.67,
      isRejected: true,
      isWin: false,
      place: null,
      cancelReason: 'Отклонена организатором',
    },
    {
      id: 3,
      createdAt: '2026-07-26T12:00:00',
      organizationId: 20,
      organizationInn: '5000000000',
      organizationName: 'ООО Логистика',
      subscriberId: 40,
      contactName: 'Петров Пётр',
      priceWithVat: 46000,
      priceNoVat: 38333.33,
      isRejected: false,
      isWin: false,
      place: 1,
    },
  ],
})

const AUCTION_USER_LEADING = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000502',
  id: 502,
  cargoNum: '00000000502',
  aucType: 'Down',
  status: 'Auction',
  statusMobile: 'Leading',
  createdAt: '2026-07-26T09:00:00',
  cargoDate: '2026-07-26T09:00:00',
  startTime: '2026-08-02T10:00:00',
  stopTime: '2026-08-05T18:00:00',
  canSetBet: true,
  isAvailable: true,
  isBidder: true,
  isAccredited: true,
  hideBetsHistory: false,
  hidePointsAddressAndContacts: false,
  noViewCargoPrice: false,
  cargoName: 'Металлопрокат',
  weight: 20,
  volume: 15,
  bodyType: 'бортовой',
  distance: 900,
  cargoPrice: '1200000',
  loadCity: 'Екатеринбург',
  loadGcId: 66,
  loadAddress: 'Заводская 5',
  unloadCity: 'Санкт-Петербург',
  loadDate: '2026-08-10T08:00:00',
  unloadGcId: 78,
  unloadAddress: 'Портовая 12',
  unloadDate: '2026-08-13T12:00:00',
  price: {
    start: 40000, startNoVat: 33333.33,
    current: 37000, currentNoVat: 30833.33,
    available: 36500, availableNoVat: 30416.67,
    min: 25000, minNoVat: 20833.33,
    max: 40000, maxNoVat: 33333.33,
    step: 500, stepNoVat: 416.67,
    pricePerKm: 34.26,
  },
  your: { bet: true, lastBet: 37000, win: false },
  bets: [
    {
      id: 1,
      createdAt: '2026-07-27T10:00:00',
      organizationId: 22,
      organizationInn: '7000000000',
      organizationName: 'ООО ТрансЛогистик',
      subscriberId: 42,
      contactName: 'Кузнецов Кузьма',
      priceWithVat: 38000,
      priceNoVat: 31666.67,
      isRejected: false,
      isWin: false,
      place: 2,
    },
    {
      id: 2,
      createdAt: '2026-07-27T11:00:00',
      organizationId: 14,
      organizationInn: '9616244307',
      organizationName: 'ООО Перевозчик',
      subscriberId: 13,
      contactName: 'Иванов Иван',
      priceWithVat: 37000,
      priceNoVat: 30833.33,
      isRejected: false,
      isWin: false,
      place: 1,
    },
  ],
})

const AUCTION_CANNOT_BID = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000504',
  id: 504,
  cargoNum: '00000000504',
  aucType: 'Down',
  status: 'Auction',
  statusMobile: 'NotParticipating',
  createdAt: '2026-07-22T09:00:00',
  cargoDate: '2026-07-22T09:00:00',
  startTime: '2026-08-03T10:00:00',
  stopTime: '2026-08-06T18:00:00',
  canSetBet: false,
  isAvailable: false,
  isBidder: false,
  isAccredited: false,
  hideBetsHistory: false,
  hidePointsAddressAndContacts: false,
  noViewCargoPrice: false,
  cargoName: 'Стройматериалы',
  weight: 18,
  volume: 40,
  bodyType: 'тентованный',
  distance: 1200,
  cargoPrice: '600000',
  loadCity: 'Новосибирск',
  loadGcId: 54,
  loadAddress: 'Промышленная 3',
  loadDate: '2026-08-08T09:00:00',
  unloadCity: 'Москва',
  unloadGcId: 100,
  unloadAddress: 'Логистическая 7',
  unloadDate: '2026-08-11T15:00:00',
  price: {
    start: 45000, startNoVat: 37500,
    current: 42000, currentNoVat: 35000,
    available: 41000, availableNoVat: 34166.67,
    min: 35000, minNoVat: 29166.67,
    max: 45000, maxNoVat: 37500,
    step: 1000, stepNoVat: 833.33,
    pricePerKm: 29.17,
  },
  your: { bet: false, lastBet: null, win: false },
  bets: [
    {
      id: 1,
      createdAt: '2026-07-23T10:00:00',
      organizationId: 23,
      organizationInn: '8000000000',
      organizationName: 'ООО Карго',
      subscriberId: 43,
      contactName: 'Волков Виктор',
      priceWithVat: 42000,
      priceNoVat: 35000,
      isRejected: false,
      isWin: false,
      place: 1,
    },
  ],
})

const AUCTION_HIDDEN_HISTORY = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000505',
  id: 505,
  cargoNum: '00000000505',
  aucType: 'Down',
  status: 'Auction',
  statusMobile: 'NotParticipating',
  createdAt: '2026-07-23T09:00:00',
  cargoDate: '2026-07-23T09:00:00',
  startTime: '2026-08-04T10:00:00',
  stopTime: '2026-08-07T18:00:00',
  canSetBet: true,
  isAvailable: true,
  isBidder: false,
  isAccredited: true,
  hideBetsHistory: true,
  hidePointsAddressAndContacts: false,
  noViewCargoPrice: false,
  cargoName: 'Электроника',
  weight: 3,
  volume: 10,
  bodyType: 'фургон',
  distance: 2000,
  cargoPrice: '2500000',
  loadCity: 'Казань',
  loadGcId: 16,
  loadAddress: 'Индустриальная 2',
  loadDate: '2026-08-09T09:00:00',
  unloadCity: 'Воронеж',
  unloadGcId: 36,
  unloadAddress: 'Центральная 11',
  unloadDate: '2026-08-12T14:00:00',
  price: {
    start: 60000, startNoVat: 50000,
    current: 56000, currentNoVat: 46666.67,
    available: 54000, availableNoVat: 45000,
    min: 40000, minNoVat: 33333.33,
    max: 60000, maxNoVat: 50000,
    step: 2000, stepNoVat: 1666.67,
    pricePerKm: 23.33,
  },
  your: { bet: false, lastBet: null, win: false },
  bets: [
    {
      id: 1,
      createdAt: '2026-07-24T10:00:00',
      organizationId: 24,
      organizationInn: '9000000000',
      organizationName: 'ООО ГрузПеревозки',
      subscriberId: 44,
      contactName: 'Морозов Максим',
      priceWithVat: 58000,
      priceNoVat: 48333.33,
      isRejected: false,
      isWin: false,
      place: 2,
    },
    {
      id: 2,
      createdAt: '2026-07-24T11:00:00',
      organizationId: 25,
      organizationInn: '1100000000',
      organizationName: 'ООО СтройТранс',
      subscriberId: 45,
      contactName: 'Соколов Семён',
      priceWithVat: 56000,
      priceNoVat: 46666.67,
      isRejected: false,
      isWin: false,
      place: 1,
    },
  ],
})

const AUCTION_EMPTY_BETS = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000506',
  id: 506,
  cargoNum: '00000000506',
  aucType: 'Down',
  status: 'Auction',
  statusMobile: 'NotParticipating',
  createdAt: '2026-07-27T09:00:00',
  cargoDate: '2026-07-27T09:00:00',
  startTime: '2026-08-06T10:00:00',
  stopTime: '2026-08-09T18:00:00',
  canSetBet: true,
  isAvailable: true,
  isBidder: false,
  isAccredited: true,
  hideBetsHistory: false,
  hidePointsAddressAndContacts: false,
  noViewCargoPrice: false,
  cargoName: 'Текстиль',
  weight: 8,
  volume: 25,
  bodyType: 'тентованный',
  distance: 1500,
  cargoPrice: '400000',
  loadCity: 'Краснодар',
  loadGcId: 23,
  loadAddress: 'Южная 4',
  loadDate: '2026-08-14T09:00:00',
  unloadCity: 'Москва',
  unloadGcId: 100,
  unloadAddress: 'Северная 8',
  unloadDate: '2026-08-16T15:00:00',
  price: {
    start: 35000, startNoVat: 29166.67,
    current: 35000, currentNoVat: 29166.67,
    available: 34000, availableNoVat: 28333.33,
    min: 20000, minNoVat: 16666.67,
    max: 35000, maxNoVat: 29166.67,
    step: 1000, stepNoVat: 833.33,
    pricePerKm: 19.44,
  },
  your: { bet: false, lastBet: null, win: false },
  bets: [],
})

const AUCTION_HIDDEN_POINTS_AND_PRICE = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000507',
  id: 507,
  cargoNum: '00000000507',
  aucType: 'Down',
  status: 'Auction',
  statusMobile: 'NotParticipating',
  createdAt: '2026-07-24T09:00:00',
  cargoDate: '2026-07-24T09:00:00',
  startTime: '2026-08-05T10:00:00',
  stopTime: '2026-08-08T18:00:00',
  canSetBet: true,
  isAvailable: true,
  isBidder: false,
  isAccredited: true,
  hideBetsHistory: false,
  hidePointsAddressAndContacts: true,
  noViewCargoPrice: true,
  cargoName: 'Бытовая техника',
  weight: 6,
  volume: 20,
  bodyType: 'фургон',
  distance: 1000,
  cargoPrice: '1800000',
  loadCity: 'Москва',
  loadGcId: 100,
  loadAddress: 'Складская 20',
  loadDate: '2026-08-11T09:00:00',
  unloadCity: 'Санкт-Петербург',
  unloadGcId: 78,
  unloadAddress: 'Портовая 3',
  unloadDate: '2026-08-13T14:00:00',
  price: {
    start: 48000, startNoVat: 40000,
    current: 46500, currentNoVat: 38750,
    available: 45000, availableNoVat: 37500,
    min: 32000, minNoVat: 26666.67,
    max: 48000, maxNoVat: 40000,
    step: 1500, stepNoVat: 1250,
    pricePerKm: 38.75,
  },
  your: { bet: false, lastBet: null, win: false },
  bets: [
    {
      id: 1,
      createdAt: '2026-07-25T10:00:00',
      organizationId: 26,
      organizationInn: '1200000000',
      organizationName: 'ООО ЛогистикПро',
      subscriberId: 46,
      contactName: 'Лебедев Лев',
      priceWithVat: 46500,
      priceNoVat: 38750,
      isRejected: false,
      isWin: false,
      place: 1,
    },
  ],
})

const AUCTION_PLANNING = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000508',
  id: 508,
  cargoNum: '00000000508',
  aucType: 'Down',
  status: 'Planning',
  statusMobile: 'NotParticipating',
  createdAt: '2026-07-29T09:00:00',
  cargoDate: '2026-07-29T09:00:00',
  startTime: '2026-08-15T10:00:00',
  stopTime: '2026-08-16T18:00:00',
  canSetBet: false,
  isAvailable: false,
  isBidder: false,
  isAccredited: true,
  hideBetsHistory: false,
  hidePointsAddressAndContacts: false,
  noViewCargoPrice: false,
  cargoName: 'Мебель',
  weight: 4,
  volume: 35,
  bodyType: 'тентованный',
  distance: 1600,
  cargoPrice: '900000',
  loadCity: 'Воронеж',
  loadGcId: 36,
  loadAddress: 'Заречная 6',
  loadDate: '2026-08-18T09:00:00',
  unloadCity: 'Екатеринбург',
  unloadGcId: 66,
  unloadAddress: 'Уральская 14',
  unloadDate: '2026-08-21T15:00:00',
  price: {
    start: 55000, startNoVat: 45833.33,
    current: 55000, currentNoVat: 45833.33,
    available: 52500, availableNoVat: 43750,
    min: 35000, minNoVat: 29166.67,
    max: 55000, maxNoVat: 45833.33,
    step: 2500, stepNoVat: 2083.33,
    pricePerKm: 28.65,
  },
  your: { bet: false, lastBet: null, win: false },
  bets: [],
})

const AUCTION_FINISHED_WINNER = buildAuction({
  uuid: '00000000-0000-4000-8000-000000000509',
  id: 509,
  cargoNum: '00000000509',
  aucType: 'Down',
  status: 'Finished',
  statusMobile: 'Winner',
  createdAt: '2026-07-08T09:00:00',
  cargoDate: '2026-07-08T09:00:00',
  startTime: '2026-07-10T10:00:00',
  stopTime: '2026-07-12T18:00:00',
  canSetBet: false,
  isAvailable: false,
  isBidder: true,
  isAccredited: true,
  hideBetsHistory: false,
  hidePointsAddressAndContacts: false,
  noViewCargoPrice: false,
  cargoName: 'Продукты питания',
  weight: 10,
  volume: 22,
  bodyType: 'рефрижератор',
  distance: 1100,
  cargoPrice: '700000',
  loadCity: 'Санкт-Петербург',
  loadGcId: 78,
  loadAddress: 'Невская 9',
  loadDate: '2026-07-14T09:00:00',
  unloadCity: 'Краснодар',
  unloadGcId: 23,
  unloadAddress: 'Кубанская 5',
  unloadDate: '2026-07-17T15:00:00',
  price: {
    start: 38000, startNoVat: 31666.67,
    current: 29000, currentNoVat: 24166.67,
    available: 28000, availableNoVat: 23333.33,
    min: 22000, minNoVat: 18333.33,
    max: 38000, maxNoVat: 31666.67,
    step: 1000, stepNoVat: 833.33,
    pricePerKm: 21.97,
  },
  your: { bet: true, lastBet: 29000, win: true },
  bets: [
    {
      id: 1,
      createdAt: '2026-07-11T10:00:00',
      organizationId: 27,
      organizationInn: '1300000000',
      organizationName: 'ООО Экспресс',
      subscriberId: 47,
      contactName: 'Новиков Никита',
      priceWithVat: 32000,
      priceNoVat: 26666.67,
      isRejected: false,
      isWin: false,
      place: 2,
    },
    {
      id: 2,
      createdAt: '2026-07-11T11:00:00',
      organizationId: 14,
      organizationInn: '9616244307',
      organizationName: 'ООО Перевозчик',
      subscriberId: 13,
      contactName: 'Иванов Иван',
      priceWithVat: 29000,
      priceNoVat: 24166.67,
      isRejected: false,
      isWin: true,
      place: 1,
    },
  ],
})

/**
 * Seed-аукционы покрывают (полный каталог — в отчёте task-5):
 * - 501: активный, можно ставить, есть ставки других перевозчиков (включая отклонённую)
 * - 502: пользователь уже держит лидирующую ставку
 * - 504: `can_set_bet: false`
 * - 505: `hide_bets_history: true`
 * - 506: ноль ставок (пустое состояние)
 * - 507: `hide_points_address_and_contacts` + `no_view_cargo_price`
 * - 508: статус Planning, торги ещё не открыты
 * - 509: завершён, пользователь — победитель
 *
 * uuid `...0503` намеренно не в seed: зарезервирован для триггера 503
 * в `handlers.ts`.
 */
export const SEED_AUCTIONS: AuctionRecord[] = [
  AUCTION_ACTIVE_WITH_BETS,
  AUCTION_USER_LEADING,
  AUCTION_CANNOT_BID,
  AUCTION_HIDDEN_HISTORY,
  AUCTION_EMPTY_BETS,
  AUCTION_HIDDEN_POINTS_AND_PRICE,
  AUCTION_PLANNING,
  AUCTION_FINISHED_WINNER,
]
