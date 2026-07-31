export type BetItemVm = {
  id: number | null
  createdAt: string | null
  organizationId: number | null
  organizationName: string | null
  organizationInn: string | null
  contactName: string | null
  contactPhone: string | null
  priceWithVat: number | null
  priceNoVat: number | null
  isRejected: boolean
  isWin: boolean
  isCounter: boolean
  place: number | null
  cancelReason: string | null
  transporterComment: string | null
}

export type BetListVm = {
  items: BetItemVm[]
  participantsCount: number
}
