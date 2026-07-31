import { createFileRoute } from '@tanstack/react-router'
import { parseAuctionsSearchParams } from '@/features/filter-auctions/model/parse-auctions-search-params'
import { AuctionsListPage } from '@/pages/auctions-list/ui/AuctionsListPage'

export const Route = createFileRoute('/')({
  validateSearch: parseAuctionsSearchParams,
  component: AuctionsListPage,
})
