import { useId } from 'react'
import { Input } from '@/shared/ui/input'
import { FilterField } from '@/widgets/auctions-filters/ui/FilterField'

export type NumberRangeFilterProps = {
  fromLabel: string
  toLabel: string
  fromValue: string
  toValue: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export const NumberRangeFilter = ({
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
}: NumberRangeFilterProps) => {
  const fromId = useId()
  const toId = useId()

  return (
    <div className="grid grid-cols-2 gap-3">
      <FilterField label={fromLabel} id={fromId} className="gap-1.5">
        <Input
          id={fromId}
          type="number"
          inputMode="decimal"
          min={0}
          value={fromValue}
          onChange={(event) => {
            onFromChange(event.target.value)
          }}
        />
      </FilterField>
      <FilterField label={toLabel} id={toId} className="gap-1.5">
        <Input
          id={toId}
          type="number"
          inputMode="decimal"
          min={0}
          value={toValue}
          onChange={(event) => {
            onToChange(event.target.value)
          }}
        />
      </FilterField>
    </div>
  )
}
