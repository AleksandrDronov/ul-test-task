import { useId } from 'react'
import { CheckboxOption } from './CheckboxFilterFieldset'
import { type BooleanFilterOptionConfig } from '../model/auctions-filters.config'

export type BooleanFilterGroupProps = {
  options: BooleanFilterOptionConfig[]
  values: Record<BooleanFilterOptionConfig['key'], boolean | undefined>
  onToggle: (key: BooleanFilterOptionConfig['key'], checked: boolean | undefined) => void
}

export const BooleanFilterGroup = ({ options, values, onToggle }: BooleanFilterGroupProps) => {
  const idPrefix = useId()

  return (
    <div className="flex flex-col gap-1.5">
      {options.map((option) => (
        <CheckboxOption
          key={option.key}
          id={`${idPrefix}-${option.key}`}
          label={option.label}
          checked={values[option.key] ?? false}
          onChange={() => {
            onToggle(option.key, values[option.key] ? undefined : true)
          }}
        />
      ))}
    </div>
  )
}
