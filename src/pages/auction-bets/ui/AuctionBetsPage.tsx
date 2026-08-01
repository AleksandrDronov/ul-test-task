import { getRouteApi, Link } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction'
import { useAuctionBetsQuery } from '@/entities/bet'
import { DEFAULT_SEARCH_PARAMS } from '@/features/filter-auctions'
import { ApiError } from '@/shared/api'
import { ApiErrorState, Button, EmptyState, Skeleton } from '@/shared/ui'
import { AuctionSummary } from '@/widgets/auction-summary'
import { BetsTable } from '@/widgets/bets-table'

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

export const AuctionBetsPage = () => {
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
          <EmptyState
            title="Аукцион не найден"
            description="Возможно, он был удалён или ссылка неверна."
            action={<BackToListLink />}
          />
        ) : (
          <ApiErrorState
            error={detailQuery.error}
            onRetry={() => {
              void detailQuery.refetch()
            }}
          />
        ))}

      {detailQuery.isSuccess && (
        <div className="space-y-6">
          <AuctionSummary auction={detailQuery.data} />

          {detailQuery.data.hideBetsHistory ? (
            <EmptyState
              title="История ставок скрыта"
              description="Организатор аукциона скрыл историю ставок для участников."
            />
          ) : betsQuery.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : betsQuery.isError ? (
            <ApiErrorState
              error={betsQuery.error}
              onRetry={() => {
                void betsQuery.refetch()
              }}
            />
          ) : betsQuery.data.items.length === 0 ? (
            <EmptyState
              title="Ставок пока нет"
              description="Как только появятся ставки, они отобразятся здесь."
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Участников: {betsQuery.data.participantsCount}
              </p>
              <BetsTable bets={betsQuery.data.items} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
