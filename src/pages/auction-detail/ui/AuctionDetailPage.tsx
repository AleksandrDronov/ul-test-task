import { getRouteApi, Link } from '@tanstack/react-router'
import type { AuctionDetailRoutePointVm } from '@/entities/auction'
import { useAuctionDetailQuery } from '@/entities/auction'
import { DEFAULT_SEARCH_PARAMS } from '@/features/filter-auctions'
import { ApiError } from '@/shared/api'
import {
  AUCTION_STATUS_RU_LABEL,
  AUCTION_TYPE_RU_LABEL,
  BID_MEASUREMENT_TYPE_RU_LABEL,
  OPERATION_TYPE_RU_LABEL,
  PAYMENT_DELAY_TYPE_RU_LABEL,
  TRADING_STATUS_RU_LABEL,
} from '@/shared/config'
import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatPrice,
  formatPricePerKm,
  formatYesNo,
} from '@/shared/lib'
import { ApiErrorState, Badge, Button, EmptyState, Skeleton } from '@/shared/ui'
import { DetailField, DetailSection } from './DetailSection'

const routeApi = getRouteApi('/auctions/$auctionUuid')

const BackToListLink = () => (
  <Button asChild variant="outline">
    <Link to="/" search={DEFAULT_SEARCH_PARAMS}>
      Вернуться к списку аукционов
    </Link>
  </Button>
)

const PageSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-32 w-full" />
    ))}
  </div>
)

