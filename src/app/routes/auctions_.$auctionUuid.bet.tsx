import { createFileRoute } from '@tanstack/react-router'
import { AuctionBetPageComponent } from '@/pages/auction-bet/ui/auction-bet-page.component'

/** См. `auctions_.$auctionUuid.bets.tsx` — почему этот сегмент вынесён из вложенности. */
export const Route = createFileRoute('/auctions_/$auctionUuid/bet')({
  component: AuctionBetPageComponent,
})
