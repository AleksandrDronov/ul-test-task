import { Link } from '@tanstack/react-router'
import { DEFAULT_SEARCH_PARAMS } from '@/features/filter-auctions'
import { Button } from '@/shared/ui'

export const BackToListLink = () => (
  <Button asChild variant="outline">
    <Link to="/" search={DEFAULT_SEARCH_PARAMS}>
      Вернуться к списку аукционов
    </Link>
  </Button>
)
