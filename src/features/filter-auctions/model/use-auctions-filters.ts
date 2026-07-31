import { getRouteApi } from '@tanstack/react-router'
import type { AuctionsSearchParams } from './auctions-search-params.schema'

const routeApi = getRouteApi('/')

export type AuctionsFilterPatch = Partial<Omit<AuctionsSearchParams, 'page' | 'per_page'>>

/**
 * The URL is the single source of truth for filter values (resolution #1).
 * Changing any filter resets the page to 1; `setPage` is the only way to
 * move `page` without touching the rest of the filters.
 */
export const useAuctionsFilters = () => {
  const filters = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const setFilters = (patch: AuctionsFilterPatch): void => {
    void navigate({
      search: (prev) => ({ ...prev, ...patch, page: 1 }),
    })
  }

  const setPage = (page: number): void => {
    void navigate({ search: (prev) => ({ ...prev, page }) })
  }

  const resetFilters = (): void => {
    void navigate({ search: { page: 1, per_page: filters.per_page } })
  }

  return { filters, setFilters, setPage, resetFilters }
}
