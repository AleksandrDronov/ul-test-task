import { format, startOfDay } from 'date-fns'
import { ru as dateFnsRu } from 'date-fns/locale'
import { CalendarIcon, ChevronDown, X } from 'lucide-react'
import { type KeyboardEvent, type MouseEvent, useState } from 'react'
import { ru as dayPickerRu } from 'react-day-picker/locale'
import { cn } from '@/shared/lib'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type DatePickerProps = {
  id?: string
  value: Date | undefined
  onChange: (value: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  fromDate?: Date
  toDate?: Date
  className?: string
}

const isDateDisabled = (date: Date, fromDate?: Date, toDate?: Date) => {
  const day = startOfDay(date)

  if (fromDate && day < startOfDay(fromDate)) {
    return true
  }

  if (toDate && day > startOfDay(toDate)) {
    return true
  }

  return false
}

export const DatePicker = ({
  id,
  value,
  onChange,
  placeholder = 'Выберите дату',
  disabled = false,
  fromDate,
  toDate,
  className,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    onChange(date)
    setOpen(false)
  }

  const handleClear = () => {
    onChange(undefined)
  }

  const handleClearClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleClear()
  }

  const handleClearKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    handleClear()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-label={value ? format(value, 'dd.MM.yyyy', { locale: dateFnsRu }) : placeholder}
          className={cn(
            'flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarIcon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">
              {value ? format(value, 'dd.MM.yyyy', { locale: dateFnsRu }) : placeholder}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Очистить дату"
                onClick={handleClearClick}
                onKeyDown={handleClearKeyDown}
                className="rounded-sm p-0.5 opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="size-3.5" aria-hidden />
              </span>
            )}
            <ChevronDown className="size-4 opacity-50" aria-hidden />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          locale={dayPickerRu}
          captionLayout="dropdown"
          navLayout="around"
          disabled={(date) => isDateDisabled(date, fromDate, toDate)}
          defaultMonth={value ?? fromDate ?? toDate}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
