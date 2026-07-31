import { getRouteApi } from '@tanstack/react-router'
import { useAuctionsListQuery } from '@/entities/auction'
import { buildAuctionListRequest, useAuctionsFilters } from '@/features/filter-auctions'
import { AuctionCard } from '@/widgets/auction-card'
import { AuctionsFilters } from '@/widgets/auctions-filters'
import { ApiErrorState, Button, EmptyState } from '@/shared/ui'
import { AuctionsListSkeleton } from './AuctionsListSkeleton'
import { AuctionsPagination } from './AuctionsPagination'

const routeApi = getRouteApi('/')

export const AuctionsListPage = () => {
  const search = routeApi.useSearch()
  const { setPage, resetFilters } = useAuctionsFilters()

  const requestBody = buildAuctionListRequest(search)
  const query = useAuctionsListQuery(requestBody)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Аукционы</h1>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="md:w-72 md:shrink-0">
          <AuctionsFilters />
        </aside>

        <div className="min-w-0 flex-1">
          {query.isPending && <AuctionsListSkeleton />}

          {query.isError && (
            <ApiErrorState
              error={query.error}
              onRetry={() => {
                void query.refetch()
              }}
            />
          )}

          {query.isSuccess && query.data.items.length === 0 && (
            <EmptyState
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
                    <AuctionCard auction={item} />
                  </li>
                ))}
              </ul>
              <AuctionsPagination meta={query.data.meta} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
