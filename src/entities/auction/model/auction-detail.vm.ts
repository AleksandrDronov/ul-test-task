import type { components } from '@/shared/api/types/openapi'

type AuctionType = components['schemas']['AuctionType']
type AuctionStatus = components['schemas']['AuctionStatus']
type TradingStatus = components['schemas']['TradingStatus']
type BidMeasurementType = components['schemas']['BidMeasurementType']
type OperationType = components['schemas']['OperationType']
type PaymentDelayType = components['schemas']['PaymentDelayType']

export type AuctionDetailMainVm = {
  id: number | null
  auctionUuid: string | null
  cargoNum: string | null
  cargoDate: string | null
  aucType: AuctionType | null
  createdAt: string | null
}

export type AuctionDetailOrganizerVm = {
  organizationName: string | null
  organizationInn: string | null
  organizationKpp: string | null
}

export type AuctionDetailContactVm = {
  name: string | null
  phone: string | null
  workPhone: string | null
  email: string | null
}

export type AuctionDetailRoutePointVm = {
  rowNum: number | null
  opType: OperationType | null
  startDate: string | null
  endDate: string | null
  comment: string | null
  city: string | null
  address: string | null
  contactName: string | null
  contactPhone: string | null
}

export type AuctionDetailCarRequirementsVm = {
  type: string | null
  weight: number | null
  volume: number | null
  width: number | null
  length: number | null
  height: number | null
}

export type AuctionDetailCargoVm = {
  price: string | null
  currency: number | null
  isInternational: boolean
  distance: number | null
  truckCount: number | null
  bodyType: string | null
  containered: boolean
  car: AuctionDetailCarRequirementsVm | null
}

export type AuctionDetailPaymentVm = {
  condition: string | null
  conditionPredefined: string | null
  form: string | null
  delay: number | null
  delayType: PaymentDelayType | null
  currencyCode: string | null
  prepay: string | null
}

export type AuctionDetailTradingPriceVm = {
  start: number | null
  startNoVat: number | null
  current: number | null
  currentNoVat: number | null
  available: number | null
  availableNoVat: number | null
  min: number | null
  minNoVat: number | null
  max: number | null
  maxNoVat: number | null
  step: number | null
  stepNoVat: number | null
  pricePerKm: number | null
}

export type AuctionDetailYourVm = {
  bet: boolean
  lastBet: number | null
  lastBetWithVat: number | null
  win: boolean
}

export type AuctionDetailAdmittedOrganizationVm = {
  id: number | null
  name: string | null
  fullName: string | null
  inn: string | null
  isMain: boolean
}

export type AuctionDetailTradingVm = {
  status: AuctionStatus | null
  statusMobile: TradingStatus | null
  startTime: string | null
  stopTime: string | null
  bidMeasurementType: BidMeasurementType | null
  allowCounterBets: boolean
  isBidder: boolean
  price: AuctionDetailTradingPriceVm
  your: AuctionDetailYourVm
}

export type AuctionDetailVm = {
  main: AuctionDetailMainVm
  organizer: AuctionDetailOrganizerVm
  contacts: AuctionDetailContactVm[]
  routes: AuctionDetailRoutePointVm[]
  cargo: AuctionDetailCargoVm
  payment: AuctionDetailPaymentVm
  trading: AuctionDetailTradingVm
  admittedOrganizations: AuctionDetailAdmittedOrganizationVm[]
  canSetBet: boolean
  hideBetsHistory: boolean
  hidePointsAddressAndContacts: boolean
  noViewCargoPrice: boolean
}
