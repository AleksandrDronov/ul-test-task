import type { AuctionDetailVm } from '@/entities/auction'
import { AuctionDetailHeader } from './AuctionDetailHeader'
import { AdmittedOrganizationsSection } from './sections/AdmittedOrganizationsSection'
import { CargoSection } from './sections/CargoSection'
import { ContactsSection } from './sections/ContactsSection'
import { MainInfoSection } from './sections/MainInfoSection'
import { OrganizerSection } from './sections/OrganizerSection'
import { PaymentSection } from './sections/PaymentSection'
import { RouteSection } from './sections/RouteSection'
import { TradingSection } from './sections/TradingSection'

type AuctionDetailContentProps = {
  auction: AuctionDetailVm
  auctionUuid: string
}

export const AuctionDetailContent = ({ auction, auctionUuid }: AuctionDetailContentProps) => (
  <div className="space-y-6">
    <AuctionDetailHeader auction={auction} auctionUuid={auctionUuid} />
    <MainInfoSection main={auction.main} />
    <OrganizerSection organizer={auction.organizer} />
    {!auction.hidePointsAddressAndContacts && auction.contacts.length > 0 && (
      <ContactsSection contacts={auction.contacts} />
    )}
    <RouteSection
      routes={auction.routes}
      hidePointsAddressAndContacts={auction.hidePointsAddressAndContacts}
    />
    <CargoSection cargo={auction.cargo} noViewCargoPrice={auction.noViewCargoPrice} />
    <PaymentSection payment={auction.payment} />
    <TradingSection trading={auction.trading} />
    {auction.admittedOrganizations.length > 0 && (
      <AdmittedOrganizationsSection organizations={auction.admittedOrganizations} />
    )}
  </div>
)
