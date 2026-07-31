import { Link } from '@tanstack/react-router'
import type { AuctionDetailVm } from '@/entities/auction/model/auction-detail.vm'
import { formatPrice } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'

export type AuctionSummaryProps = {
  auction: AuctionDetailVm
}

/**
 * Compact auction context reused on the bet-history and bet-form pages so
 * neither has to duplicate the full detail layout just to remind the user
 * which auction they're looking at (resolution: keep those pages focused).
 */
export const AuctionSummaryComponent = ({ auction }: AuctionSummaryProps) => {
  const loadPoint = auction.routes.at(0)
  const unloadPoint = auction.routes.at(-1)

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Заявка № {auction.main.cargoNum ?? '—'}</p>
        <p className="truncate text-base font-semibold text-foreground">
          {loadPoint?.city ?? '—'} → {unloadPoint?.city ?? '—'}
        </p>
        {!auction.noViewCargoPrice && (
          <p className="text-sm text-muted-foreground">
            Текущая цена: {formatPrice(auction.trading.price.current)}
          </p>
        )}
      </div>
      {auction.main.auctionUuid && (
        <Button asChild variant="outline" size="sm">
          <Link to="/auctions/$auctionUuid" params={{ auctionUuid: auction.main.auctionUuid }}>
            Открыть аукцион
          </Link>
        </Button>
      )}
    </div>
  )
}
