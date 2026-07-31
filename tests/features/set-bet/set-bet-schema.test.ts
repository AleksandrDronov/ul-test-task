import { describe, expect, it } from 'vitest'
import { createSetBetSchema } from '@/features/set-bet'

// Realistic trading params taken from the MSW seed, cargo_num '00000000509'
// (min: 22000, max: 38000, step: 1000) - a `Down` auction.
describe('createSetBetSchema', () => {
  const schema = createSetBetSchema({ min: 22000, max: 38000, step: 1000 })

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

  it('treats missing bounds as unconstrained', () => {
    const unconstrained = createSetBetSchema({})
    expect(unconstrained.safeParse({ price: 12345 }).success).toBe(true)
    expect(unconstrained.safeParse({ price: 0 }).success).toBe(false)
  })
})
