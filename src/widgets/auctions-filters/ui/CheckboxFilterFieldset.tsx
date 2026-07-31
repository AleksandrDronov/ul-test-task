import { Label } from '@/shared/ui/label'

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

export const CheckboxOption = ({ id, label, checked, onChange }: CheckboxOptionProps) => (
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

export type CheckboxFilterOption<Value extends string | number> = {
  value: Value
  label: string
}

export type CheckboxFilterFieldsetProps<Value extends string | number> = {
  legend: string
  idPrefix: string
  options: CheckboxFilterOption<Value>[]
  selectedValues: Value[] | undefined
  onChange: (values: Value[] | undefined) => void
}

export const CheckboxFilterFieldset = <Value extends string | number>({
  legend,
  idPrefix,
  options,
  selectedValues,
  onChange,
}: CheckboxFilterFieldsetProps<Value>) => (
  <fieldset className="space-y-2">
    <legend className="text-sm font-medium">{legend}</legend>
    <div className="flex flex-col gap-1.5">
      {options.map((option) => (
        <CheckboxOption
          key={String(option.value)}
          id={`${idPrefix}-${String(option.value)}`}
          label={option.label}
          checked={Boolean(selectedValues?.includes(option.value))}
          onChange={() => {
            onChange(toggleInArray(selectedValues, option.value))
          }}
        />
      ))}
    </div>
  </fieldset>
)
