import type { AuctionListCargoVm } from '@/entities/auction'
import { formatNumber } from '@/shared/lib'

type AuctionCardCargoProps = {
  cargo: AuctionListCargoVm
}

export const AuctionCardCargo = ({ cargo }: AuctionCardCargoProps) => (
  <div className="flex flex-col border-b border-border pb-4 text-xs text-muted-foreground">
    <span>{cargo.name ?? 'Груз не указан'}</span>
    {cargo.weight !== null && <span>вес: {formatNumber(cargo.weight)} т</span>}
    {cargo.volume !== null && <span>объем: {formatNumber(cargo.volume)} м³</span>}
    {cargo.bodyType && <span>тип: {cargo.bodyType}</span>}
  </div>
)
