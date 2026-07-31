import { describe, expect, it } from 'vitest'
import { SEED_AUCTIONS } from '@/shared/api/msw/seed'
import { mapAuctionDetailDtoToVm } from '@/entities/auction/model/map-auction-detail'

const findDetailByCargoNum = (cargoNum: string) => {
  const record = SEED_AUCTIONS.find((item) => item.detail.main.cargo_num === cargoNum)
  if (!record) throw new Error(`Seed auction with cargo_num ${cargoNum} not found`)
  return record.detail
}

describe('mapAuctionDetailDtoToVm', () => {
  it('surfaces the restriction flags without redacting the underlying data', () => {
    const vm = mapAuctionDetailDtoToVm(findDetailByCargoNum('00000000507'))

    expect(vm.hidePointsAddressAndContacts).toBe(true)
    expect(vm.noViewCargoPrice).toBe(true)
    expect(vm.routes[0]?.address).toBe('Складская 20')
    expect(vm.cargo.price).toBe('1800000')
  })

  it('surfaces hide_bets_history from the top-level flag', () => {
    const vm = mapAuctionDetailDtoToVm(findDetailByCargoNum('00000000505'))
    expect(vm.hideBetsHistory).toBe(true)
  })

  it('preserves null trading price bounds instead of coercing them to zero', () => {
    const detail = structuredClone(findDetailByCargoNum('00000000501'))
    detail.trading.price = {
      ...detail.trading.price,
      min: null,
      max: null,
      step: null,
    }

    const vm = mapAuctionDetailDtoToVm(detail)

    expect(vm.trading.price.min).toBeNull()
    expect(vm.trading.price.max).toBeNull()
    expect(vm.trading.price.step).toBeNull()
    expect(vm.trading.price.current).toBe(46000)
  })

  it('preserves a null last_bet as "no bet" rather than coercing to zero', () => {
    const vm = mapAuctionDetailDtoToVm(findDetailByCargoNum('00000000501'))

    expect(vm.trading.your.bet).toBe(false)
    expect(vm.trading.your.lastBet).toBeNull()
  })

  it('maps admitted organizations', () => {
    const vm = mapAuctionDetailDtoToVm(findDetailByCargoNum('00000000501'))

    expect(vm.admittedOrganizations.length).toBeGreaterThan(0)
    expect(vm.admittedOrganizations[0]).toEqual({
      id: 14,
      name: 'ООО Перевозчик',
      fullName: 'Общество с ограниченной ответственностью Перевозчик',
      inn: '9616244307',
      isMain: true,
    })
  })

  it('maps absent restriction flags and can_set_bet to false', () => {
    const detail = structuredClone(findDetailByCargoNum('00000000501'))
    delete detail.hide_bets_history
    delete detail.trading.can_set_bet
    delete detail.trading.hide_bets_history
    delete detail.trading.hide_points_address_and_contacts
    delete detail.trading.no_view_cargo_price

    const vm = mapAuctionDetailDtoToVm(detail)

    expect(vm.canSetBet).toBe(false)
    expect(vm.hideBetsHistory).toBe(false)
    expect(vm.hidePointsAddressAndContacts).toBe(false)
    expect(vm.noViewCargoPrice).toBe(false)
  })
})
