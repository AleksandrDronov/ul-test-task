import { createFileRoute } from '@tanstack/react-router'
import { AuctionDetailPage } from '@/pages/auction-detail/ui/AuctionDetailPage'

export const Route = createFileRoute('/auctions/$auctionUuid')({
  component: AuctionDetailPage,
})
