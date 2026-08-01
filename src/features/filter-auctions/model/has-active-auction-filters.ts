import type { AuctionsSearchParams } from './auctions-search-params.schema'

const isActiveFilterValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  if (typeof value === 'string' && value === '') return false
  if (Array.isArray(value) && value.length === 0) return false

  return true
}

/** Есть ли в search-параметрах хотя бы один активный фильтр (кроме page и per_page). */
export const hasActiveAuctionFilters = (filters: AuctionsSearchParams): boolean => {
  const filterFields = Object.fromEntries(
    Object.entries(filters).filter(([key]) => key !== 'page' && key !== 'per_page'),
  )

  return Object.values(filterFields).some(isActiveFilterValue)
}
