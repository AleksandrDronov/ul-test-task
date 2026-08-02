import type { components } from '@/shared/api/types/openapi'

type AuctionType = components['schemas']['AuctionType']

export type BetStepDirection = 'decreasing' | 'increasing'

export const FLOAT_EPSILON = 1e-6

export type SetBetPriceInput = {
  min?: number | null
  max?: number | null
  step?: number | null
  current?: number | null
  available?: number | null
}

export type SetBetLimits = {
  min?: number | null
  max?: number | null
  step?: number | null
  /** Ось сетки шага: max для понижения, min для повышения. */
  stepReference?: number | null
  stepDirection?: BetStepDirection
}

export const isBetPriceOnStep = (
  price: number,
  step: number,
  reference: number,
  direction: BetStepDirection,
): boolean => {
  if (step <= 0) return true

  const steps = direction === 'decreasing' ? (reference - price) / step : (price - reference) / step

  return Math.abs(steps - Math.round(steps)) < FLOAT_EPSILON
}

export const computeNextAvailablePrice = (
  acceptedPrice: number,
  step: number,
  direction: BetStepDirection,
  floor: number | null,
  ceiling: number | null,
): number => {
  const raw = direction === 'decreasing' ? acceptedPrice - step : acceptedPrice + step

  if (direction === 'decreasing') {
    return floor !== null ? Math.max(raw, floor) : raw
  }

  return ceiling !== null ? Math.min(raw, ceiling) : raw
}

export const getBetStepDirection = (aucType: AuctionType | null | undefined): BetStepDirection =>
  aucType === 'Up' ? 'increasing' : 'decreasing'

const downRequestMax = (price: SetBetPriceInput, min: number | null | undefined): number | null => {
  if (typeof price.available === 'number') {
    return price.available
  }

  if (typeof price.current !== 'number') {
    return null
  }

  const step = price.step ?? 0
  const rawMax = price.current - step

  if (typeof min === 'number') {
    return Math.max(min, rawMax)
  }

  return rawMax
}

const upRequestMin = (price: SetBetPriceInput, max: number | null | undefined): number | null => {
  if (typeof price.available === 'number') {
    return price.available
  }

  if (typeof price.current !== 'number') {
    return null
  }

  const step = price.step ?? 0
  const rawMin = price.current + step

  if (typeof max === 'number') {
    return Math.min(max, rawMin)
  }

  return rawMin
}

/**
 * Эффективные min/max/step для валидации ставки с учётом типа аукциона.
 * Down/Request: max = available; Up: min = available; FixPrice: фикс.
 */
export const getSetBetLimits = (
  price: SetBetPriceInput,
  aucType: AuctionType | null | undefined,
): SetBetLimits => {
  const stepDirection = getBetStepDirection(aucType)

  const limits: SetBetLimits = {
    min: price.min,
    max: price.max,
    step: price.step,
    stepReference: stepDirection === 'increasing' ? price.min : price.max,
    stepDirection,
  }

  switch (aucType) {
    case 'Down':
    case 'Request': {
      const max = downRequestMax(price, limits.min)
      if (typeof max === 'number') {
        limits.max = max
      }
      break
    }
    case 'Up': {
      const min = upRequestMin(price, limits.max)
      if (typeof min === 'number') {
        limits.min = min
      }
      break
    }
    case 'FixPrice': {
      const fixed = price.current ?? price.available ?? price.max ?? price.min
      if (typeof fixed === 'number') {
        limits.min = fixed
        limits.max = fixed
      }
      break
    }
    default:
      break
  }

  return limits
}
