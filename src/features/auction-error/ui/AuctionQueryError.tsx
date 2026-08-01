import { BackToListLink, ApiErrorState, EmptyState } from '@/shared/ui'
import { ApiError } from '@/shared/api'

type AuctionQueryErrorProps = {
  error: Error
  onRetry: () => void
}

export const AuctionQueryError = ({ error, onRetry }: AuctionQueryErrorProps) => {
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
