import type { AuctionDetailRoutePointVm } from '@/entities/auction'
import { RoutePointCard } from '../RoutePointCard'
import { DetailSection } from '../DetailSection'

type RouteSectionProps = {
  routes: AuctionDetailRoutePointVm[]
  hidePointsAddressAndContacts: boolean
}

export const RouteSection = ({ routes, hidePointsAddressAndContacts }: RouteSectionProps) => (
  <DetailSection title="Маршрут">
    <div className="space-y-3">
      {routes.map((point, index) => (
        <RoutePointCard
          key={index}
          point={point}
          hideAddressAndContacts={hidePointsAddressAndContacts}
        />
      ))}
    </div>
  </DetailSection>
)
