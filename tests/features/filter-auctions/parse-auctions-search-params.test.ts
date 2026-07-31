import { describe, expect, it } from 'vitest'
import { parseAuctionsSearchParams } from '@/features/filter-auctions/model/parse-auctions-search-params'

describe('parseAuctionsSearchParams', () => {
  it('falls back to defaults for empty input', () => {
    expect(parseAuctionsSearchParams({})).toEqual({
      page: 1,
      per_page: 20,
    })
  })

  it('parses known filters and drops invalid enum values', () => {
    const result = parseAuctionsSearchParams({
      page: '2',
      per_page: '10',
      cargo_num: '0001',
      status: ['Leading', 'Nope'],
      statuses: ['2', 'x'],
      auc_type: ['Down', 'Bad'],
      is_available: 'true',
      current_price_from: '1000',
    })

    expect(result.page).toBe(2)
    expect(result.per_page).toBe(10)
    expect(result.cargo_num).toBe('0001')
    expect(result.status).toEqual(['Leading'])
    expect(result.statuses).toEqual([2])
    expect(result.auc_type).toEqual(['Down'])
    expect(result.is_available).toBe(true)
    expect(result.current_price_from).toBe(1000)
  })

  it('clamps invalid page to 1', () => {
    expect(parseAuctionsSearchParams({ page: '-5' }).page).toBe(1)
  })

  it('parses comma-separated array filters from a single string', () => {
    const result = parseAuctionsSearchParams({
      status: 'Leading,Losing',
      auc_type: 'Down,Up',
    })

    expect(result.status).toEqual(['Leading', 'Losing'])
    expect(result.auc_type).toEqual(['Down', 'Up'])
  })

  it('clamps per_page to 1..100', () => {
    expect(parseAuctionsSearchParams({ per_page: '0' }).per_page).toBe(1)
    expect(parseAuctionsSearchParams({ per_page: '200' }).per_page).toBe(100)
  })

  it('ignores unknown search params', () => {
    const result = parseAuctionsSearchParams({
      page: '2',
      foo: 'bar',
    })

    expect(result).toEqual({ page: 2, per_page: 20 })
    expect(result).not.toHaveProperty('foo')
  })

  it('parses remaining untested filters', () => {
    const result = parseAuctionsSearchParams({
      load_city: ' Moscow ',
      unload_city: 'Saint Petersburg',
      load_date_from: '2026-01-15T10:30:00+03:00',
      load_date_to: '2026-02-20T18:00:00Z',
      is_bidder: 'false',
      current_price_from: '500',
      current_price_to: '1500.5',
    })

    expect(result.load_city).toBe('Moscow')
    expect(result.unload_city).toBe('Saint Petersburg')
    expect(result.load_date_from).toBe('2026-01-15T10:30:00+03:00')
    expect(result.load_date_to).toBe('2026-02-20T18:00:00Z')
    expect(result.is_bidder).toBe(false)
    expect(result.current_price_from).toBe(500)
    expect(result.current_price_to).toBe(1500.5)
  })

  it('returns fallback without throwing for wholly unusable or hostile input', () => {
    const fallback = { page: 1, per_page: 20 }
    const throwingValueOf = {
      valueOf: () => {
        throw new Error('valueOf failed')
      },
    }

    expect(parseAuctionsSearchParams({ page: Symbol('page') })).toEqual(fallback)
    expect(parseAuctionsSearchParams({ page: throwingValueOf })).toEqual(fallback)
    expect(parseAuctionsSearchParams({ page: { nested: true } })).toEqual(fallback)
    expect(parseAuctionsSearchParams({ status: [['Leading']] })).toEqual(fallback)
    expect(parseAuctionsSearchParams(null as unknown as Record<string, unknown>)).toEqual(fallback)
    expect(parseAuctionsSearchParams(42 as unknown as Record<string, unknown>)).toEqual(fallback)
  })

  it('drops impossible date-time values while preserving other valid filters', () => {
    const result = parseAuctionsSearchParams({
      page: '3',
      cargo_num: 'ABC',
      load_date_from: '2026-99-99T99:99:99+99:99',
      load_date_to: '2026-01-15T10:30:00+03:00',
    })

    expect(result).toEqual({
      page: 3,
      per_page: 20,
      cargo_num: 'ABC',
      load_date_to: '2026-01-15T10:30:00+03:00',
    })
    expect(result.load_date_from).toBeUndefined()
  })
})
