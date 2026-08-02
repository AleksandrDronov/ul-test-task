import type { AuctionDetailTradingVm } from '@/entities/auction'
import { BID_MEASUREMENT_TYPE_RU_LABEL } from '@/shared/config'
import { formatDateTime, formatPrice, formatPricePerKm, formatYesNo } from '@/shared/lib'
import { DetailFieldsFromConfig, type DetailFieldConfig } from '../detail-field-config'
import { DetailSection } from '../DetailSection'

const TRADING_FIELDS: DetailFieldConfig<AuctionDetailTradingVm>[] = [
  {
    label: 'Единица измерения ставки',
    getValue: (trading) =>
      trading.bidMeasurementType ? BID_MEASUREMENT_TYPE_RU_LABEL[trading.bidMeasurementType] : '—',
  },
  {
    label: 'Начало торгов',
    getValue: (trading) => formatDateTime(trading.startTime),
  },
  {
    label: 'Окончание торгов',
    getValue: (trading) => formatDateTime(trading.stopTime),
  },
  {
    label: 'Встречные ставки',
    getValue: (trading) => formatYesNo(trading.allowCounterBets),
  },
  {
    label: 'Текущая цена',
    getValue: (trading) => formatPrice(trading.price.current),
  },
  {
    label: 'Доступно для ставки',
    getValue: (trading) => formatPrice(trading.price.available),
  },
  {
    label: 'Минимальная цена',
    getValue: (trading) => formatPrice(trading.price.min),
  },
  {
    label: 'Максимальная цена',
    getValue: (trading) => formatPrice(trading.price.max),
  },
  {
    label: 'Шаг ставки',
    getValue: (trading) => formatPrice(trading.price.step),
  },
  {
    label: 'Цена за км',
    getValue: (trading) => formatPricePerKm(trading.price.pricePerKm),
  },
  {
    label: 'Ваша последняя ставка',
    getValue: (trading) =>
      `${formatPrice(trading.your.lastBet)}${trading.your.win ? ' · Победитель' : ''}`,
    hidden: (trading) => !trading.your.bet,
  },
]

type TradingSectionProps = {
  trading: AuctionDetailTradingVm
}

export const TradingSection = ({ trading }: TradingSectionProps) => (
  <DetailSection title="Параметры торгов">
    <DetailFieldsFromConfig fields={TRADING_FIELDS} data={trading} />
  </DetailSection>
)
