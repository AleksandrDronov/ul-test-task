import { API_BASE_URL } from './base-url'
import { parseApiError } from './api-error'

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const extraHeaders = init?.headers
    ? Object.fromEntries(new Headers(init.headers))
    : {}

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...extraHeaders,
    },
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
