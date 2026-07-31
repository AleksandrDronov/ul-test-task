import { SlidersHorizontal } from 'lucide-react'
import { useFiltersUiStore } from '@/features/filter-auctions/model/filters-ui.store'
import { useAuctionsFilters } from '@/features/filter-auctions/model/use-auctions-filters'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { AuctionsFiltersFormComponent } from './auctions-filters-form.component'

/**
 * На десктопе фильтры отображаются inline; на мобильных они скрыты за кнопкой,
 * открывающей Sheet. Состояние открытия хранится в Zustand-сторе `filtersOpen`
 * (разрешение task-8: значения фильтров в URL, только флаг открыт/закрыт — локальное UI-состояние).
 */
export const AuctionsFiltersComponent = () => {
  const filtersOpen = useFiltersUiStore((state) => state.filtersOpen)
  const setFiltersOpen = useFiltersUiStore((state) => state.setFiltersOpen)
  const filterActions = useAuctionsFilters()

  return (
    <>
      <div className="hidden rounded-lg border border-border bg-card p-4 md:block">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Фильтры</h2>
        <AuctionsFiltersFormComponent {...filterActions} />
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
              <AuctionsFiltersFormComponent {...filterActions} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
