import { getRouteApi, Link } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction'
import { AuctionQueryError } from '@/features/auction-error'
import { SetBetForm } from '@/features/set-bet'
import { Skeleton } from '@/shared/ui'
import { AuctionSummary } from '@/widgets/auction-summary'

const routeApi = getRouteApi('/auctions_/$auctionUuid/bet')

export const AuctionBetPage = () => {
  const { auctionUuid } = routeApi.useParams()
  const query = useAuctionDetailQuery(auctionUuid)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Ставка на аукцион</h1>

      {query.isPending && (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {query.isError && (
        <AuctionQueryError
          error={query.error}
          onRetry={() => {
            void query.refetch()
          }}
        />
      )}

      {query.isSuccess && (
        <div className="space-y-6">
          <AuctionSummary auction={query.data} />

          <div className="rounded-lg border border-border bg-card p-4">
            <SetBetForm
              auctionUuid={auctionUuid}
              price={query.data.trading.price}
              canSetBet={query.data.canSetBet}
            />
          </div>

          <Link
            to="/auctions/$auctionUuid"
            params={{ auctionUuid }}
            className="inline-block text-sm text-muted-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Вернуться к аукциону
          </Link>
        </div>
      )}
    </div>
  )
}
