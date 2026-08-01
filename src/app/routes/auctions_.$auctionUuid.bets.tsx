import { createFileRoute } from '@tanstack/react-router'
import { auctionDetailQueryOptions } from '@/entities/auction'
import { queryClient } from '@/app/query-client'
import { AuctionBetsPage } from '@/pages/auction-bets'

/**
 * Завершающий `_` исключает этот роут из вложенности в `auctions.$auctionUuid.tsx`
 * (см. https://tanstack.com/router — non-nested routes): без него файл стал бы
 * дочерним детальной страницы и требовал `<Outlet />` на ней, хотя
 * `/auctions/$auctionUuid/bets` — отдельный полноэкранный экран, а не вкладка в layout детальной страницы.
 */
export const Route = createFileRoute('/auctions_/$auctionUuid/bets')({
  loader: async ({ params: { auctionUuid } }) => {
    await queryClient.prefetchQuery(auctionDetailQueryOptions(auctionUuid))
  },
  component: AuctionBetsPage,
})
