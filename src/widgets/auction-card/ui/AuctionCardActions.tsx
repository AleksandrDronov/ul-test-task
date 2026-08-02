import { Link } from '@tanstack/react-router'
import type { AuctionListItemVm } from '@/entities/auction'
import { getPrefetchLinkProps } from '@/features/prefetch-auction'
import { Button } from '@/shared/ui'

type AuctionCardActionsProps = {
  auction: AuctionListItemVm
  onPrefetch: () => void
}

const PrimaryActionButton = ({ auction, onPrefetch }: AuctionCardActionsProps) => {
  const { primaryAction, auctionUuid } = auction
  const prefetchLinkProps = getPrefetchLinkProps(onPrefetch)

  if (primaryAction.type === 'disabled' || !auctionUuid) {
    return (
      <Button type="button" disabled aria-disabled="true">
        {primaryAction.label}
      </Button>
    )
  }

  if (primaryAction.type === 'viewBets') {
    return (
      <Button asChild className="relative z-10">
        <Link to="/auctions/$auctionUuid/bets" params={{ auctionUuid }} {...prefetchLinkProps}>
          {primaryAction.label}
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild className="relative z-10">
      <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid }} {...prefetchLinkProps}>
        {primaryAction.label}
      </Link>
    </Button>
  )
}

export const AuctionCardActions = ({ auction, onPrefetch }: AuctionCardActionsProps) => (
  <div className="relative z-10 flex flex-col gap-1">
    {auction.hasBet && (
      <p role="status" className="text-xs font-medium text-primary">
        Вы уже сделали ставку
      </p>
    )}
    <PrimaryActionButton auction={auction} onPrefetch={onPrefetch} />
  </div>
)
