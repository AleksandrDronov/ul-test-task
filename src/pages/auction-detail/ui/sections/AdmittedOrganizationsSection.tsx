import type { AuctionDetailAdmittedOrganizationVm } from '@/entities/auction'
import { Badge } from '@/shared/ui'
import { DetailSection } from '../DetailSection'

type AdmittedOrganizationsSectionProps = {
  organizations: AuctionDetailAdmittedOrganizationVm[]
}

export const AdmittedOrganizationsSection = ({
  organizations,
}: AdmittedOrganizationsSectionProps) => (
  <DetailSection title="Допущенные организации">
    <div className="space-y-2">
      {organizations.map((organization, index) => (
        <div
          key={organization.id ?? index}
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          <span className="font-medium text-foreground">{organization.name ?? '—'}</span>
          {organization.inn && (
            <span className="text-muted-foreground">ИНН {organization.inn}</span>
          )}
          {organization.isMain && <Badge variant="outline">Основная</Badge>}
        </div>
      ))}
    </div>
  </DetailSection>
)
