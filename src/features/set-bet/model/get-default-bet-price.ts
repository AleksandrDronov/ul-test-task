import type { AuctionDetailTradingPriceVm } from '@/entities/auction'

export const getDefaultBetPrice = (
  price: AuctionDetailTradingPriceVm,
): number | undefined => (typeof price.available === 'number' ? price.available : undefined)
