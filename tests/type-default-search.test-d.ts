import { expectTypeOf, test } from 'vitest'
import type { AuctionsSearchParams } from '@/features/filter-auctions/model/auctions-search-params.schema'
import { DEFAULT_SEARCH_PARAMS } from '@/features/filter-auctions/model/parse-auctions-search-params'

test('DEFAULT_SEARCH_PARAMS types', () => {
  expectTypeOf(DEFAULT_SEARCH_PARAMS).toEqualTypeOf<AuctionsSearchParams>()
})
