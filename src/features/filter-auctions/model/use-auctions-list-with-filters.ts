import { useAuctionsListQuery } from '@/entities/auction'
import { buildAuctionListRequest } from './build-auction-list-request'
import { useAuctionsFilters } from './use-auctions-filters'

/**
 * Оркестрирует фильтры из URL и запрос списка аукционов.
 * Страница списка не собирает `AuctionListRequest` вручную.
 */
export const useAuctionsListWithFilters = () => {
  const filtersApi = useAuctionsFilters()
  const query = useAuctionsListQuery(buildAuctionListRequest(filtersApi.filters))

  return { ...filtersApi, query }
}
