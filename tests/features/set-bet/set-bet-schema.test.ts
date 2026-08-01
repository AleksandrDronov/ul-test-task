import { describe, expect, it } from 'vitest'
import { createSetBetSchema } from '@/features/set-bet'

// Realistic trading params taken from the MSW seed, cargo_num '00000000509'
// (min: 22000, max: 38000, step: 1000) - a `Down` auction.
describe('createSetBetSchema', () => {
  const schema = createSetBetSchema({
    min: 22000,
    max: 38000,
    step: 1000,
    stepReference: 38000,
    stepDirection: 'decreasing',
  })

  it('accepts a valid step-aligned price', () => {
    const result = schema.safeParse({ price: 29000 })
    expect(result.success).toBe(true)
  })

  it('rejects a price below min', () => {
    const result = schema.safeParse({ price: 21000 })
    expect(result.success).toBe(false)
  })

  it('rejects an off-step price', () => {
    const result = schema.safeParse({ price: 29500 })
    expect(result.success).toBe(false)
  })

  it('rejects a price above max', () => {
    const result = schema.safeParse({ price: 39000 })
    expect(result.success).toBe(false)
  })

  it('rejects a non-positive price', () => {
    expect(schema.safeParse({ price: 0 }).success).toBe(false)
    expect(schema.safeParse({ price: -1000 }).success).toBe(false)
  })

  it('rejects a float-precision near-miss off the step', () => {
    // (38000 - 29000.1) / 1000 = 8.9999 - not an integer, even accounting
    // for naive floating-point arithmetic.
    const result = schema.safeParse({ price: 29000.1 })
    expect(result.success).toBe(false)
  })

  it('surfaces user-facing Russian error messages', () => {
    const result = schema.safeParse({ price: 0 })
    if (result.success) throw new Error('expected failure')
    expect(result.error.issues[0]?.message).toBe('Цена должна быть больше 0.')
  })

  it('validates step alignment from auction start max for decreasing auctions', () => {
    const stepSchema = createSetBetSchema({
      min: 25000,
      max: 36700,
      step: 500,
      stepReference: 40000,
      stepDirection: 'decreasing',
    })

    expect(stepSchema.safeParse({ price: 36500 }).success).toBe(true)
  })

  it('validates step alignment from auction min for increasing auctions', () => {
    const stepSchema = createSetBetSchema({
      min: 32000,
      max: 45000,
      step: 500,
      stepReference: 28000,
      stepDirection: 'increasing',
    })

    expect(stepSchema.safeParse({ price: 32500 }).success).toBe(true)
    expect(stepSchema.safeParse({ price: 32250 }).success).toBe(false)
  })

  it('treats missing bounds as unconstrained', () => {
    const unconstrained = createSetBetSchema({})
    expect(unconstrained.safeParse({ price: 12345 }).success).toBe(true)
    expect(unconstrained.safeParse({ price: 0 }).success).toBe(false)
  })
})
