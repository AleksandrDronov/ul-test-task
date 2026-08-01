import { getRouteApi } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction'
import { AuctionQueryError } from '@/features/auction-error'
import { AsyncQueryView } from '@/shared/ui'
import { AuctionBetsContent } from './AuctionBetsContent'
import { PageSkeleton } from './PageSkeleton'

const routeApi = getRouteApi('/auctions_/$auctionUuid/bets')

export const AuctionBetsPage = () => {
  const { auctionUuid } = routeApi.useParams()
  const detailQuery = useAuctionDetailQuery(auctionUuid)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">История ставок</h1>

      <AsyncQueryView
        query={detailQuery}
        pending={<PageSkeleton />}
        error={(error, retry) => <AuctionQueryError error={error} onRetry={retry} />}
      >
        {(auction) => <AuctionBetsContent auction={auction} auctionUuid={auctionUuid} />}
      </AsyncQueryView>
    </div>
  )
}
