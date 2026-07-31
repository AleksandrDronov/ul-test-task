import { type ReactNode } from 'react'
import { Separator } from '@/shared/ui'

export type FilterSectionProps = {
  children: ReactNode
  withSeparator?: boolean
}

export const FilterSection = ({ children, withSeparator = true }: FilterSectionProps) => (
  <>
    {children}
    {withSeparator && <Separator />}
  </>
)