const RoutePointCard = ({
  point,
  hideAddressAndContacts,
}: {
  point: AuctionDetailRoutePointVm
  hideAddressAndContacts: boolean
}) => (
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

export const AuctionDetailPage = () => {
  const { auctionUuid } = routeApi.useParams()
  const query = useAuctionDetailQuery(auctionUuid)

  const isNotFound = query.error instanceof ApiError && query.error.status === 404

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
      {query.isPending && <PageSkeleton />}

      {query.isError &&
        (isNotFound ? (
          <EmptyState
            title="Аукцион не найден"
            description="Возможно, он был удалён или ссылка неверна."
            action={<BackToListLink />}
          />
        ) : (
          <ApiErrorState
            error={query.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ))}

      {query.isSuccess &&
        (() => {
          const auction = query.data

          return (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Заявка № {auction.main.cargoNum ?? '—'}
                  </p>
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

              <DetailSection title="Основная информация">
                <DetailField label="Номер заявки" value={auction.main.cargoNum ?? '—'} />
                <DetailField label="Дата груза" value={formatDate(auction.main.cargoDate)} />
                <DetailField label="Создан" value={formatDateTime(auction.main.createdAt)} />
              </DetailSection>

              <DetailSection title="Организатор">
                <DetailField
                  label="Организация"
                  value={auction.organizer.organizationName ?? '—'}
                />
                <DetailField label="ИНН" value={auction.organizer.organizationInn ?? '—'} />
                <DetailField label="КПП" value={auction.organizer.organizationKpp ?? '—'} />
              </DetailSection>

              {!auction.hidePointsAddressAndContacts && auction.contacts.length > 0 && (
                <DetailSection title="Контакты">
                  <div className="space-y-3">
                    {auction.contacts.map((contact, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-foreground">{contact.name ?? '—'}</p>
                        <p className="text-muted-foreground">
                          {[contact.phone, contact.workPhone, contact.email]
                            .filter(Boolean)
                            .join(' · ') || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}

              <DetailSection title="Маршрут">
                <div className="space-y-3">
                  {auction.routes.map((point, index) => (
                    <RoutePointCard
                      key={index}
                      point={point}
                      hideAddressAndContacts={auction.hidePointsAddressAndContacts}
                    />
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="Груз и требования к транспорту">
                {!auction.noViewCargoPrice && (
                  <DetailField label="Стоимость груза" value={auction.cargo.price ?? '—'} />
                )}
                <DetailField label="Тип кузова" value={auction.cargo.bodyType ?? '—'} />
                <DetailField
                  label="Расстояние"
                  value={`${formatNumber(auction.cargo.distance)} км`}
                />
                <DetailField label="Количество ТС" value={formatNumber(auction.cargo.truckCount)} />
                <DetailField
                  label="Международная перевозка"
                  value={formatYesNo(auction.cargo.isInternational)}
                />
                <DetailField
                  label="Контейнерная перевозка"
                  value={formatYesNo(auction.cargo.containered)}
                />
                {auction.cargo.car && (
                  <>
                    <DetailField label="Тип ТС" value={auction.cargo.car.type ?? '—'} />
                    <DetailField
                      label="Грузоподъёмность"
                      value={`${formatNumber(auction.cargo.car.weight)} т`}
                    />
                    <DetailField
                      label="Объём кузова"
                      value={`${formatNumber(auction.cargo.car.volume)} м³`}
                    />
                    <DetailField
                      label="Габариты (Ш×Д×В)"
                      value={`${formatNumber(auction.cargo.car.width)}×${formatNumber(auction.cargo.car.length)}×${formatNumber(auction.cargo.car.height)} м`}
                    />
                  </>
                )}
              </DetailSection>

              <DetailSection title="Условия оплаты">
                <DetailField label="Форма оплаты" value={auction.payment.form ?? '—'} />
                <DetailField
                  label="Условие"
                  value={auction.payment.condition ?? auction.payment.conditionPredefined ?? '—'}
                />
                <DetailField
                  label="Отсрочка"
                  value={
                    auction.payment.delay !== null
                      ? `${formatNumber(auction.payment.delay)} ${auction.payment.delayType ? PAYMENT_DELAY_TYPE_RU_LABEL[auction.payment.delayType] : ''}`
                      : '—'
                  }
                />
                <DetailField label="Валюта" value={auction.payment.currencyCode ?? '—'} />
                <DetailField label="Предоплата" value={auction.payment.prepay ?? '—'} />
              </DetailSection>

              <DetailSection title="Параметры торгов">
                <DetailField
                  label="Единица измерения ставки"
                  value={
                    auction.trading.bidMeasurementType
                      ? BID_MEASUREMENT_TYPE_RU_LABEL[auction.trading.bidMeasurementType]
                      : '—'
                  }
                />
                <DetailField
                  label="Начало торгов"
                  value={formatDateTime(auction.trading.startTime)}
                />
                <DetailField
                  label="Окончание торгов"
                  value={formatDateTime(auction.trading.stopTime)}
                />
                <DetailField
                  label="Встречные ставки"
                  value={formatYesNo(auction.trading.allowCounterBets)}
                />
                <DetailField
                  label="Текущая цена"
                  value={formatPrice(auction.trading.price.current)}
                />
                <DetailField
                  label="Доступно для ставки"
                  value={formatPrice(auction.trading.price.available)}
                />
                <DetailField
                  label="Минимальная цена"
                  value={formatPrice(auction.trading.price.min)}
                />
                <DetailField
                  label="Максимальная цена"
                  value={formatPrice(auction.trading.price.max)}
                />
                <DetailField label="Шаг ставки" value={formatPrice(auction.trading.price.step)} />
                <DetailField
                  label="Цена за км"
                  value={formatPricePerKm(auction.trading.price.pricePerKm)}
                />
                {auction.trading.your.bet && (
                  <DetailField
                    label="Ваша последняя ставка"
                    value={`${formatPrice(auction.trading.your.lastBet)}${auction.trading.your.win ? ' · Победитель' : ''}`}
                  />
                )}
              </DetailSection>

              {auction.admittedOrganizations.length > 0 && (
                <DetailSection title="Допущенные организации">
                  <div className="space-y-2">
                    {auction.admittedOrganizations.map((organization, index) => (
                      <div
                        key={organization.id ?? index}
                        className="flex flex-wrap items-center gap-2 text-sm"
                      >
                        <span className="font-medium text-foreground">
                          {organization.name ?? '—'}
                        </span>
                        {organization.inn && (
                          <span className="text-muted-foreground">ИНН {organization.inn}</span>
                        )}
                        {organization.isMain && <Badge variant="outline">Основная</Badge>}
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}
            </div>
          )
        })()}
    </div>
  )
}
