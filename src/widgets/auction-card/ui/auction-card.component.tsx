import { Link } from '@tanstack/react-router'
import type {
  AuctionListCargoVm,
  AuctionListItemVm,
  AuctionListRoutePointVm,
} from '@/entities/auction/model/auction-list.vm'
import { usePrefetchAuction } from '@/features/prefetch-auction/model/use-prefetch-auction'
import { AUCTION_STATUS_RU_LABEL, AUCTION_TYPE_RU_LABEL, TRADING_STATUS_RU_LABEL } from '@/shared/config/status-labels'
import { formatDate, formatNumber, formatPrice, formatPricePerKm } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

export type AuctionCardProps = {
  auction: AuctionListItemVm
}

const RoutePoint = ({
  label,
  point,
  hideAddress,
}: {
  label: string
  point: AuctionListRoutePointVm | null
  hideAddress: boolean
}) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{point?.city ?? '—'}</p>
    {!hideAddress && point?.address && <p className="text-xs text-muted-foreground">{point.address}</p>}
    <p className="text-xs text-muted-foreground">{formatDate(point?.date)}</p>
  </div>
)

const CargoPreview = ({ cargo }: { cargo: AuctionListCargoVm }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
    <span>{cargo.name ?? 'Груз не указан'}</span>
    {cargo.weight !== null && <span>{formatNumber(cargo.weight)} т</span>}
    {cargo.volume !== null && <span>{formatNumber(cargo.volume)} м³</span>}
    {cargo.bodyType && <span>{cargo.bodyType}</span>}
  </div>
)

/**
 * `AuctionListItemVm.primaryAction` already encodes the routing rule
 * (task-6 ViewModel); this widget only translates it into a destination, it
 * never recomputes eligibility itself.
 */
const PrimaryActionButton = ({ auction }: { auction: AuctionListItemVm }) => {
  const { primaryAction, auctionUuid } = auction

  if (primaryAction.type === 'disabled' || !auctionUuid) {
    return (
      <Button type="button" disabled aria-disabled="true">
        {primaryAction.label}
      </Button>
    )
  }

  if (primaryAction.type === 'viewBets') {
    return (
      <Button asChild>
        <Link to="/auctions/$auctionUuid/bets" params={{ auctionUuid }}>
          {primaryAction.label}
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild>
      <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid }}>
        {primaryAction.label}
      </Link>
    </Button>
  )
}

export const AuctionCardComponent = ({ auction }: AuctionCardProps) => {
  const prefetch = usePrefetchAuction(auction.auctionUuid)
  const { load, unload } = auction.route

  return (
    <article
      onMouseEnter={prefetch}
      onFocus={prefetch}
      className="flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-foreground/20 focus-within:ring-1 focus-within:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Заявка № {auction.cargoNum ?? '—'}</p>
          {auction.auctionUuid ? (
            <Link
              to="/auctions/$auctionUuid"
              params={{ auctionUuid: auction.auctionUuid }}
              className="text-base font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {auction.aucType ? AUCTION_TYPE_RU_LABEL[auction.aucType] : 'Аукцион'}
            </Link>
          ) : (
            <p className="text-base font-semibold text-foreground">
              {auction.aucType ? AUCTION_TYPE_RU_LABEL[auction.aucType] : 'Аукцион'}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {auction.status && <Badge variant="secondary">{AUCTION_STATUS_RU_LABEL[auction.status]}</Badge>}
          {auction.statusMobile && (
            <Badge variant="outline">{TRADING_STATUS_RU_LABEL[auction.statusMobile]}</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <RoutePoint label="Погрузка" point={load} hideAddress={auction.hidePointsAddressAndContacts} />
        <RoutePoint label="Выгрузка" point={unload} hideAddress={auction.hidePointsAddressAndContacts} />
      </div>

      <CargoPreview cargo={auction.cargo} />

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
        <div>
          <p className="text-lg font-semibold text-foreground">{formatPrice(auction.currentPrice)}</p>
          <p className="text-xs text-muted-foreground">{formatPricePerKm(auction.pricePerKm)}</p>
          {auction.hasBet && <p className="mt-1 text-xs font-medium text-primary">Вы уже сделали ставку</p>}
        </div>
        <PrimaryActionButton auction={auction} />
      </div>
    </article>
  )
}
