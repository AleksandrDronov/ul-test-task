import { describe, expect, it } from 'vitest'
import { SEED_AUCTIONS } from '@/shared/api/msw/seed'
import { mapAuctionListItemDtoToVm } from '@/entities/auction/model/map-auction-list-item'

const findListItemByCargoNum = (cargoNum: string) => {
  const record = SEED_AUCTIONS.find((item) => item.listItem.main?.cargo_num === cargoNum)
  if (!record) throw new Error(`Seed auction with cargo_num ${cargoNum} not found`)
  return record.listItem
}

describe('mapAuctionListItemDtoToVm', () => {
  it('maps cargo_num to cargoNum', () => {
    const vm = mapAuctionListItemDtoToVm(findListItemByCargoNum('00000000501'))
    expect(vm.cargoNum).toBe('00000000501')
  })

  it('resolves primaryAction to setBet when can_set_bet is true and there is no existing bet', () => {
    const vm = mapAuctionListItemDtoToVm(findListItemByCargoNum('00000000501'))
    expect(vm.canSetBet).toBe(true)
    expect(vm.hasBet).toBe(false)
    expect(vm.primaryAction).toEqual({ type: 'setBet', label: 'Сделать ставку' })
  })

  it('resolves primaryAction to changeBet when can_set_bet is true and the user already has a bet', () => {
    const vm = mapAuctionListItemDtoToVm(findListItemByCargoNum('00000000502'))
    expect(vm.canSetBet).toBe(true)
    expect(vm.hasBet).toBe(true)
    expect(vm.primaryAction).toEqual({ type: 'changeBet', label: 'Изменить ставку' })
  })

  it('resolves primaryAction to viewBets when betting is closed but the auction has started', () => {
    const vm = mapAuctionListItemDtoToVm(findListItemByCargoNum('00000000504'))
    expect(vm.canSetBet).toBe(false)
    expect(vm.status).toBe('Auction')
    expect(vm.primaryAction).toEqual({ type: 'viewBets', label: 'Смотреть ставки' })
  })

  it('resolves primaryAction to disabled when betting is closed and the auction has not started yet', () => {
    const vm = mapAuctionListItemDtoToVm(findListItemByCargoNum('00000000508'))
    expect(vm.canSetBet).toBe(false)
    expect(vm.status).toBe('Planning')
    expect(vm.primaryAction).toEqual({ type: 'disabled', label: 'Ставка недоступна' })
  })

  it('exposes hide_points_address_and_contacts without redacting the address itself', () => {
    const vm = mapAuctionListItemDtoToVm(findListItemByCargoNum('00000000507'))
    expect(vm.hidePointsAddressAndContacts).toBe(true)
    expect(vm.route.load?.city).toBe('Москва')
    expect(vm.route.load?.address).toBe('Складская 20')
  })

  it('preserves a null price_per_km instead of coercing it to zero', () => {
    const item = findListItemByCargoNum('00000000501')
    const withoutPricePerKm = { ...item, main: { ...item.main, price_per_km: null } }

    const vm = mapAuctionListItemDtoToVm(withoutPricePerKm)

    expect(vm.pricePerKm).toBeNull()
  })
})
