const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const NUMBER_FORMATTER = new Intl.NumberFormat('ru-RU')

const EMPTY_VALUE_PLACEHOLDER = '—'

const parseDate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDate = (value: string | null | undefined): string => {
  const date = parseDate(value)
  return date ? DATE_FORMATTER.format(date) : EMPTY_VALUE_PLACEHOLDER
}

export const formatDateTime = (value: string | null | undefined): string => {
  const date = parseDate(value)
  return date ? DATE_TIME_FORMATTER.format(date) : EMPTY_VALUE_PLACEHOLDER
}

export const formatNumber = (value: number | null | undefined): string =>
  value === null || value === undefined ? EMPTY_VALUE_PLACEHOLDER : NUMBER_FORMATTER.format(value)

/** В ViewModel на уровне торговой цены нет кода валюты, поэтому суммы отображаются в рублях (₽). */
export const formatPrice = (value: number | null | undefined): string =>
  value === null || value === undefined ? EMPTY_VALUE_PLACEHOLDER : `${NUMBER_FORMATTER.format(value)} ₽`

export const formatPricePerKm = (value: number | null | undefined): string =>
  value === null || value === undefined ? EMPTY_VALUE_PLACEHOLDER : `${NUMBER_FORMATTER.format(value)} ₽/км`

export const formatYesNo = (value: boolean): string => (value ? 'Да' : 'Нет')
