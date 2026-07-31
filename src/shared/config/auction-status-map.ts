import type { components } from '@/shared/api/types/openapi'

type AuctionStatus = components['schemas']['AuctionStatus']

export const AUCTION_STATUS_CODE_BY_LABEL = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
} as const satisfies Partial<Record<AuctionStatus, number>>

export type AuctionStatusLabel = keyof typeof AUCTION_STATUS_CODE_BY_LABEL

export const AUCTION_STATUS_LABEL_BY_CODE: Record<
  (typeof AUCTION_STATUS_CODE_BY_LABEL)[AuctionStatusLabel],
  AuctionStatusLabel
> = {
  1: 'Planning',
  2: 'Auction',
  3: 'DeterminateWinner',
  4: 'WaitDeal',
  5: 'InProgress',
  6: 'Finished',
  7: 'Stopped',
  8: 'Canceled',
}

export const isAuctionStatusCode = (
  code: number,
): code is (typeof AUCTION_STATUS_CODE_BY_LABEL)[AuctionStatusLabel] =>
  Object.prototype.hasOwnProperty.call(AUCTION_STATUS_LABEL_BY_CODE, code)

export const getAuctionStatusLabel = (code: number): AuctionStatusLabel | undefined =>
  isAuctionStatusCode(code) ? AUCTION_STATUS_LABEL_BY_CODE[code] : undefined

export const getAuctionStatusCode = (label: AuctionStatus): number | undefined => {
  if (label === 'Unknown') {
    return undefined
  }

  return AUCTION_STATUS_CODE_BY_LABEL[label]
}
