import { ApiError } from '@/shared/api'
import { ApiErrorState, EmptyState } from '@/shared/ui'
import { BackToListLink } from './BackToListLink'

type AuctionDetailErrorProps = {
  error: Error
  onRetry: () => void
}

export const AuctionDetailError = ({ error, onRetry }: AuctionDetailErrorProps) => {
  const isNotFound = error instanceof ApiError && error.status === 404

  if (isNotFound) {
    return (
      <EmptyState
        title="Аукцион не найден"
        description="Возможно, он был удалён или ссылка неверна."
        action={<BackToListLink />}
      />
    )
  }

  return <ApiErrorState error={error} onRetry={onRetry} />
}
