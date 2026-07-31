import { ApiError } from '@/shared/api/api-error'
import { Button } from '@/shared/ui/button'

type StatusMessage = {
  title: string
  message: string
}

/**
 * Per-status Russian copy (resolution #5): a raw HTTP status code must never
 * reach the user. Statuses without a bespoke entry fall back to the server's
 * own `title`/`message` (already Russian, see `parseApiError`), never to a
 * numeric code.
 */
const STATUS_MESSAGES: Record<number, StatusMessage> = {
  401: {
    title: 'Требуется вход в систему',
    message: 'Сессия истекла или недействительна. Войдите в систему ещё раз.',
  },
  404: {
    title: 'Не найдено',
    message: 'Запрашиваемые данные не найдены. Возможно, они были удалены.',
  },
  422: {
    title: 'Некорректный запрос',
    message: 'Сервер не принял запрос. Проверьте параметры и попробуйте ещё раз.',
  },
  503: {
    title: 'Сервис временно недоступен',
    message: 'Попробуйте повторить запрос через некоторое время.',
  },
}

const GENERIC_MESSAGE: StatusMessage = {
  title: 'Не удалось загрузить данные',
  message: 'Произошла непредвиденная ошибка. Попробуйте ещё раз.',
}

const resolveMessage = (error: unknown): StatusMessage => {
  if (error instanceof ApiError) {
    return STATUS_MESSAGES[error.status] ?? { title: error.title, message: error.message }
  }

  return GENERIC_MESSAGE
}

export type ApiErrorStateProps = {
  error: unknown
  onRetry?: () => void
  className?: string
}

export const ApiErrorStateComponent = ({ error, onRetry, className }: ApiErrorStateProps) => {
  const { title, message } = resolveMessage(error)

  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card p-8 text-center ${className ?? ''}`}
    >
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry}>
          Повторить попытку
        </Button>
      )}
    </div>
  )
}
