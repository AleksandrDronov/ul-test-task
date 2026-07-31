import { useId } from 'react'
import {
  dateToIsoRangeEnd,
  dateToIsoRangeStart,
  isoToDate,
} from '@/shared/lib/date-input'
import { DatePicker, type DatePickerProps } from '@/shared/ui/date-picker'
import { FilterField } from './FilterField'

export type DateRangeFilterProps = {
  fromLabel: string
  toLabel: string
  fromValue: string | undefined
  toValue: string | undefined
  onFromChange: (value: string | undefined) => void
  onToChange: (value: string | undefined) => void
}

export const DateRangeFilter = ({
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
}: DateRangeFilterProps) => {
  const fromId = useId()
  const toId = useId()

  const handleFromChange: DatePickerProps['onChange'] = (date) => {
    onFromChange(dateToIsoRangeStart(date))
  }

  const handleToChange: DatePickerProps['onChange'] = (date) => {
    onToChange(dateToIsoRangeEnd(date))
  }

  const fromDate = isoToDate(fromValue)
  const toDate = isoToDate(toValue)

  return (
    <div className="flex flex-col gap-2">
      <FilterField label={fromLabel} id={fromId} className="gap-1.5">
        <DatePicker
          id={fromId}
          value={fromDate}
          onChange={handleFromChange}
          toDate={toDate}
        />
      </FilterField>
      <FilterField label={toLabel} id={toId} className="gap-1.5">
        <DatePicker
          id={toId}
          value={toDate}
          onChange={handleToChange}
          fromDate={fromDate}
        />
      </FilterField>
    </div>
  )
}
