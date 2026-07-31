import { createFileRoute } from '@tanstack/react-router'
import { parseAuctionsSearchParams } from '@/features/filter-auctions/model/parse-auctions-search-params'
import { AuctionsListPageComponent } from '@/pages/auctions-list/ui/auctions-list-page.component'

export const Route = createFileRoute('/')({
  validateSearch: parseAuctionsSearchParams,
  component: AuctionsListPageComponent,
})
