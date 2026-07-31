import { describe, expect, it } from 'vitest'
import { SEED_AUCTIONS } from '@/shared/api/msw/seed'
import { mapBetListToVm } from '@/entities/bet/model/map-bet-item'

const findBetsByCargoNum = (cargoNum: string) => {
  const record = SEED_AUCTIONS.find((item) => item.detail.main.cargo_num === cargoNum)
  if (!record) throw new Error(`Seed auction with cargo_num ${cargoNum} not found`)
  return record.bets
}

describe('mapBetListToVm', () => {
  it('counts distinct organization_id values, not the number of bets', () => {
    const bets = findBetsByCargoNum('00000000501')

    const { items, participantsCount } = mapBetListToVm(bets)

    expect(items).toHaveLength(3)
    expect(participantsCount).toBe(2)
  })

  it('returns zero participants for an empty bet list', () => {
    const { items, participantsCount } = mapBetListToVm([])
    expect(items).toEqual([])
    expect(participantsCount).toBe(0)
  })

  it('preserves a null place instead of coercing it to zero', () => {
    const bets = findBetsByCargoNum('00000000501')
    const rejected = bets.find((bet) => bet.is_rejected)

    const { items } = mapBetListToVm(bets)
    const rejectedVm = items.find((item) => item.id === rejected?.id)

    expect(rejectedVm?.place).toBeNull()
    expect(rejectedVm?.isRejected).toBe(true)
  })
})
