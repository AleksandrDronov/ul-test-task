import { expectTypeOf, test } from 'vitest'
import type { AuctionsSearchParams } from '@/features/filter-auctions'
import { DEFAULT_SEARCH_PARAMS } from '@/features/filter-auctions'

test('DEFAULT_SEARCH_PARAMS types', () => {
  expectTypeOf(DEFAULT_SEARCH_PARAMS).toEqualTypeOf<AuctionsSearchParams>()
})
