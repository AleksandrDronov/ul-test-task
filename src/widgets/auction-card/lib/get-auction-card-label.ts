import type { AuctionListItemVm } from '@/entities/auction'
import { AUCTION_TYPE_RU_LABEL } from '@/shared/config'

export const getAuctionTypeLabel = (aucType: AuctionListItemVm['aucType']) =>
  aucType ? AUCTION_TYPE_RU_LABEL[aucType] : 'Аукцион'

export const getAuctionCardAriaLabel = (auction: AuctionListItemVm) =>
  `Открыть аукцион: заявка № ${auction.cargoNum ?? 'не указан'}, ${getAuctionTypeLabel(auction.aucType)}`
