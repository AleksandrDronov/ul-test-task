import { format } from 'date-fns'

/** Связывает `<input type="date">` (формат `YYYY-MM-DD`) с ISO-строками с offset, которые ожидают API и схема. */

export const isoToDate = (iso: string | undefined): Date | undefined => {
  if (!iso) return undefined
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export const dateToIsoRangeStart = (date: Date | undefined): string | undefined => {
  if (!date) return undefined
  return dateInputValueToIsoRangeStart(format(date, 'yyyy-MM-dd'))
}

export const dateToIsoRangeEnd = (date: Date | undefined): string | undefined => {
  if (!date) return undefined
  return dateInputValueToIsoRangeEnd(format(date, 'yyyy-MM-dd'))
}

export const isoToDateInputValue = (iso: string | undefined): string => {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

export const dateInputValueToIsoRangeStart = (value: string): string | undefined => {
  if (!value) return undefined
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export const dateInputValueToIsoRangeEnd = (value: string): string | undefined => {
  if (!value) return undefined
  const date = new Date(`${value}T23:59:59.000Z`)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}
