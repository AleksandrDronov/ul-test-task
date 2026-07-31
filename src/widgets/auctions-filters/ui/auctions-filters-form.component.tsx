import { useId } from 'react'
import {
  AUC_TYPE_VALUES,
  TRADING_STATUS_VALUES,
} from '@/features/filter-auctions/model/auctions-search-params.schema'
import {
  dateInputValueToIsoRangeEnd,
  dateInputValueToIsoRangeStart,
  isoToDateInputValue,
} from '@/features/filter-auctions/model/date-input'
import { useAuctionsFilters } from '@/features/filter-auctions/model/use-auctions-filters'
import { CITY_NAMES } from '@/shared/api/msw/cities'
import { AUCTION_STATUS_LABEL_BY_CODE, isAuctionStatusCode } from '@/shared/config/auction-status-map'
import { AUCTION_TYPE_RU_LABEL, AUCTION_STATUS_RU_LABEL, TRADING_STATUS_RU_LABEL } from '@/shared/config/status-labels'
import { useDebouncedFilterField } from '@/shared/lib/use-debounced-filter-field'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'

/** Derived from the exported const (not `openapi.d.ts`) so widgets never import DTO types directly. */
type TradingStatus = (typeof TRADING_STATUS_VALUES)[number]

const ANY_CITY_VALUE = '__any__'

const STATUS_CODE_OPTIONS = Object.entries(AUCTION_STATUS_LABEL_BY_CODE)
  .map(([code, label]) => ({ code: Number(code), label: AUCTION_STATUS_RU_LABEL[label] }))
  .filter((option) => isAuctionStatusCode(option.code))

const toggleInArray = <Value,>(values: Value[] | undefined, value: Value): Value[] | undefined => {
  const set = new Set(values ?? [])
  if (set.has(value)) {
    set.delete(value)
  } else {
    set.add(value)
  }
  const next = Array.from(set)
  return next.length > 0 ? next : undefined
}

type CheckboxOptionProps = {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}

const CheckboxOption = ({ id, label, checked, onChange }: CheckboxOptionProps) => (
  <div className="flex items-center gap-2">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="size-4 shrink-0 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
    <Label htmlFor={id} className="cursor-pointer font-normal">
      {label}
    </Label>
  </div>
)

