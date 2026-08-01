import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />
}

export { Skeleton }
