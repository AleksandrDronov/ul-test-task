import { useId } from 'react'
import { type AuctionsSearchParams } from '@/features/filter-auctions'
import { CheckboxOption } from './CheckboxFilterFieldset'
import { type BooleanFilterFieldKey, type BooleanFilterOptionConfig } from '../model/auctions-filters.config'

export type BooleanFilterGroupProps = {
  options: BooleanFilterOptionConfig[]
  filters: Pick<AuctionsSearchParams, BooleanFilterFieldKey>
  onToggle: (key: BooleanFilterFieldKey, checked: boolean | undefined) => void
}

export const BooleanFilterGroup = ({ options, filters, onToggle }: BooleanFilterGroupProps) => {
  const idPrefix = useId()

  return (
    <div className="flex flex-col gap-1.5">
      {options.map((option) => (
        <CheckboxOption
          key={option.key}
          id={`${idPrefix}-${option.key}`}
          label={option.label}
          checked={filters[option.key] ?? false}
          onChange={() => {
            onToggle(option.key, filters[option.key] ? undefined : true)
          }}
        />
      ))}
    </div>
  )
}
