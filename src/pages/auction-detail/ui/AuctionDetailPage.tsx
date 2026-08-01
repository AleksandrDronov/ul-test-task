import { getRouteApi } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction'
import { AsyncQueryView } from '@/shared/ui'
import { AuctionDetailContent } from './AuctionDetailContent'
import { AuctionDetailError } from './AuctionDetailError'
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
        error={(error, retry) => <AuctionDetailError error={error} onRetry={retry} />}
      >
        {(auction) => <AuctionDetailContent auction={auction} auctionUuid={auctionUuid} />}
      </AsyncQueryView>
    </div>
  )
}
