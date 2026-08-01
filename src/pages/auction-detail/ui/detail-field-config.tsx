import type { ReactNode } from 'react'
import { DetailField } from './DetailSection'

export type DetailFieldConfig<T, C = undefined> = {
  label: string
  getValue: (data: T, context?: C) => ReactNode
  hidden?: (data: T, context?: C) => boolean
}

type DetailFieldsFromConfigProps<T, C> = {
  fields: DetailFieldConfig<T, C>[]
  data: T
  context?: C
}

export const DetailFieldsFromConfig = <T, C = undefined>({
  fields,
  data,
  context,
}: DetailFieldsFromConfigProps<T, C>) => (
  <>
    {fields
      .filter((field) => !field.hidden?.(data, context))
      .map((field) => (
        <DetailField
          key={field.label}
          label={field.label}
          value={field.getValue(data, context)}
        />
      ))}
  </>
)
