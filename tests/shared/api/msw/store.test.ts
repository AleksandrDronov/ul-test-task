import { beforeEach, describe, expect, it } from 'vitest'
import { getAuction, listAuctions, listBets, resetStore, setBet } from '@/shared/api/msw'

const expectValidationError = (result: ReturnType<typeof setBet>) => {
  if (result.ok || result.status !== 422) {
    throw new Error(`expected a 422 validation rejection, got ${JSON.stringify(result)}`)
  }
  return result.body
}

const expectNotFound = (result: ReturnType<typeof setBet>) => {
  if (result.ok || result.status !== 404) {
    throw new Error(`expected a 404 rejection, got ${JSON.stringify(result)}`)
  }
  return result.body
}

const ACTIVE_WITH_BETS_UUID = '00000000-0000-4000-8000-000000000501'
const USER_LEADING_UUID = '00000000-0000-4000-8000-000000000502'
const CANNOT_BID_UUID = '00000000-0000-4000-8000-000000000504'
const HIDDEN_HISTORY_UUID = '00000000-0000-4000-8000-000000000505'
const EMPTY_BETS_UUID = '00000000-0000-4000-8000-000000000506'
const UNKNOWN_UUID = '00000000-0000-4000-8000-000000009999'

describe('msw store: setBet', () => {
  beforeEach(() => {
    resetStore()
  })

  it('accepts a valid on-step bid and updates price, availability, user status and history', () => {
    const before = getAuction(ACTIVE_WITH_BETS_UUID)
    expect(before?.trading.price?.current).toBe(46000)

    const result = setBet(ACTIVE_WITH_BETS_UUID, 45000)
    expect(result).toEqual({ ok: true })

    const after = getAuction(ACTIVE_WITH_BETS_UUID)
    expect(after?.trading.price?.current).toBe(45000)
    expect(after?.trading.price?.current_no_vat).toBeCloseTo(37500, 2)
    // Down auction: available = current - step, floored at min (30000)
    expect(after?.trading.price?.available).toBe(44000)
    expect(after?.trading.your?.bet).toBe(true)
    expect(after?.trading.your?.last_bet).toBe(45000)
    expect(after?.trading.status_mobile).toBe('Leading')
    expect(after?.trading.is_bidder).toBe(true)

    const bets = listBets(ACTIVE_WITH_BETS_UUID, true)
    expect(bets?.bets).toHaveLength(4)
    const newBet = bets?.bets.at(-1)
    expect(newBet?.price_with_vat).toBe(45000)
    expect(newBet?.organization_id).toBe(14)
    expect(newBet?.organization_name).toBe('ООО Перевозчик')

    const list = listAuctions({})
    const listItem = list.data?.find((item) => item.main?.order_uid === ACTIVE_WITH_BETS_UUID)
    expect(listItem?.trading?.price?.current).toBe(45000)
    expect(listItem?.trading?.your?.bet).toBe(true)
    expect(listItem?.trading?.status_mobile).toBe('Leading')
  })

  it('floors available price at min when current - step would go below it', () => {
    // auction 502: min 25000, step 500 -> bidding exactly at min leaves available at min, not below it
    const result = setBet(USER_LEADING_UUID, 25000)
    expect(result).toEqual({ ok: true })

    const after = getAuction(USER_LEADING_UUID)
    expect(after?.trading.price?.current).toBe(25000)
    expect(after?.trading.price?.available).toBe(25000)
  })

  it('rejects an off-step price with a 422-shaped validation error on the price field', () => {
    // auction 501: max 50000, step 1000 -> 44500 is not max - k*step
    const body = expectValidationError(setBet(ACTIVE_WITH_BETS_UUID, 44500))

    expect(body.code).toBe('validation_failed')
    expect(body.errors).toHaveLength(1)
    expect(body.errors[0]).toMatchObject({ field: 'price' })
  })

  it('rejects a near-miss off-step price without slipping through due to float error', () => {
    // auction 502: max 40000, step 500 -> 39000.1 is genuinely off-step (not fp noise)
    const body = expectValidationError(setBet(USER_LEADING_UUID, 39000.1))

    expect(body.errors[0]?.field).toBe('price')
  })

  it('rejects a price below min', () => {
    // auction 501: min is 30000
    const body = expectValidationError(setBet(ACTIVE_WITH_BETS_UUID, 29000))

    expect(body.errors[0]).toMatchObject({ field: 'price', code: 'price_too_low' })
  })

  it('rejects a price above max', () => {
    const body = expectValidationError(setBet(ACTIVE_WITH_BETS_UUID, 51000))

    expect(body.errors[0]).toMatchObject({ field: 'price', code: 'price_too_high' })
  })

  it('rejects a non-positive price', () => {
    const body = expectValidationError(setBet(ACTIVE_WITH_BETS_UUID, 0))

    expect(body.errors[0]).toMatchObject({ field: 'price', code: 'invalid_price' })
  })

  it('rejects bidding on an auction where can_set_bet is false', () => {
    const body = expectValidationError(setBet(CANNOT_BID_UUID, 40000))

    expect(body.errors[0]).toMatchObject({ field: 'price', code: 'bet_not_allowed' })
  })

  it('returns a not-found result for an unknown auction uuid', () => {
    const body = expectNotFound(setBet(UNKNOWN_UUID, 10000))

    expect(body.code).toBe('resource_not_found')
  })

  it('recomputes places across the bet history after a new leading bet', () => {
    // auction 501 seed: bet id 1 (48000, place 2), id 2 (47000, rejected, place null),
    // id 3 (46000, place 1 — the seeded leader).
    const before = listBets(ACTIVE_WITH_BETS_UUID, true)
    expect(before?.bets.find((bet) => bet.id === 3)?.place).toBe(1)

    const result = setBet(ACTIVE_WITH_BETS_UUID, 45000)
    expect(result).toEqual({ ok: true })

    const after = listBets(ACTIVE_WITH_BETS_UUID, true)
    expect(after?.bets).toHaveLength(4)

    // The previously-leading seeded bet is no longer place 1: the new, lower bid outranks it.
    const previousLeader = after?.bets.find((bet) => bet.id === 3)
    expect(previousLeader?.place).not.toBe(1)
    expect(previousLeader?.place).toBe(2)

    const newBet = after?.bets.find((bet) => bet.price_with_vat === 45000)
    expect(newBet?.place).toBe(1)

    const outbidBet = after?.bets.find((bet) => bet.id === 1)
    expect(outbidBet?.place).toBe(3)

    // Rejected bets stay excluded from ranking.
    const rejectedBet = after?.bets.find((bet) => bet.id === 2)
    expect(rejectedBet?.is_rejected).toBe(true)
    expect(rejectedBet?.place).toBeNull()

    // Places among ranked (non-rejected) bets are contiguous and unique.
    const rankedPlaces = after?.bets.filter((bet) => !bet.is_rejected).map((bet) => bet.place)
    expect(rankedPlaces).toEqual([3, 2, 1])
    expect(new Set(rankedPlaces).size).toBe(rankedPlaces?.length)
  })

  it('does not mutate state when a bet is rejected', () => {
    const before = getAuction(ACTIVE_WITH_BETS_UUID)
    setBet(ACTIVE_WITH_BETS_UUID, 44500)
    const after = getAuction(ACTIVE_WITH_BETS_UUID)

    expect(after?.trading.price?.current).toBe(before?.trading.price?.current)
    expect(after?.trading.your?.bet).toBe(before?.trading.your?.bet)
    expect(listBets(ACTIVE_WITH_BETS_UUID, true)?.bets).toHaveLength(3)
  })
})

