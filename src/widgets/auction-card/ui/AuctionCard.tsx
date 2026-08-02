import type { AuctionListItemVm } from '@/entities/auction'
import { usePrefetchAuction } from '@/features/prefetch-auction'
import { formatPrice, formatPricePerKm } from '@/shared/lib'
import { AuctionCardActions } from './AuctionCardActions'
import { AuctionCardCargo } from './AuctionCardCargo'
import { AuctionCardHeader } from './AuctionCardHeader'
import { AuctionCardRoute } from './AuctionCardRoute'

export type AuctionCardProps = {
  auction: AuctionListItemVm
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  const prefetch = usePrefetchAuction(auction.auctionUuid)

  const { load, unload } = auction.route

  return (
    <article className="relative flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-foreground/20 focus-within:ring-1 focus-within:ring-ring">
      <AuctionCardHeader auction={auction} onPrefetch={prefetch} />

      <div className="grid grid-cols-2 gap-2 text-sm">
        <AuctionCardRoute
          label="Погрузка"
          point={load}
          hideAddress={auction.hidePointsAddressAndContacts}
        />
        <AuctionCardRoute
          label="Выгрузка"
          point={unload}
          hideAddress={auction.hidePointsAddressAndContacts}
        />
      </div>

      <AuctionCardCargo cargo={auction.cargo} />

      <div className="mt-auto flex items-end justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-foreground">
            {formatPrice(auction.currentPrice)}
          </p>
          <p className="text-xs text-muted-foreground">{formatPricePerKm(auction.pricePerKm)}</p>
        </div>
        <AuctionCardActions auction={auction} onPrefetch={prefetch} />
      </div>
    </article>
  )
}
