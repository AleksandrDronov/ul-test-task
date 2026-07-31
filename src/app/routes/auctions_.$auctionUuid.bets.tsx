import { createFileRoute } from '@tanstack/react-router'
import { AuctionBetsPageComponent } from '@/pages/auction-bets/ui/auction-bets-page.component'

/**
 * Завершающий `_` исключает этот роут из вложенности в `auctions.$auctionUuid.tsx`
 * (см. https://tanstack.com/router — non-nested routes): без него файл стал бы
 * дочерним детальной страницы и требовал `<Outlet />` на ней, хотя
 * `/auctions/$auctionUuid/bets` — отдельный полноэкранный экран, а не вкладка в layout детальной страницы.
 */
export const Route = createFileRoute('/auctions_/$auctionUuid/bets')({
  component: AuctionBetsPageComponent,
})
