import { Link } from '@tanstack/react-router'
import type { AuctionDetailVm } from '@/entities/auction'
import {
  AUCTION_STATUS_RU_LABEL,
  AUCTION_TYPE_RU_LABEL,
  TRADING_STATUS_RU_LABEL,
} from '@/shared/config'
import { Badge, Button } from '@/shared/ui'

type AuctionDetailHeaderProps = {
  auction: AuctionDetailVm
  auctionUuid: string
}

export const AuctionDetailHeader = ({ auction, auctionUuid }: AuctionDetailHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Заявка № {auction.main.cargoNum ?? '—'}</p>
      <h1 className="text-xl font-semibold text-foreground">
        {auction.main.aucType ? AUCTION_TYPE_RU_LABEL[auction.main.aucType] : 'Аукцион'}
      </h1>
      <div className="mt-2 flex flex-wrap gap-2">
        {auction.trading.status && (
          <Badge variant="secondary">
            {AUCTION_STATUS_RU_LABEL[auction.trading.status]}
          </Badge>
        )}
        {auction.trading.statusMobile && (
          <Badge variant="outline">
            {TRADING_STATUS_RU_LABEL[auction.trading.statusMobile]}
          </Badge>
        )}
      </div>
    </div>
    {(!auction.hideBetsHistory || auction.canSetBet) && (
      <div className="flex flex-wrap gap-2">
        {!auction.hideBetsHistory && (
          <Button asChild variant="outline">
            <Link to="/auctions/$auctionUuid/bets" params={{ auctionUuid }}>
              Смотреть ставки
            </Link>
          </Button>
        )}
        {auction.canSetBet && (
          <Button asChild>
            <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid }}>
              {auction.trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
            </Link>
          </Button>
        )}
      </div>
    )}
  </div>
)
