import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ApiErrorState } from './ApiErrorState'

export type AsyncQueryViewProps<TData, TError = unknown> = {
  query: UseQueryResult<TData, TError>
  pending: ReactNode
  error?: (error: TError, retry: () => void) => ReactNode
  isEmpty?: (data: TData) => boolean
  empty?: ReactNode
  children: (data: TData) => ReactNode
}

export const AsyncQueryView = <TData, TError = unknown>({
  query,
  pending,
  error,
  isEmpty,
  empty,
  children,
}: AsyncQueryViewProps<TData, TError>) => {
  if (query.isPending) {
    return pending
  }

  if (query.isError) {
    const handleRetry = (): void => {
      void query.refetch()
    }

    if (error) {
      return error(query.error, handleRetry)
    }

    return <ApiErrorState error={query.error} onRetry={handleRetry} />
  }

  if (isEmpty?.(query.data)) {
    return empty ?? null
  }

  return children(query.data)
}
