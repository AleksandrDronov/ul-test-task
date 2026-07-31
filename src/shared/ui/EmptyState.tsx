import type { ReactNode } from 'react'

export type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export const EmptyState = ({ title, description, action, className }: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card p-8 text-center ${className ?? ''}`}
    >
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  )
}
