import { getRouteApi } from '@tanstack/react-router'
import type { AuctionsSearchParams } from './auctions-search-params.schema'

const routeApi = getRouteApi('/')

export type AuctionsFilterPatch = Partial<Omit<AuctionsSearchParams, 'page' | 'per_page'>>

/**
 * URL — единственный источник правды для значений фильтров (разрешение #1).
 * Изменение любого фильтра сбрасывает страницу на 1; `setPage` — единственный способ
 * менять `page` без затрагивания остальных фильтров.
 */
export const useAuctionsFilters = (): {
  filters: AuctionsSearchParams
  setFilters: (patch: AuctionsFilterPatch) => void
  setPage: (page: number) => void
  resetFilters: () => void
} => {
  const filters: AuctionsSearchParams = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const setFilters = (patch: AuctionsFilterPatch): void => {
    void navigate({
      search: { ...filters, ...patch, page: 1 },
    })
  }

  const setPage = (page: number): void => {
    void navigate({ search: { ...filters, page } })
  }

  const resetFilters = (): void => {
    void navigate({ search: { page: 1, per_page: filters.per_page } })
  }

  return { filters, setFilters, setPage, resetFilters }
}
