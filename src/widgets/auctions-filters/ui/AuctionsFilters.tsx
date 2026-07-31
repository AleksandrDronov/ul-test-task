import { SlidersHorizontal } from 'lucide-react'
import { useAuctionsFilters, useFiltersUiStore } from '@/features/filter-auctions'
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui'
import { AuctionsFiltersForm } from './AuctionsFiltersForm'

export const AuctionsFilters = () => {
  const filtersOpen = useFiltersUiStore((state) => state.filtersOpen)
  const setFiltersOpen = useFiltersUiStore((state) => state.setFiltersOpen)
  const filterActions = useAuctionsFilters()

  return (
    <>
      <div className="hidden rounded-lg border border-border bg-card p-4 md:block">
        <h2 className="mb-4 text-base font-semibold text-foreground">Фильтры</h2>
        <AuctionsFiltersForm {...filterActions} />
      </div>

      <div className="md:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFiltersOpen(true)
          }}
          aria-haspopup="dialog"
        >
          <SlidersHorizontal aria-hidden="true" />
          Фильтры
        </Button>

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <AuctionsFiltersForm {...filterActions} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
