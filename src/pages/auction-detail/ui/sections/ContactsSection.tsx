import type { AuctionDetailContactVm } from '@/entities/auction'
import { DetailSection } from '../DetailSection'

type ContactsSectionProps = {
  contacts: AuctionDetailContactVm[]
}

export const ContactsSection = ({ contacts }: ContactsSectionProps) => (
  <DetailSection title="Контакты">
    <div className="space-y-3">
      {contacts.map((contact, index) => (
        <div key={index} className="text-sm">
          <p className="font-medium text-foreground">{contact.name ?? '—'}</p>
          <p className="text-muted-foreground">
            {[contact.phone, contact.workPhone, contact.email].filter(Boolean).join(' · ') || '—'}
          </p>
        </div>
      ))}
    </div>
  </DetailSection>
)
