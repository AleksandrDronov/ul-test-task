/** Bridges `<input type="date">` (plain `YYYY-MM-DD`) and the ISO-with-offset strings the API/schema expect. */

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
