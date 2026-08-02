import { getRouteApi } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction'
import { AuctionQueryError } from '@/features/auction-error'
import { SetBetForm } from '@/features/set-bet'
import { AsyncQueryView, Skeleton } from '@/shared/ui'
import { AuctionSummary } from '@/widgets/auction-summary'

const routeApi = getRouteApi('/auctions_/$auctionUuid/bet')

export const AuctionBetPage = () => {
  const { auctionUuid } = routeApi.useParams()
  const query = useAuctionDetailQuery(auctionUuid)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Ставка на аукцион</h1>

      <AsyncQueryView
        query={query}
        pending={
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
        error={(error, retry) => <AuctionQueryError error={error} onRetry={retry} />}
      >
        {(auction) => (
          <div className="space-y-6">
            <AuctionSummary auction={auction} />

            <div className="rounded-lg border border-border bg-card p-4">
              <SetBetForm
                auctionUuid={auctionUuid}
                price={auction.trading.price}
                aucType={auction.main.aucType}
                canSetBet={auction.canSetBet}
              />
            </div>
          </div>
        )}
      </AsyncQueryView>
    </div>
  )
}
