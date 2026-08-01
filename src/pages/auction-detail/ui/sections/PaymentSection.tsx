import type { AuctionDetailPaymentVm } from '@/entities/auction'
import { PAYMENT_DELAY_TYPE_RU_LABEL } from '@/shared/config'
import { formatNumber } from '@/shared/lib'
import { DetailFieldsFromConfig, type DetailFieldConfig } from '../detail-field-config'
import { DetailSection } from '../DetailSection'

const PAYMENT_FIELDS: DetailFieldConfig<AuctionDetailPaymentVm>[] = [
  { label: 'Форма оплаты', getValue: (payment) => payment.form ?? '—' },
  {
    label: 'Условие',
    getValue: (payment) => payment.condition ?? payment.conditionPredefined ?? '—',
  },
  {
    label: 'Отсрочка',
    getValue: (payment) =>
      payment.delay !== null
        ? `${formatNumber(payment.delay)} ${payment.delayType ? PAYMENT_DELAY_TYPE_RU_LABEL[payment.delayType] : ''}`
        : '—',
  },
  { label: 'Валюта', getValue: (payment) => payment.currencyCode ?? '—' },
  { label: 'Предоплата', getValue: (payment) => payment.prepay ?? '—' },
]

type PaymentSectionProps = {
  payment: AuctionDetailPaymentVm
}

export const PaymentSection = ({ payment }: PaymentSectionProps) => (
  <DetailSection title="Условия оплаты">
    <DetailFieldsFromConfig fields={PAYMENT_FIELDS} data={payment} />
  </DetailSection>
)
