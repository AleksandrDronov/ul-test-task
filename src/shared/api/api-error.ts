export type ApiFieldError = {
  field: string
  message: string
  code?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly title: string
  readonly fieldErrors: ApiFieldError[]

  constructor(params: {
    status: number
    code: string
    title: string
    message: string
    fieldErrors?: ApiFieldError[]
  }) {
    super(params.message)
    this.name = 'ApiError'
    this.status = params.status
    this.code = params.code
    this.title = params.title
    this.fieldErrors = params.fieldErrors ?? []
  }
}

export const parseApiError = async (response: Response): Promise<ApiError> => {
  let body: unknown
  try {
    body = await response.json()
  } catch {
    body = null
  }

  const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const code = typeof record.code === 'string' ? record.code : 'unknown_error'
  const title = typeof record.title === 'string' ? record.title : 'Ошибка'
  const message = typeof record.message === 'string' ? record.message : response.statusText
  const errors = Array.isArray(record.errors) ? record.errors : []
  const fieldErrors: ApiFieldError[] = errors.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return []
    const e = item as Record<string, unknown>
    if (typeof e.field !== 'string' || typeof e.message !== 'string') return []
    return [{
      field: e.field,
      message: e.message,
      code: typeof e.code === 'string' ? e.code : undefined,
    }]
  })

  return new ApiError({
    status: response.status,
    code,
    title,
    message,
    fieldErrors,
  })
}
