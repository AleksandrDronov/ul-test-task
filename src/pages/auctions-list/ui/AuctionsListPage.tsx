import { useAuctionsListWithFilters } from '@/features/filter-auctions'
import { AuctionCard } from '@/widgets/auction-card'
import { AuctionsFilters } from '@/widgets/auctions-filters'
import { AsyncQueryView, Button, EmptyState } from '@/shared/ui'
import { AuctionsListSkeleton } from './AuctionsListSkeleton'
import { AuctionsPagination } from './AuctionsPagination'

export const AuctionsListPage = () => {
  const { query, setPage, resetFilters } = useAuctionsListWithFilters()

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Аукционы</h1>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="md:w-72 md:shrink-0">
          <AuctionsFilters />
        </aside>

        <div className="min-w-0 flex-1">
          <AsyncQueryView
            query={query}
            pending={<AuctionsListSkeleton />}
            isEmpty={(data) => data.items.length === 0}
            empty={
              <EmptyState
                title="Аукционы не найдены"
                description="Попробуйте изменить или сбросить фильтры поиска."
                action={
                  <Button type="button" variant="outline" onClick={resetFilters}>
                    Сбросить фильтры
                  </Button>
                }
              />
            }
          >
            {(data) => (
              <>
                <ul className="grid gap-4 lg:grid-cols-2">
                  {data.items.map((item, index) => (
                    <li key={item.auctionUuid ?? index}>
                      <AuctionCard auction={item} />
                    </li>
                  ))}
                </ul>
                <AuctionsPagination meta={data.meta} onPageChange={setPage} />
              </>
            )}
          </AsyncQueryView>
        </div>
      </div>
    </div>
  )
}
