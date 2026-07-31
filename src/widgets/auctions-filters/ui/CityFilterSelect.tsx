import { useId } from 'react'
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'

const ANY_CITY_VALUE = '__any__'

export type CityFilterSelectProps = {
  label: string
  value: string | undefined
  cities: readonly string[]
  onChange: (city: string | undefined) => void
}

export const CityFilterSelect = ({ label, value, cities, onChange }: CityFilterSelectProps) => {
  const selectId = useId()

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={selectId}>{label}</Label>
      <Select
        value={value ?? ANY_CITY_VALUE}
        onValueChange={(nextValue) => {
          onChange(nextValue === ANY_CITY_VALUE ? undefined : nextValue)
        }}
      >
        <SelectTrigger id={selectId}>
          <SelectValue placeholder="Любой город" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY_CITY_VALUE}>Любой город</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
