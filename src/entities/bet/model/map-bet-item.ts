import type { components } from '@/shared/api/types/openapi'
import type { BetItemVm, BetListVm } from './bet.vm'

type BetItem = components['schemas']['BetItem']

export const mapBetItemDtoToVm = (dto: BetItem): BetItemVm => ({
  id: dto.id ?? null,
  createdAt: dto.created_at ?? null,
  organizationId: dto.organization_id ?? null,
  organizationName: dto.organization_name ?? null,
  organizationInn: dto.organization_inn ?? null,
  contactName: dto.contact_name ?? null,
  contactPhone: dto.contact_phone ?? null,
  priceWithVat: dto.price_with_vat ?? null,
  priceNoVat: dto.price_no_vat ?? null,
  isRejected: dto.is_rejected ?? false,
  isWin: dto.is_win ?? false,
  isCounter: dto.is_counter ?? false,
  place: dto.place ?? null,
  cancelReason: dto.cancel_reason ?? null,
  transporterComment: dto.transporter_comment ?? null,
})

/** `participantsCount` = number of distinct `organization_id` values across the bets, not the bet count. */
export const mapBetListToVm = (bets: BetItem[]): BetListVm => {
  const items = bets.map(mapBetItemDtoToVm)

  const organizationIds = new Set(
    items.map((item) => item.organizationId).filter((id): id is number => id !== null),
  )

  return { items, participantsCount: organizationIds.size }
}
