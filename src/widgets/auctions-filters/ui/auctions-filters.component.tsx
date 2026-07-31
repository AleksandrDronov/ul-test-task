import { SlidersHorizontal } from 'lucide-react'
import { useFiltersUiStore } from '@/features/filter-auctions/model/filters-ui.store'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { AuctionsFiltersFormComponent } from './auctions-filters-form.component'

/**
 * Desktop renders the filters inline; mobile collapses them behind a
 * trigger button that opens a Sheet whose open state lives in the
 * `filtersOpen` Zustand store (task-8 dispatch resolution: filter *values*
 * stay in the URL, only this open/closed flag is UI-local state).
 */
export const AuctionsFiltersComponent = () => {
  const filtersOpen = useFiltersUiStore((state) => state.filtersOpen)
  const setFiltersOpen = useFiltersUiStore((state) => state.setFiltersOpen)

  return (
    <>
      <div className="hidden rounded-lg border border-border bg-card p-4 md:block">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Фильтры</h2>
        <AuctionsFiltersFormComponent />
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
              <AuctionsFiltersFormComponent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
