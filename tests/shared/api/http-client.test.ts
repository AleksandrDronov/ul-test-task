import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '@/shared/api'

describe('apiRequest headers', () => {
  let fetchMock: Mock<typeof fetch>

  const getRequestHeaders = (): Headers => {
    const [, init] = fetchMock.mock.calls[0] ?? []
    if (!init) {
      throw new Error('expected fetch to be called with RequestInit')
    }

    return new Headers(init.headers)
  }

  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses caller-supplied Accept instead of the default', async () => {
    await apiRequest('/test', { headers: { Accept: 'text/plain' } })

    const headers = getRequestHeaders()
    expect(headers.get('Accept')).toBe('text/plain')
  })

  it('uses caller-supplied Content-Type on body requests instead of the default', async () => {
    await apiRequest('/test', {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
      headers: { 'Content-Type': 'text/plain' },
    })

    const headers = getRequestHeaders()
    expect(headers.get('Content-Type')).toBe('text/plain')
  })

  it('sets default Accept and no Content-Type without caller headers or body', async () => {
    await apiRequest('/test')

    const headers = getRequestHeaders()
    expect(headers.get('Accept')).toBe('application/json')
    expect(headers.has('Content-Type')).toBe(false)
  })
})