describe('msw store: getAuction / listBets', () => {
  beforeEach(() => {
    resetStore()
  })

  it('returns null for an unknown auction uuid', () => {
    expect(getAuction(UNKNOWN_UUID)).toBeNull()
    expect(listBets(UNKNOWN_UUID)).toBeNull()
  })

  it('returns an empty bets array for a hidden-history auction even though bets exist internally', () => {
    const result = listBets(HIDDEN_HISTORY_UUID, true)
    expect(result).toEqual({ bets: [] })
  })

  it('returns an empty bets array for an auction with zero bids', () => {
    const result = listBets(EMPTY_BETS_UUID)
    expect(result).toEqual({ bets: [] })
  })

  it('excludes rejected bets by default and includes them when all=true', () => {
    const withoutRejected = listBets(ACTIVE_WITH_BETS_UUID)
    expect(withoutRejected?.bets.some((bet) => bet.is_rejected)).toBe(false)
    expect(withoutRejected?.bets).toHaveLength(2)

    const withRejected = listBets(ACTIVE_WITH_BETS_UUID, true)
    expect(withRejected?.bets.some((bet) => bet.is_rejected)).toBe(true)
    expect(withRejected?.bets).toHaveLength(3)
  })
})

describe('msw store: listAuctions', () => {
  beforeEach(() => {
    resetStore()
  })

  it('returns all seeded auctions with meta matching the full set on default pagination', () => {
    const result = listAuctions({ page: 1, per_page: 20 })
    expect(result.data).toHaveLength(16)
    expect(result.meta).toMatchObject({
      current_page: 1,
      per_page: 20,
      total: 16,
      last_page: 1,
      from: 1,
      to: 16,
    })
  })

  it('filters by cargo_num', () => {
    const result = listAuctions({ cargo_num: '00000000502' })
    expect(result.data).toHaveLength(1)
    expect(result.data?.[0]?.main?.order_uid).toBe(USER_LEADING_UUID)
  })

  it('filters by is_bidder', () => {
    const result = listAuctions({ is_bidder: true })
    expect(result.data?.every((item) => item.trading?.is_bidder === true)).toBe(true)
    expect(result.data?.length).toBeGreaterThan(0)
  })

  it('filters by load_city and unload_city', () => {
    const result = listAuctions({ load_city: 'Пермь', unload_city: 'Москва' })
    expect(result.data).toHaveLength(1)
    expect(result.data?.[0]?.main?.order_uid).toBe(ACTIVE_WITH_BETS_UUID)
  })

  it('filters by current_price_from / current_price_to', () => {
    const result = listAuctions({ current_price_from: 40000, current_price_to: 50000 })
    // Seeded auctions with current price in [40000, 50000]: 501 (46000), 504 (42000), 507 (46500).
    expect(result.data).toHaveLength(3)
    expect(
      result.data?.every((item) => {
        const current = item.trading?.price?.current
        return current !== undefined && current >= 40000 && current <= 50000
      }),
    ).toBe(true)
  })

  it('paginates results', () => {
    const page1 = listAuctions({ page: 1, per_page: 3 })
    const page2 = listAuctions({ page: 2, per_page: 3 })
    expect(page1.data).toHaveLength(3)
    expect(page2.data).toHaveLength(3)
    expect(page1.meta?.current_page).toBe(1)
    expect(page2.meta?.current_page).toBe(2)
    expect(page1.data?.[0]?.main?.order_uid).not.toBe(page2.data?.[0]?.main?.order_uid)
  })
})
