import { getRouteApi, Link } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction/api/use-auction-detail-query'
import { useAuctionBetsQuery } from '@/entities/bet/api/use-auction-bets-query'
import { DEFAULT_SEARCH_PARAMS } from '@/features/filter-auctions/model/parse-auctions-search-params'
import { ApiError } from '@/shared/api/api-error'
import { ApiErrorStateComponent } from '@/shared/ui/api-error-state.component'
import { Button } from '@/shared/ui/button'
import { EmptyStateComponent } from '@/shared/ui/empty-state.component'
import { Skeleton } from '@/shared/ui/skeleton'
import { AuctionSummaryComponent } from '@/widgets/auction-summary/ui/auction-summary.component'
import { BetsTableComponent } from '@/widgets/bets-table/ui/bets-table.component'

const routeApi = getRouteApi('/auctions_/$auctionUuid/bets')

const BackToListLink = () => (
  <Button asChild variant="outline">
    <Link to="/" search={DEFAULT_SEARCH_PARAMS}>
      Вернуться к списку аукционов
    </Link>
  </Button>
)

const PageSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
)

export const AuctionBetsPageComponent = () => {
  const { auctionUuid } = routeApi.useParams()
  const detailQuery = useAuctionDetailQuery(auctionUuid)
  const betsQuery = useAuctionBetsQuery(auctionUuid, undefined, {
    enabled: detailQuery.isSuccess && !detailQuery.data.hideBetsHistory,
  })

  const isNotFound = detailQuery.error instanceof ApiError && detailQuery.error.status === 404

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">История ставок</h1>

      {detailQuery.isPending && <PageSkeleton />}

      {detailQuery.isError &&
        (isNotFound ? (
          <EmptyStateComponent
            title="Аукцион не найден"
            description="Возможно, он был удалён или ссылка неверна."
            action={<BackToListLink />}
          />
        ) : (
          <ApiErrorStateComponent
            error={detailQuery.error}
            onRetry={() => {
              void detailQuery.refetch()
            }}
          />
        ))}

      {detailQuery.isSuccess && (
        <div className="space-y-6">
          <AuctionSummaryComponent auction={detailQuery.data} />

          {detailQuery.data.hideBetsHistory ? (
            <EmptyStateComponent
              title="История ставок скрыта"
              description="Организатор аукциона скрыл историю ставок для участников."
            />
          ) : betsQuery.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : betsQuery.isError ? (
            <ApiErrorStateComponent
              error={betsQuery.error}
              onRetry={() => {
                void betsQuery.refetch()
              }}
            />
          ) : betsQuery.data.items.length === 0 ? (
            <EmptyStateComponent title="Ставок пока нет" description="Как только появятся ставки, они отобразятся здесь." />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Участников: {betsQuery.data.participantsCount}
              </p>
              <BetsTableComponent bets={betsQuery.data.items} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
