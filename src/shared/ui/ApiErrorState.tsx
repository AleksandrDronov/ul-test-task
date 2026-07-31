import { ApiError } from '@/shared/api'
import { Button } from './button'

type StatusMessage = {
  title: string
  message: string
}

/**
 * Тексты по HTTP-статусу на русском (разрешение #5): сырой код статуса никогда
 * не должен попадать к пользователю. Статусы без отдельного текста используют
 * `title`/`message` сервера (уже на русском, см. `parseApiError`), а не числовой код.
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

export const ApiErrorState = ({ error, onRetry, className }: ApiErrorStateProps) => {
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
