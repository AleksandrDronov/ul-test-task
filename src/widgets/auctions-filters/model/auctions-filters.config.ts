import { AUC_TYPE_VALUES, TRADING_STATUS_VALUES } from '@/features/filter-auctions'
import { AUCTION_STATUS_LABEL_BY_CODE, isAuctionStatusCode } from '@/shared/config'
import {
  AUCTION_STATUS_RU_LABEL,
  AUCTION_TYPE_RU_LABEL,
  TRADING_STATUS_RU_LABEL,
} from '@/shared/config'
import { type CheckboxFilterOption } from '../ui/CheckboxFilterFieldset'

/** Выводится из экспортированной константы (не из `openapi.d.ts`), чтобы виджеты не импортировали DTO-типы напрямую. */
type TradingStatus = (typeof TRADING_STATUS_VALUES)[number]

export type CheckboxFilterFieldKey = 'statuses' | 'status' | 'auc_type'

export type CheckboxFilterFieldsetConfig = {
  key: CheckboxFilterFieldKey
  legend: string
  idPrefix: string
  options: CheckboxFilterOption<string | number>[]
}

export const CHECKBOX_FILTER_FIELDSETS: CheckboxFilterFieldsetConfig[] = [
  {
    key: 'statuses',
    legend: 'Статус аукциона',
    idPrefix: 'auction-status',
    options: Object.entries(AUCTION_STATUS_LABEL_BY_CODE)
      .map(([code, label]) => ({
        value: Number(code),
        label: AUCTION_STATUS_RU_LABEL[label],
      }))
      .filter((option) => isAuctionStatusCode(option.value)),
  },
  {
    key: 'status',
    legend: 'Статус участия',
    idPrefix: 'trading-status',
    options: TRADING_STATUS_VALUES.filter(
      (value): value is TradingStatus => value !== 'Unknown',
    ).map((value) => ({ value, label: TRADING_STATUS_RU_LABEL[value] })),
  },
  {
    key: 'auc_type',
    legend: 'Тип аукциона',
    idPrefix: 'auc-type',
    options: AUC_TYPE_VALUES.map((value) => ({
      value,
      label: AUCTION_TYPE_RU_LABEL[value],
    })),
  },
]

export type CityFilterFieldKey = 'load_city' | 'unload_city'

export type CityFilterSelectConfig = {
  key: CityFilterFieldKey
  label: string
}

export const CITY_FILTER_SELECTS: CityFilterSelectConfig[] = [
  { key: 'load_city', label: 'Город погрузки' },
  { key: 'unload_city', label: 'Город выгрузки' },
]

export type DateRangeFilterFieldKey = 'load_date_from' | 'load_date_to'

export type DateRangeFilterConfig = {
  key: string
  fromKey: DateRangeFilterFieldKey
  toKey: DateRangeFilterFieldKey
  fromLabel: string
  toLabel: string
}

export const DATE_RANGE_FILTERS: DateRangeFilterConfig[] = [
  {
    key: 'load-date',
    fromKey: 'load_date_from',
    toKey: 'load_date_to',
    fromLabel: 'Погрузка с',
    toLabel: 'Погрузка по',
  },
]

export type NumberRangeFilterFieldKey = 'current_price_from' | 'current_price_to'

export type NumberRangeFilterConfig = {
  key: string
  fromKey: NumberRangeFilterFieldKey
  toKey: NumberRangeFilterFieldKey
  fromLabel: string
  toLabel: string
}

export const NUMBER_RANGE_FILTERS: NumberRangeFilterConfig[] = [
  {
    key: 'current-price',
    fromKey: 'current_price_from',
    toKey: 'current_price_to',
    fromLabel: 'Цена от',
    toLabel: 'Цена до',
  },
]

export type BooleanFilterFieldKey = 'is_available' | 'is_bidder'

export type BooleanFilterOptionConfig = {
  key: BooleanFilterFieldKey
  label: string
}

export const BOOLEAN_FILTER_OPTIONS: BooleanFilterOptionConfig[] = [
  { key: 'is_available', label: 'Только доступные для ставки' },
  { key: 'is_bidder', label: 'Только с моими ставками' },
]
