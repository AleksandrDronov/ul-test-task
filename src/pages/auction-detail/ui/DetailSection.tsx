import type { ReactNode } from 'react'

export const DetailSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-lg border border-border bg-card p-4">
    <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
)

export const DetailField = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium text-foreground">{value}</span>
  </div>
)
