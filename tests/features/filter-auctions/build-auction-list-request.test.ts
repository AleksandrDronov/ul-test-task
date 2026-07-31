import { describe, expect, it } from 'vitest'
import { buildAuctionListRequest } from '@/features/filter-auctions'

describe('buildAuctionListRequest', () => {
  it('maps search params to OpenAPI request body', () => {
    expect(buildAuctionListRequest({
      page: 2,
      per_page: 10,
      cargo_num: '0001',
      status: ['Leading'],
      statuses: [2],
      auc_type: ['Down'],
      load_city: 'Пермь',
      unload_city: 'Москва',
      load_date_from: '2026-05-26T00:00:00+03:00',
      load_date_to: '2026-05-27T00:00:00+03:00',
      is_available: true,
      is_bidder: false,
      current_price_from: 1000,
      current_price_to: 50000,
    })).toEqual({
      page: 2,
      per_page: 10,
      cargo_num: '0001',
      status: ['Leading'],
      statuses: [2],
      auc_type: ['Down'],
      load_city: 'Пермь',
      unload_city: 'Москва',
      load_date_from: '2026-05-26T00:00:00+03:00',
      load_date_to: '2026-05-27T00:00:00+03:00',
      is_available: true,
      is_bidder: false,
      current_price_from: 1000,
      current_price_to: 50000,
    })
  })

  it('omits empty optional fields', () => {
    const result = buildAuctionListRequest({ page: 1, per_page: 20 })

    expect(result).toEqual({
      page: 1,
      per_page: 20,
    })
    expect(Object.keys(result).sort()).toEqual(['page', 'per_page'])
  })

  it('preserves false boolean filters', () => {
    const result = buildAuctionListRequest({
      page: 1,
      per_page: 20,
      is_available: false,
      is_bidder: false,
    })

    expect(result.is_available).toBe(false)
    expect(result.is_bidder).toBe(false)
  })

  it('preserves numeric zero filters', () => {
    const result = buildAuctionListRequest({
      page: 1,
      per_page: 20,
      current_price_from: 0,
      current_price_to: 0,
    })

    expect(result.current_price_from).toBe(0)
    expect(result.current_price_to).toBe(0)
  })
})
