import { createFileRoute } from '@tanstack/react-router'
import { AuctionBetsPageComponent } from '@/pages/auction-bets/ui/auction-bets-page.component'

/**
 * The trailing `_` un-nests this route from `auctions.$auctionUuid.tsx`
 * (see https://tanstack.com/router non-nested routes): without it, this file
 * would become a child of the detail route and require the detail page to
 * render an `<Outlet />`, even though `/auctions/$auctionUuid/bets` is its
 * own full-page screen, not a tab within the detail layout.
 */
export const Route = createFileRoute('/auctions_/$auctionUuid/bets')({
  component: AuctionBetsPageComponent,
})
