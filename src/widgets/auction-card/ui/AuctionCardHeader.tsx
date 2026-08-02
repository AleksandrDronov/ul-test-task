import { Link } from '@tanstack/react-router'
import type { AuctionListItemVm } from '@/entities/auction'
import { getPrefetchLinkProps } from '@/features/prefetch-auction'
import { AUCTION_STATUS_RU_LABEL, TRADING_STATUS_RU_LABEL } from '@/shared/config'
import { Badge } from '@/shared/ui'
import { getAuctionCardAriaLabel, getAuctionTypeLabel } from '../lib/get-auction-card-label'

type AuctionCardHeaderProps = {
  auction: AuctionListItemVm
  onPrefetch: () => void
}

export const AuctionCardHeader = ({ auction, onPrefetch }: AuctionCardHeaderProps) => {
  const title = getAuctionTypeLabel(auction.aucType)
  const prefetchLinkProps = getPrefetchLinkProps(onPrefetch)

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Заявка № {auction.cargoNum ?? '—'}</p>
        {auction.auctionUuid ? (
          <Link
            to="/auctions/$auctionUuid"
            params={{ auctionUuid: auction.auctionUuid }}
            className="text-base font-semibold text-foreground underline-offset-2 after:absolute after:inset-0 after:z-0 after:rounded-lg after:content-[''] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={getAuctionCardAriaLabel(auction)}
            {...prefetchLinkProps}
          >
            {title}
          </Link>
        ) : (
          <p className="text-base font-semibold text-foreground">{title}</p>
        )}
      </div>
      <div className="relative z-10 flex shrink-0 flex-col items-end gap-1">
        {auction.status && (
          <Badge
            variant="secondary"
            aria-label={`Статус аукциона: ${AUCTION_STATUS_RU_LABEL[auction.status]}`}
          >
            {AUCTION_STATUS_RU_LABEL[auction.status]}
          </Badge>
        )}
        {auction.statusMobile && (
          <Badge
            variant="outline"
            aria-label={`Торговый статус: ${TRADING_STATUS_RU_LABEL[auction.statusMobile]}`}
          >
            {TRADING_STATUS_RU_LABEL[auction.statusMobile]}
          </Badge>
        )}
      </div>
    </div>
  )
}
