import type { AuctionListRoutePointVm } from '@/entities/auction'
import { formatDate } from '@/shared/lib'

type AuctionCardRouteProps = {
  label: string
  point: AuctionListRoutePointVm | null
  hideAddress: boolean
}

export const AuctionCardRoute = ({ label, point, hideAddress }: AuctionCardRouteProps) => (
  <dl className="space-y-0.5">
    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
    <dd className="font-medium text-foreground">{point?.city ?? '—'}</dd>
    {!hideAddress && point?.address && (
      <>
        <dt className="sr-only">Адрес, {label.toLowerCase()}</dt>
        <dd className="text-xs text-muted-foreground">{point.address}</dd>
      </>
    )}
    <dt className="sr-only">Дата, {label.toLowerCase()}</dt>
    <dd className="text-xs text-muted-foreground">{formatDate(point?.date)}</dd>
  </dl>
)
