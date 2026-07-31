import type { components } from '@/shared/api/types/openapi'
import type {
  AuctionDetailCargoVm,
  AuctionDetailContactVm,
  AuctionDetailMainVm,
  AuctionDetailOrganizerVm,
  AuctionDetailPaymentVm,
  AuctionDetailRoutePointVm,
  AuctionDetailTradingVm,
  AuctionDetailVm,
  AuctionDetailYourVm,
} from './auction-detail.vm'

type AuctionShowResponse = components['schemas']['AuctionShowResponse']
type Contact = components['schemas']['Contact']
type RoutePoint = components['schemas']['RoutePoint']
type CarRequirements = components['schemas']['CarRequirements']
type AuctionShowTradingPrice = components['schemas']['AuctionShowTradingPrice']
type AuctionShowTradingYour = components['schemas']['AuctionShowTradingYour']

const mapMain = (main: AuctionShowResponse['main']): AuctionDetailMainVm => ({
  id: main.id ?? null,
  auctionUuid: main.order_uid ?? null,
  cargoNum: main.cargo_num ?? null,
  cargoDate: main.cargo_date ?? null,
  aucType: main.auc_type ?? null,
  createdAt: main.created_at ?? null,
})

const mapOrganizer = (organizer: AuctionShowResponse['organizer']): AuctionDetailOrganizerVm => ({
  organizationName: organizer.organization_name ?? null,
  organizationInn: organizer.organization_inn ?? null,
  organizationKpp: organizer.organization_kpp ?? null,
})

const mapContact = (contact: Contact): AuctionDetailContactVm => ({
  name: contact.name ?? null,
  phone: contact.phone ?? null,
  workPhone: contact.work_phone ?? null,
  email: contact.email ?? null,
})

const mapRoutePoint = (point: RoutePoint): AuctionDetailRoutePointVm => ({
  rowNum: point.row_num ?? null,
  opType: point.op_type ?? null,
  startDate: point.start_date ?? null,
  endDate: point.end_date ?? null,
  comment: point.comment ?? null,
  city: point.location?.city_name ?? null,
  address: point.location?.loading_address ?? null,
  contactName: point.contact?.name ?? null,
  contactPhone: point.contact?.phone ?? null,
})

const mapCarRequirements = (car: CarRequirements | undefined): AuctionDetailCargoVm['car'] => {
  if (!car) return null

  return {
    type: car.type ?? null,
    weight: car.weight ?? null,
    volume: car.volume ?? null,
    width: car.width ?? null,
    length: car.length ?? null,
    height: car.height ?? null,
  }
}

const mapCargo = (cargo: AuctionShowResponse['cargo']): AuctionDetailCargoVm => ({
  price: cargo.price ?? null,
  currency: cargo.currency ?? null,
  isInternational: cargo.is_international ?? false,
  distance: cargo.distance ?? null,
  truckCount: cargo.truck_count ?? null,
  bodyType: cargo.body_type ?? null,
  containered: cargo.containered ?? false,
  car: mapCarRequirements(cargo.car),
})

const mapPayment = (payment: AuctionShowResponse['payment']): AuctionDetailPaymentVm => ({
  condition: payment.condition ?? null,
  conditionPredefined: payment.condition_predefined ?? null,
  form: payment.form ?? null,
  delay: payment.delay ?? null,
  delayType: payment.delay_type ?? null,
  currencyCode: payment.currency_code ?? null,
  prepay: payment.prepay ?? null,
})

const mapTradingPrice = (price: AuctionShowTradingPrice | undefined): AuctionDetailTradingVm['price'] => ({
  start: price?.start ?? null,
  startNoVat: price?.start_no_vat ?? null,
  current: price?.current ?? null,
  currentNoVat: price?.current_no_vat ?? null,
  available: price?.available ?? null,
  availableNoVat: price?.available_no_vat ?? null,
  min: price?.min ?? null,
  minNoVat: price?.min_no_vat ?? null,
  max: price?.max ?? null,
  maxNoVat: price?.max_no_vat ?? null,
  step: price?.step ?? null,
  stepNoVat: price?.step_no_vat ?? null,
  pricePerKm: price?.price_per_km ?? null,
})

const mapYour = (your: AuctionShowTradingYour | undefined): AuctionDetailYourVm => ({
  bet: your?.bet ?? false,
  lastBet: your?.last_bet ?? null,
  lastBetWithVat: your?.last_bet_with_vat ?? null,
  win: your?.win ?? false,
})

const mapTrading = (trading: AuctionShowResponse['trading']): AuctionDetailTradingVm => ({
  status: trading.status ?? null,
  statusMobile: trading.status_mobile ?? null,
  startTime: trading.start_time ?? null,
  stopTime: trading.stop_time ?? null,
  bidMeasurementType: trading.bid_measurement_type ?? null,
  allowCounterBets: trading.allow_counter_bets ?? false,
  isBidder: trading.is_bidder ?? false,
  price: mapTradingPrice(trading.price),
  your: mapYour(trading.your),
})

export const mapAuctionDetailDtoToVm = (dto: AuctionShowResponse): AuctionDetailVm => ({
  main: mapMain(dto.main),
  organizer: mapOrganizer(dto.organizer),
  contacts: dto.contacts.map(mapContact),
  routes: dto.routes.map(mapRoutePoint),
  cargo: mapCargo(dto.cargo),
  payment: mapPayment(dto.payment),
  trading: mapTrading(dto.trading),
  canSetBet: dto.trading.can_set_bet ?? false,
  hideBetsHistory: dto.hide_bets_history ?? dto.trading.hide_bets_history ?? false,
  hidePointsAddressAndContacts: dto.trading.hide_points_address_and_contacts ?? false,
  noViewCargoPrice: dto.trading.no_view_cargo_price ?? false,
})
