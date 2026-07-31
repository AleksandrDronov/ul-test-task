import { getRouteApi } from '@tanstack/react-router'
import { useAuctionsListQuery } from '@/entities/auction/api/use-auctions-list-query'
import { buildAuctionListRequest } from '@/features/filter-auctions/model/build-auction-list-request'
import { useAuctionsFilters } from '@/features/filter-auctions/model/use-auctions-filters'
import { AuctionCardComponent } from '@/widgets/auction-card/ui/auction-card.component'
import { AuctionsFiltersComponent } from '@/widgets/auctions-filters/ui/auctions-filters.component'
import { ApiErrorStateComponent } from '@/shared/ui/api-error-state.component'
import { EmptyStateComponent } from '@/shared/ui/empty-state.component'
import { Button } from '@/shared/ui/button'
import { AuctionsListSkeletonComponent } from './auctions-list-skeleton.component'
import { AuctionsPaginationComponent } from './auctions-pagination.component'

const routeApi = getRouteApi('/')

export const AuctionsListPageComponent = () => {
  const search = routeApi.useSearch()
  const { setPage, resetFilters } = useAuctionsFilters()

  const requestBody = buildAuctionListRequest(search)
  const query = useAuctionsListQuery(requestBody)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Аукционы</h1>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="md:w-72 md:shrink-0">
          <AuctionsFiltersComponent />
        </aside>

        <div className="min-w-0 flex-1">
          {query.isPending && <AuctionsListSkeletonComponent />}

          {query.isError && (
            <ApiErrorStateComponent
              error={query.error}
              onRetry={() => {
                void query.refetch()
              }}
            />
          )}

          {query.isSuccess && query.data.items.length === 0 && (
            <EmptyStateComponent
              title="Аукционы не найдены"
              description="Попробуйте изменить или сбросить фильтры поиска."
              action={
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Сбросить фильтры
                </Button>
              }
            />
          )}

          {query.isSuccess && query.data.items.length > 0 && (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {query.data.items.map((item, index) => (
                  <li key={item.auctionUuid ?? index}>
                    <AuctionCardComponent auction={item} />
                  </li>
                ))}
              </ul>
              <AuctionsPaginationComponent meta={query.data.meta} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
