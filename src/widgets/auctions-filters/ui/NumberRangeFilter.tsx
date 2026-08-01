import { type KeyboardEvent, useId } from 'react'
import { Input } from '@/shared/ui'
import { FilterField } from './FilterField'

export type NumberRangeFilterProps = {
  fromLabel: string
  toLabel: string
  fromValue: string
  toValue: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onFromBlur?: () => void
  onToBlur?: () => void
}

const handleEnterFlush = (
  flush: (() => void) | undefined,
  event: KeyboardEvent<HTMLInputElement>,
): void => {
  if (event.key !== 'Enter' || !flush) return

  event.preventDefault()
  flush()
}

export const NumberRangeFilter = ({
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  onFromBlur,
  onToBlur,
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
          onBlur={onFromBlur}
          onKeyDown={(event) => {
            handleEnterFlush(onFromBlur, event)
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
          onBlur={onToBlur}
          onKeyDown={(event) => {
            handleEnterFlush(onToBlur, event)
          }}
        />
      </FilterField>
    </div>
  )
}
