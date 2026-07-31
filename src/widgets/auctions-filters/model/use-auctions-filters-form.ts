import { useId } from 'react'
import { type AuctionsSearchParams } from '@/features/filter-auctions/model/auctions-search-params.schema'
import { type AuctionsFilterPatch } from '@/features/filter-auctions/model/use-auctions-filters'
import { useDebouncedFilterField } from '@/shared/lib/use-debounced-filter-field'

type UseAuctionsFiltersFormParams = {
  filters: AuctionsSearchParams
  setFilters: (patch: AuctionsFilterPatch) => void
}

export const useAuctionsFiltersForm = ({ filters, setFilters }: UseAuctionsFiltersFormParams) => {
  const cargoNumId = useId()

  const [cargoNum, setCargoNum] = useDebouncedFilterField<string>(filters.cargo_num ?? '', (value) => {
    setFilters({ cargo_num: value || undefined })
  })

  const [priceFrom, setPriceFrom] = useDebouncedFilterField<string>(
    filters.current_price_from?.toString() ?? '',
    (value) => {
      setFilters({ current_price_from: value === '' ? undefined : Number(value) })
    },
  )

  const [priceTo, setPriceTo] = useDebouncedFilterField<string>(
    filters.current_price_to?.toString() ?? '',
    (value) => {
      setFilters({ current_price_to: value === '' ? undefined : Number(value) })
    },
  )

  const applyImmediate = (patch: AuctionsFilterPatch): void => {
    setFilters(patch)
  }

  return {
    cargoNumId,
    cargoNum,
    setCargoNum,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
    applyImmediate,
  }
}
