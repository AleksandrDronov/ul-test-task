import type { components } from '@/shared/api/types/openapi'

type AuctionStatus = components['schemas']['AuctionStatus']
type TradingStatus = components['schemas']['TradingStatus']
type AuctionType = components['schemas']['AuctionType']
type OperationType = components['schemas']['OperationType']
type BidMeasurementType = components['schemas']['BidMeasurementType']
type PaymentDelayType = NonNullable<components['schemas']['PaymentDelayType']>

/** Presentation-only Russian labels for enum values. Never used for filtering/business logic. */
export const AUCTION_STATUS_RU_LABEL: Record<AuctionStatus, string> = {
  Planning: 'Планирование',
  Auction: 'Торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'Выполняется',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
}

export const TRADING_STATUS_RU_LABEL: Record<TradingStatus, string> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Проигрываю',
  OnPending: 'На рассмотрении',
  Confirmed: 'Подтверждено',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принято',
  Unknown: 'Неизвестно',
}

export const AUCTION_TYPE_RU_LABEL: Record<AuctionType, string> = {
  Request: 'Заявка',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фиксированная цена',
  Unknown: 'Неизвестно',
}

export const OPERATION_TYPE_RU_LABEL: Record<OperationType, string> = {
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
  Unknown: 'Неизвестно',
}

export const BID_MEASUREMENT_TYPE_RU_LABEL: Record<BidMeasurementType, string> = {
  PerRoute: 'за рейс',
  PerKm: 'за км',
  Unknown: '—',
}

export const PAYMENT_DELAY_TYPE_RU_LABEL: Record<PaymentDelayType, string> = {
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Unknown: '—',
}
