import {
  auctionsSearchParamsSchema,
  type AuctionsSearchParams,
} from './auctions-search-params.schema'

/** Exported so links that reset the list (e.g. the header brand link) can navigate to the same defaults. */
export const DEFAULT_SEARCH_PARAMS: AuctionsSearchParams = {
  page: 1,
  per_page: 20,
}

export const parseAuctionsSearchParams = (
  input: Record<string, unknown>,
): AuctionsSearchParams => {
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
