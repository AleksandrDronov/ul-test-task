import type { AuctionDetailRoutePointVm } from '@/entities/auction'
import { OPERATION_TYPE_RU_LABEL } from '@/shared/config'
import { formatDateTime } from '@/shared/lib'
import { Badge } from '@/shared/ui'

type RoutePointCardProps = {
  point: AuctionDetailRoutePointVm
  hideAddressAndContacts: boolean
}

export const RoutePointCard = ({ point, hideAddressAndContacts }: RoutePointCardProps) => (
  <div className="rounded-md border border-border p-3">
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        {point.opType ? OPERATION_TYPE_RU_LABEL[point.opType] : '—'}
      </Badge>
      <span className="text-sm font-medium text-foreground">{point.city ?? '—'}</span>
    </div>
    <dl className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
      {!hideAddressAndContacts && point.address && (
        <div>
          <dt className="text-muted-foreground">Адрес</dt>
          <dd className="text-foreground">{point.address}</dd>
        </div>
      )}
      <div>
        <dt className="text-muted-foreground">Начало</dt>
        <dd className="text-foreground">{formatDateTime(point.startDate)}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Окончание</dt>
        <dd className="text-foreground">{formatDateTime(point.endDate)}</dd>
      </div>
      {!hideAddressAndContacts && (point.contactName ?? point.contactPhone) && (
        <div>
          <dt className="text-muted-foreground">Контакт</dt>
          <dd className="text-foreground">
            {point.contactName ?? '—'}
            {point.contactPhone ? `, ${point.contactPhone}` : ''}
          </dd>
        </div>
      )}
      {point.comment && (
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Комментарий</dt>
          <dd className="text-foreground">{point.comment}</dd>
        </div>
      )}
    </dl>
  </div>
)
