import type { AuctionListMetaVm } from '@/entities/auction/model/auction-list.vm'
import { Button } from '@/shared/ui/button'

export type AuctionsPaginationProps = {
  meta: AuctionListMetaVm
  onPageChange: (page: number) => void
}

export const AuctionsPagination = ({ meta, onPageChange }: AuctionsPaginationProps) => {
  const currentPage = meta.currentPage ?? 1
  const lastPage = meta.lastPage ?? 1

  if (lastPage <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Страницы списка аукционов"
      className="mt-6 flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-muted-foreground">
        {meta.total !== null
          ? `Показано ${String(meta.from ?? 0)}–${String(meta.to ?? 0)} из ${String(meta.total)}`
          : null}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => {
            onPageChange(currentPage - 1)
          }}
        >
          Назад
        </Button>
        <span className="text-sm text-muted-foreground">
          Стр. {currentPage} из {lastPage}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= lastPage}
          onClick={() => {
            onPageChange(currentPage + 1)
          }}
        >
          Далее
        </Button>
      </div>
    </nav>
  )
}
