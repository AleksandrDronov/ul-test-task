import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api'

/**
 * 4xx `ApiError` (401/404/422) — окончательный ответ, а не временная ошибка;
 * повторные запросы только откладывают показ ошибки (скелетон на несколько секунд)
 * без шанса на успех. Повтор (два раза) только для неклассифицированных ошибок —
 * реальные временные проблемы, например 503 или сетевой сбой.
 */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false
  }

  return failureCount < 2
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: shouldRetry },
    mutations: { retry: false },
  },
})
