import { getRouteApi } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction'
import { AuctionQueryError } from '@/features/auction-error'
import { AsyncQueryView } from '@/shared/ui'
import { AuctionDetailContent } from './AuctionDetailContent'
import { PageSkeleton } from './PageSkeleton'

const routeApi = getRouteApi('/auctions/$auctionUuid')

export const AuctionDetailPage = () => {
  const { auctionUuid } = routeApi.useParams()
  const query = useAuctionDetailQuery(auctionUuid)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
      <AsyncQueryView
        query={query}
        pending={<PageSkeleton />}
        error={(error, retry) => <AuctionQueryError error={error} onRetry={retry} />}
      >
        {(auction) => <AuctionDetailContent auction={auction} auctionUuid={auctionUuid} />}
      </AsyncQueryView>
    </div>
  )
}
