import {
  auctionsSearchParamsSchema,
  type AuctionsSearchParams,
} from './auctions-search-params.schema'
import { DEFAULT_AUCTIONS_LIST_SEARCH } from '@/shared/config'

/** Экспортируется, чтобы ссылки сбрасывающие список (например, логотип в шапке) переходили к тем же значениям по умолчанию. */
export const DEFAULT_SEARCH_PARAMS: AuctionsSearchParams = DEFAULT_AUCTIONS_LIST_SEARCH

export const parseAuctionsSearchParams = (input: Record<string, unknown>): AuctionsSearchParams => {
  try {
    const parsed = auctionsSearchParamsSchema.safeParse(input)
    if (parsed.success) {
      return parsed.data
    }
  } catch {
    // preprocess or schema edge cases must not escape the parser
  }

  return DEFAULT_SEARCH_PARAMS
}
