import { queryOptions, useQuery } from '@tanstack/react-query'
import { betQueryKeys } from './bet.query-keys'
import { mapBetListToVm } from '../model'
import { fetchAuctionBets } from './bet.api'

type AuctionBetsQueryOptions = {
  enabled?: boolean
}

/**
 * Экспортируется как reusable options (не только хук), чтобы prefetch и loader
 * могли вызвать `queryClient.prefetchQuery(auctionBetsQueryOptions(uuid))`
 * с тем же key/fetcher, что использует `useQuery` на странице истории ставок.
 *
 * Ответ API маппится в `BetListVm` через `select`.
 *
 * @param auctionUuid — UUID аукциона.
 * @param all — если `true`, запрашивает полный список ставок (`?all=true`).
 * @param options — дополнительные настройки запроса (например, `enabled` для отложенной загрузки).
 */
export const auctionBetsQueryOptions = (
  auctionUuid: string,
  all?: boolean,
  options?: AuctionBetsQueryOptions,
) =>
  queryOptions({
    queryKey: betQueryKeys.list(auctionUuid, all),
    queryFn: () => fetchAuctionBets(auctionUuid, all),
    select: (data) => mapBetListToVm(data.bets),
    enabled: options?.enabled,
  })

/**
 * React Query-хук для загрузки списка ставок аукциона.
 *
 * @param auctionUuid — UUID аукциона.
 * @param all — если `true`, запрашивает полный список ставок (`?all=true`).
 * @param options — дополнительные настройки запроса (например, `enabled` для отложенной загрузки).
 * @returns Результат `useQuery` с данными типа `BetListVm`.
 */
export const useAuctionBetsQuery = (
  auctionUuid: string,
  all?: boolean,
  options?: AuctionBetsQueryOptions,
) => useQuery(auctionBetsQueryOptions(auctionUuid, all, options))