export const AuctionsFiltersFormComponent = () => {
  const cargoNumId = useId()
  const priceFromId = useId()
  const priceToId = useId()
  const loadDateFromId = useId()
  const loadDateToId = useId()
  const loadCityId = useId()
  const unloadCityId = useId()
  const availableOnlyId = useId()
  const myBidsOnlyId = useId()

  const { filters, setFilters, resetFilters } = useAuctionsFilters()

  const [cargoNum, setCargoNum] = useDebouncedFilterField(filters.cargo_num ?? '', (value) => {
    setFilters({ cargo_num: value || undefined })
  })

  const [priceFrom, setPriceFrom] = useDebouncedFilterField(
    filters.current_price_from?.toString() ?? '',
    (value) => {
      setFilters({ current_price_from: value === '' ? undefined : Number(value) })
    },
  )

  const [priceTo, setPriceTo] = useDebouncedFilterField(
    filters.current_price_to?.toString() ?? '',
    (value) => {
      setFilters({ current_price_to: value === '' ? undefined : Number(value) })
    },
  )

  const applyImmediate = (patch: Parameters<typeof setFilters>[0]): void => {
    setFilters(patch)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
      }}
      className="flex flex-col gap-5"
      aria-label="Фильтры аукционов"
    >
      <div className="space-y-1.5">
        <Label htmlFor={cargoNumId}>Номер заявки</Label>
        <Input
          id={cargoNumId}
          value={cargoNum}
          onChange={(event) => {
            setCargoNum(event.target.value)
          }}
          placeholder="00000000501"
        />
      </div>

      <Separator />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Статус аукциона</legend>
        <div className="flex flex-col gap-1.5">
          {STATUS_CODE_OPTIONS.map((option) => (
            <CheckboxOption
              key={option.code}
              id={`auction-status-${String(option.code)}`}
              label={option.label}
              checked={Boolean(filters.statuses?.includes(option.code))}
              onChange={() => {
                applyImmediate({ statuses: toggleInArray(filters.statuses, option.code) })
              }}
            />
          ))}
        </div>
      </fieldset>

      <Separator />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Статус участия</legend>
        <div className="flex flex-col gap-1.5">
          {TRADING_STATUS_VALUES.filter((value): value is TradingStatus => value !== 'Unknown').map(
            (value) => (
              <CheckboxOption
                key={value}
                id={`trading-status-${value}`}
                label={TRADING_STATUS_RU_LABEL[value]}
                checked={Boolean(filters.status?.includes(value))}
                onChange={() => {
                  applyImmediate({ status: toggleInArray(filters.status, value) })
                }}
              />
            ),
          )}
        </div>
      </fieldset>

      <Separator />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Тип аукциона</legend>
        <div className="flex flex-col gap-1.5">
          {AUC_TYPE_VALUES.map((value) => (
            <CheckboxOption
              key={value}
              id={`auc-type-${value}`}
              label={AUCTION_TYPE_RU_LABEL[value]}
              checked={Boolean(filters.auc_type?.includes(value))}
              onChange={() => {
                applyImmediate({ auc_type: toggleInArray(filters.auc_type, value) })
              }}
            />
          ))}
        </div>
      </fieldset>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor={loadCityId}>Город погрузки</Label>
        <Select
          value={filters.load_city ?? ANY_CITY_VALUE}
          onValueChange={(value) => {
            applyImmediate({ load_city: value === ANY_CITY_VALUE ? undefined : value })
          }}
        >
          <SelectTrigger id={loadCityId}>
            <SelectValue placeholder="Любой город" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_CITY_VALUE}>Любой город</SelectItem>
            {CITY_NAMES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={unloadCityId}>Город выгрузки</Label>
        <Select
          value={filters.unload_city ?? ANY_CITY_VALUE}
          onValueChange={(value) => {
            applyImmediate({ unload_city: value === ANY_CITY_VALUE ? undefined : value })
          }}
        >
          <SelectTrigger id={unloadCityId}>
            <SelectValue placeholder="Любой город" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_CITY_VALUE}>Любой город</SelectItem>
            {CITY_NAMES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={loadDateFromId}>Погрузка с</Label>
          <Input
            id={loadDateFromId}
            type="date"
            value={isoToDateInputValue(filters.load_date_from)}
            onChange={(event) => {
              applyImmediate({ load_date_from: dateInputValueToIsoRangeStart(event.target.value) })
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={loadDateToId}>Погрузка по</Label>
          <Input
            id={loadDateToId}
            type="date"
            value={isoToDateInputValue(filters.load_date_to)}
            onChange={(event) => {
              applyImmediate({ load_date_to: dateInputValueToIsoRangeEnd(event.target.value) })
            }}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={priceFromId}>Цена от</Label>
            <Input
              id={priceFromId}
              type="number"
              inputMode="decimal"
              min={0}
              value={priceFrom}
              onChange={(event) => {
                setPriceFrom(event.target.value)
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={priceToId}>Цена до</Label>
            <Input
              id={priceToId}
              type="number"
              inputMode="decimal"
              min={0}
              value={priceTo}
              onChange={(event) => {
                setPriceTo(event.target.value)
              }}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-1.5">
        <CheckboxOption
          id={availableOnlyId}
          label="Только доступные для ставки"
          checked={filters.is_available ?? false}
          onChange={() => {
            applyImmediate({ is_available: filters.is_available ? undefined : true })
          }}
        />
        <CheckboxOption
          id={myBidsOnlyId}
          label="Только с моими ставками"
          checked={filters.is_bidder ?? false}
          onChange={() => {
            applyImmediate({ is_bidder: filters.is_bidder ? undefined : true })
          }}
        />
      </div>

      <Button type="button" variant="outline" onClick={resetFilters}>
        Сбросить фильтры
      </Button>
    </form>
  )
}
