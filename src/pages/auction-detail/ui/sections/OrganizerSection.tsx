import type { AuctionDetailOrganizerVm } from '@/entities/auction'
import { DetailFieldsFromConfig, type DetailFieldConfig } from '../detail-field-config'
import { DetailSection } from '../DetailSection'

const ORGANIZER_FIELDS: DetailFieldConfig<AuctionDetailOrganizerVm>[] = [
  { label: 'Организация', getValue: (organizer) => organizer.organizationName ?? '—' },
  { label: 'ИНН', getValue: (organizer) => organizer.organizationInn ?? '—' },
  { label: 'КПП', getValue: (organizer) => organizer.organizationKpp ?? '—' },
]

type OrganizerSectionProps = {
  organizer: AuctionDetailOrganizerVm
}

export const OrganizerSection = ({ organizer }: OrganizerSectionProps) => (
  <DetailSection title="Организатор">
    <DetailFieldsFromConfig fields={ORGANIZER_FIELDS} data={organizer} />
  </DetailSection>
)
