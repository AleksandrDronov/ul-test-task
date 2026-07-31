import {
  auctionsSearchParamsSchema,
  type AuctionsSearchParams,
} from './auctions-search-params.schema'

const DEFAULT_SEARCH_PARAMS: AuctionsSearchParams = {
  page: 1,
  per_page: 20,
}

export const parseAuctionsSearchParams = (
  input: Record<string, unknown>,
): AuctionsSearchParams => {
  const parsed = auctionsSearchParamsSchema.safeParse(input)
  if (parsed.success) {
    return parsed.data
  }

  return DEFAULT_SEARCH_PARAMS
}
