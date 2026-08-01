import { useId } from 'react'
import { type AuctionsFilterPatch, type AuctionsSearchParams } from '@/features/filter-auctions'
import { useDebouncedFilterField } from '@/shared/lib'
import { NUMBER_RANGE_FILTERS, type NumberRangeFilterConfig } from './auctions-filters.config'

export type NumberRangeDebouncedFields = {
  fromValue: string
  toValue: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  flushFrom: () => void
  flushTo: () => void
}

type UseAuctionsFiltersFormParams = {
  /** Актуальные search-параметры фильтров из URL. */
  filters: AuctionsSearchParams
  /** Применяет патч к фильтрам (обычно через навигацию). */
  setFilters: (patch: AuctionsFilterPatch) => void
}

/**
 * Локальное состояние полей формы фильтров аукционов.
 * Текстовые и числовые поля (номер заявки, цена) обновляют URL с debounce;
 * чекбоксы, селекты и даты применяются мгновенно через `setFilters`.
 */
export const useAuctionsFiltersForm = ({ filters, setFilters }: UseAuctionsFiltersFormParams) => {
  const cargoNumId = useId()

  const cargoNum = useDebouncedFilterField<string>(filters.cargo_num ?? '', (value) => {
    setFilters({ cargo_num: value || undefined })
  })

  const currentPriceRange = NUMBER_RANGE_FILTERS[0]

  const priceFrom = useDebouncedFilterField<string>(
    filters[currentPriceRange.fromKey]?.toString() ?? '',
    (value) => {
      setFilters({ [currentPriceRange.fromKey]: value === '' ? undefined : Number(value) })
    },
  )

  const priceTo = useDebouncedFilterField<string>(
    filters[currentPriceRange.toKey]?.toString() ?? '',
    (value) => {
      setFilters({ [currentPriceRange.toKey]: value === '' ? undefined : Number(value) })
    },
  )

  const numberRangeFields: Record<NumberRangeFilterConfig['key'], NumberRangeDebouncedFields> = {
    [currentPriceRange.key]: {
      fromValue: priceFrom.value,
      toValue: priceTo.value,
      onFromChange: priceFrom.onChange,
      onToChange: priceTo.onChange,
      flushFrom: priceFrom.flush,
      flushTo: priceTo.flush,
    },
  }

  return {
    cargoNumId,
    cargoNum,
    numberRangeFields,
  }
}
