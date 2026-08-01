import { getRouteApi } from '@tanstack/react-router'
import type { AuctionsSearchParams } from './auctions-search-params.schema'

const routeApi = getRouteApi('/')

export type AuctionsFilterPatch = Partial<Omit<AuctionsSearchParams, 'page' | 'per_page'>>

/**
 * Синхронизирует фильтры списка аукционов с URL (search-параметры маршрута `/`).
 * Единственный источник правды для значений фильтров — адресная строка.
 *
 * @returns Текущие фильтры и действия для их изменения через навигацию.
 */
export const useAuctionsFilters = (): {
  /** Актуальные search-параметры списка аукционов. */
  filters: AuctionsSearchParams
  /** Применяет патч к фильтрам и сбрасывает страницу на первую. */
  setFilters: (patch: AuctionsFilterPatch) => void
  /** Переключает страницу, сохраняя остальные фильтры. */
  setPage: (page: number) => void
  /** Сбрасывает все фильтры, оставляя только `per_page`, и возвращает на первую страницу. */
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
