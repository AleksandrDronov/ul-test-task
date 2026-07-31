import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import {
  type ComponentProps,
  useEffect,
  useRef,
} from 'react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'
import { cn } from '@/shared/lib/cn'
import { Button, buttonVariants } from '@/shared/ui/button'

type CalendarProps = ComponentProps<typeof DayPicker> & {
  buttonVariant?: ComponentProps<typeof Button>['variant']
}

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: CalendarProps) => {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-background group/calendar p-1.5 [--cell-size:1.625rem] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={formatters}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-1.5 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-1.5', defaultClassNames.month),
        nav: cn(
          'pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-1',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'pointer-events-auto size-(--cell-size) shrink-0 select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'pointer-events-auto size-(--cell-size) shrink-0 select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex h-(--cell-size) items-center justify-center px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'flex h-(--cell-size) w-full items-center justify-center gap-1 text-xs font-medium',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[2px] relative rounded-md border px-1.5 py-0.5',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn('bg-popover absolute inset-0 opacity-0', defaultClassNames.dropdown),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-xs'
            : '[&>svg]:text-muted-foreground flex h-6 items-center gap-0.5 rounded-md pl-1.5 pr-1 text-xs [&>svg]:size-3',
          defaultClassNames.caption_label,
        ),
        month_grid: cn(
          'w-auto border-collapse [table-layout:fixed]',
          defaultClassNames.month_grid,
        ),
        weekdays: cn('mb-0.5', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground h-(--cell-size) w-(--cell-size) select-none p-0 text-center text-[0.6875rem] font-normal leading-none',
          defaultClassNames.weekday,
        ),
        weeks: cn(defaultClassNames.weeks),
        week: cn(defaultClassNames.week),
        week_number_header: cn('w-(--cell-size) select-none', defaultClassNames.week_number_header),
        week_number: cn('text-muted-foreground select-none text-xs', defaultClassNames.week_number),
        day: cn(
          'group/day relative h-(--cell-size) w-(--cell-size) p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md',
          defaultClassNames.day,
        ),
        range_start: cn('bg-accent rounded-l-md', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('bg-accent rounded-r-md', defaultClassNames.range_end),
        today: cn('data-[selected=true]:rounded-none', defaultClassNames.today),
        outside: cn('text-muted-foreground aria-selected:text-muted-foreground', defaultClassNames.outside),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(rootClassName)}
            {...rootProps}
          />
        ),
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className={cn('size-3.5', chevronClassName)} {...chevronProps} />
          }

          if (orientation === 'right') {
            return <ChevronRightIcon className={cn('size-3.5', chevronClassName)} {...chevronProps} />
          }

          return <ChevronDownIcon className={cn('size-3', chevronClassName)} {...chevronProps} />
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...weekProps }) => (
          <td {...weekProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

const CalendarDayButton = ({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) => {
  const defaultClassNames = getDefaultClassNames()
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus()
    }
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'group-data-[today=true]/day:bg-accent group-data-[today=true]/day:text-accent-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:ring-ring/50 h-(--cell-size) w-(--cell-size) shrink-0 gap-0 rounded-md p-0 text-sm font-normal leading-none data-[selected-single=true]:group-data-[today=true]/day:bg-primary data-[selected-single=true]:group-data-[today=true]/day:text-primary-foreground data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-1 group-data-[focused=true]/day:ring-offset-1',
        defaultClassNames.day_button,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
