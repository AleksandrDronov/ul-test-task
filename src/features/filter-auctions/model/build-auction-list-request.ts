import type { components } from '@/shared/api'
import type { AuctionsSearchParams } from './auctions-search-params.schema'

type AuctionListRequest = components['schemas']['AuctionListRequest']

/**
 * Собирает тело запроса списка аукционов из search-параметров маршрута.
 * В запрос попадают только заданные фильтры: пустые массивы и `undefined` опускаются.
 *
 * @param params — валидированные search-параметры страницы списка аукционов.
 * @returns Объект `AuctionListRequest` для API.
 */
export const buildAuctionListRequest = (
  params: AuctionsSearchParams,
): AuctionListRequest => {
  const body: AuctionListRequest = {
    page: params.page,
    per_page: params.per_page,
  }

  if (params.cargo_num) body.cargo_num = params.cargo_num
  if (params.status?.length) body.status = params.status
  if (params.statuses?.length) body.statuses = params.statuses
  if (params.auc_type?.length) body.auc_type = params.auc_type
  if (params.load_city) body.load_city = params.load_city
  if (params.unload_city) body.unload_city = params.unload_city
  if (params.load_date_from) body.load_date_from = params.load_date_from
  if (params.load_date_to) body.load_date_to = params.load_date_to
  if (params.is_available !== undefined) body.is_available = params.is_available
  if (params.is_bidder !== undefined) body.is_bidder = params.is_bidder
  if (params.current_price_from !== undefined) body.current_price_from = params.current_price_from
  if (params.current_price_to !== undefined) body.current_price_to = params.current_price_to

  return body
}
