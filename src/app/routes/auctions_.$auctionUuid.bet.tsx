import { createFileRoute } from '@tanstack/react-router'
import { AuctionBetPageComponent } from '@/pages/auction-bet/ui/auction-bet-page.component'

/** See `auctions_.$auctionUuid.bets.tsx` for why this segment is un-nested. */
export const Route = createFileRoute('/auctions_/$auctionUuid/bet')({
  component: AuctionBetPageComponent,
})
