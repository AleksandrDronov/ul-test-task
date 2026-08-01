import type { AuctionDetailVm } from '@/entities/auction'
import { useAuctionBetsQuery } from '@/entities/bet'
import { AsyncQueryView, EmptyState } from '@/shared/ui'
import { AuctionSummary } from '@/widgets/auction-summary'
import { BetsTable } from '@/widgets/bets-table'
import { BetsSkeleton } from './PageSkeleton'

type AuctionBetsContentProps = {
  auction: AuctionDetailVm
  auctionUuid: string
}

export const AuctionBetsContent = ({ auction, auctionUuid }: AuctionBetsContentProps) => {
  const betsQuery = useAuctionBetsQuery(auctionUuid, undefined, {
    enabled: !auction.hideBetsHistory,
  })

  return (
    <div className="space-y-6">
      <AuctionSummary auction={auction} />

      {auction.hideBetsHistory ? (
        <EmptyState
          title="История ставок скрыта"
          description="Организатор аукциона скрыл историю ставок для участников."
        />
      ) : (
        <AsyncQueryView
          query={betsQuery}
          pending={<BetsSkeleton />}
          isEmpty={(data) => data.items.length === 0}
          empty={
            <EmptyState
              title="Ставок пока нет"
              description="Как только появятся ставки, они отобразятся здесь."
            />
          }
        >
          {(data) => (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Участников: {data.participantsCount}
              </p>
              <BetsTable bets={data.items} />
            </div>
          )}
        </AsyncQueryView>
      )}
    </div>
  )
}
