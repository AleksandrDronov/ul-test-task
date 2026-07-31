import { createFileRoute } from '@tanstack/react-router'
import { parseAuctionsSearchParams } from '@/features/filter-auctions'
import { AuctionsListPage } from '@/pages/auctions-list'

export const Route = createFileRoute('/')({
  validateSearch: parseAuctionsSearchParams,
  component: AuctionsListPage,
})
