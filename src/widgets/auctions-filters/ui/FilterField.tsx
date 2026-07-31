import { type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Label } from '@/shared/ui'

export type FilterFieldProps = {
  label: string
  id: string
  children: ReactNode
  className?: string
}

export const FilterField = ({ label, id, children, className }: FilterFieldProps) => (
  <div className={cn('flex flex-col gap-2', className)}>
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
)
