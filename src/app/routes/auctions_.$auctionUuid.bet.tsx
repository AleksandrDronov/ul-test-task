import { createFileRoute } from '@tanstack/react-router'
import { AuctionBetPage } from '@/pages/auction-bet/ui/AuctionBetPage'

/** См. `auctions_.$auctionUuid.bets.tsx` — почему этот сегмент вынесён из вложенности. */
export const Route = createFileRoute('/auctions_/$auctionUuid/bet')({
  component: AuctionBetPage,
})
