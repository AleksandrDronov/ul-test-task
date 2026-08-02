import { describe, expect, it } from 'vitest'
import { computeNextAvailablePrice, getSetBetLimits, isBetPriceOnStep } from '@/shared/lib'

const DOWN_PRICE = {
  min: 30000,
  max: 50000,
  step: 1000,
  current: 46000,
  available: 45000,
}

const UP_PRICE = {
  min: 28000,
  max: 45000,
  step: 500,
  current: 31500,
  available: 32000,
}

describe('getSetBetLimits', () => {
  it('caps max at available for Down auctions', () => {
    expect(getSetBetLimits(DOWN_PRICE, 'Down')).toEqual({
      min: 30000,
      max: 45000,
      step: 1000,
      stepReference: 50000,
      stepDirection: 'decreasing',
    })
  })

  it('caps max at available for Request auctions', () => {
    expect(getSetBetLimits(DOWN_PRICE, 'Request')).toEqual({
      min: 30000,
      max: 45000,
      step: 1000,
      stepReference: 50000,
      stepDirection: 'decreasing',
    })
  })

  it('floors Down max at min when current minus step would go below min', () => {
    expect(
      getSetBetLimits(
        {
          min: 25000,
          max: 40000,
          step: 500,
          current: 25200,
          available: 25000,
        },
        'Down',
      ),
    ).toEqual({
      min: 25000,
      max: 25000,
      step: 500,
      stepReference: 40000,
      stepDirection: 'decreasing',
    })
  })

  it('raises min to available for Up auctions', () => {
    expect(getSetBetLimits(UP_PRICE, 'Up')).toEqual({
      min: 32000,
      max: 45000,
      step: 500,
      stepReference: 28000,
      stepDirection: 'increasing',
    })
  })

  it('caps Up min at max when current plus step would exceed max', () => {
    expect(
      getSetBetLimits(
        {
          min: 28000,
          max: 45000,
          step: 500,
          current: 44900,
          available: 45000,
        },
        'Up',
      ),
    ).toEqual({
      min: 45000,
      max: 45000,
      step: 500,
      stepReference: 28000,
      stepDirection: 'increasing',
    })
  })

  it('fixes min and max for FixPrice auctions', () => {
    expect(
      getSetBetLimits(
        {
          min: 52000,
          max: 52000,
          step: 0,
          current: 52000,
          available: 52000,
        },
        'FixPrice',
      ),
    ).toEqual({
      min: 52000,
      max: 52000,
      step: 0,
      stepReference: 52000,
      stepDirection: 'decreasing',
    })
  })

  it('returns static min/max for unknown auction types', () => {
    expect(getSetBetLimits(DOWN_PRICE, 'Unknown')).toEqual({
      min: 30000,
      max: 50000,
      step: 1000,
      stepReference: 50000,
      stepDirection: 'decreasing',
    })
  })
})

describe('isBetPriceOnStep', () => {
  it('checks decreasing auctions from max', () => {
    expect(isBetPriceOnStep(45000, 1000, 50000, 'decreasing')).toBe(true)
    expect(isBetPriceOnStep(44500, 1000, 50000, 'decreasing')).toBe(false)
  })

  it('checks increasing auctions from min', () => {
    expect(isBetPriceOnStep(32000, 500, 28000, 'increasing')).toBe(true)
    expect(isBetPriceOnStep(32250, 500, 28000, 'increasing')).toBe(false)
  })
})

describe('computeNextAvailablePrice', () => {
  it('subtracts step for decreasing auctions and floors at min', () => {
    expect(computeNextAvailablePrice(45000, 1000, 'decreasing', 30000, 50000)).toBe(44000)
    expect(computeNextAvailablePrice(25000, 500, 'decreasing', 25000, 40000)).toBe(25000)
  })

  it('adds step for increasing auctions and caps at max', () => {
    expect(computeNextAvailablePrice(32000, 500, 'increasing', 28000, 45000)).toBe(32500)
    expect(computeNextAvailablePrice(44900, 500, 'increasing', 28000, 45000)).toBe(45000)
  })
})
