import type { AuctionDetailMainVm } from '@/entities/auction'
import { formatDate, formatDateTime } from '@/shared/lib'
import { DetailFieldsFromConfig, type DetailFieldConfig } from '../detail-field-config'
import { DetailSection } from '../DetailSection'

const MAIN_INFO_FIELDS: DetailFieldConfig<AuctionDetailMainVm>[] = [
  { label: 'Номер заявки', getValue: (main) => main.cargoNum ?? '—' },
  { label: 'Дата груза', getValue: (main) => formatDate(main.cargoDate) },
  { label: 'Создан', getValue: (main) => formatDateTime(main.createdAt) },
]

type MainInfoSectionProps = {
  main: AuctionDetailMainVm
}

export const MainInfoSection = ({ main }: MainInfoSectionProps) => (
  <DetailSection title="Основная информация">
    <DetailFieldsFromConfig fields={MAIN_INFO_FIELDS} data={main} />
  </DetailSection>
)
