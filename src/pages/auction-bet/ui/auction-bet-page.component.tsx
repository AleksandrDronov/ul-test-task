import { getRouteApi, Link } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction/api/use-auction-detail-query'
import { SetBetFormComponent } from '@/features/set-bet/ui/set-bet-form.component'
import { DEFAULT_SEARCH_PARAMS } from '@/features/filter-auctions/model/parse-auctions-search-params'
import { ApiError } from '@/shared/api/api-error'
import { ApiErrorStateComponent } from '@/shared/ui/api-error-state.component'
import { Button } from '@/shared/ui/button'
import { EmptyStateComponent } from '@/shared/ui/empty-state.component'
import { Skeleton } from '@/shared/ui/skeleton'
import { AuctionSummaryComponent } from '@/widgets/auction-summary/ui/auction-summary.component'

const routeApi = getRouteApi('/auctions_/$auctionUuid/bet')

const BackToListLink = () => (
  <Button asChild variant="outline">
    <Link to="/" search={DEFAULT_SEARCH_PARAMS}>
      Вернуться к списку аукционов
    </Link>
  </Button>
)

export const AuctionBetPageComponent = () => {
  const { auctionUuid } = routeApi.useParams()
  const query = useAuctionDetailQuery(auctionUuid)

  const isNotFound = query.error instanceof ApiError && query.error.status === 404

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Ставка на аукцион</h1>

      {query.isPending && (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {query.isError &&
        (isNotFound ? (
          <EmptyStateComponent
            title="Аукцион не найден"
            description="Возможно, он был удалён или ссылка неверна."
            action={<BackToListLink />}
          />
        ) : (
          <ApiErrorStateComponent
            error={query.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ))}

      {query.isSuccess && (
        <div className="space-y-6">
          <AuctionSummaryComponent auction={query.data} />

          <div className="rounded-lg border border-border bg-card p-4">
            <SetBetFormComponent
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
