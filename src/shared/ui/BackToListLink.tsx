import { Link } from '@tanstack/react-router'
import { DEFAULT_AUCTIONS_LIST_SEARCH } from '@/shared/config'
import { Button } from './button'

export const BackToListLink = () => (
  <Button asChild variant="outline">
    <Link to="/" search={DEFAULT_AUCTIONS_LIST_SEARCH}>
      Вернуться к списку аукционов
    </Link>
  </Button>
)
