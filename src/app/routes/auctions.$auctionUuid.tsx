import { createFileRoute } from '@tanstack/react-router'
import { AuctionDetailPageComponent } from '@/pages/auction-detail/ui/auction-detail-page.component'

export const Route = createFileRoute('/auctions/$auctionUuid')({
  component: AuctionDetailPageComponent,
})
