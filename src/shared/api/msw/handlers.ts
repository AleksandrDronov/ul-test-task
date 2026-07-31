import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/shared/api/base-url'
import type { components } from '@/shared/api/types/openapi'
import { getAuction, listAuctions, listBets, setBet } from './store'

type AuctionListRequest = components['schemas']['AuctionListRequest']
type SetBetRequest = components['schemas']['SetBetRequest']
type ProblemDetail = components['schemas']['ProblemDetail']
type ValidationProblem = components['schemas']['ValidationProblem']

/**
 * OpenAPI error responses (`NotFound`, `Unauthorized`, `ServiceUnavailable`,
 * `ValidationFailed`) объявляют `application/problem+json`, а не дефолтный
 * `application/json`, который иначе выставил `HttpResponse.json`.
 */
const problemJson = (body: ProblemDetail | ValidationProblem, status: number) =>
  HttpResponse.json(body, { status, headers: { 'Content-Type': 'application/problem+json' } })

/**
 * Триггеры ошибок для ручного тестирования (разрешение task-5 #5):
 * - запрос списка с `cargo_num === '__401__'` возвращает 401
 * - uuid ниже возвращает 503 из detail/bets/set-bet
 */
const UNAUTHORIZED_CARGO_NUM = '__401__'
const SERVICE_UNAVAILABLE_UUID = '00000000-0000-4000-8000-000000000503'

const getPathParam = (value: string | readonly string[] | undefined): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  throw new Error('Expected a string path parameter')
}

const unauthorizedProblem = (): ProblemDetail => ({
  code: 'unauthorized',
  title: 'Не авторизован',
  message: 'Требуется авторизация.',
  trace_id: null,
})

const serviceUnavailableProblem = (): ProblemDetail => ({
  code: 'service_unavailable',
  title: 'Сервис недоступен',
  message: 'Сервис временно недоступен, попробуйте повторить запрос позже.',
  trace_id: null,
})

const notFoundProblem = (): ProblemDetail => ({
  code: 'resource_not_found',
  title: 'Не найдено',
  message: 'Аукцион не найден.',
  trace_id: null,
})

export const handlers = [
  http.post(`${API_BASE_URL}/auctions/list`, async ({ request }) => {
    const body = (await request.json()) as AuctionListRequest

    if (body.cargo_num === UNAUTHORIZED_CARGO_NUM) {
      return problemJson(unauthorizedProblem(), 401)
    }

    return HttpResponse.json(listAuctions(body))
  }),

  http.get(`${API_BASE_URL}/auctions/:auctionUuid`, ({ params }) => {
    const auctionUuid = getPathParam(params.auctionUuid)

    if (auctionUuid === SERVICE_UNAVAILABLE_UUID) {
      return problemJson(serviceUnavailableProblem(), 503)
    }

    const auction = getAuction(auctionUuid)
    if (!auction) {
      return problemJson(notFoundProblem(), 404)
    }

    return HttpResponse.json(auction)
  }),

  http.get(`${API_BASE_URL}/auctions/:auctionUuid/bets`, ({ params, request }) => {
    const auctionUuid = getPathParam(params.auctionUuid)

    if (auctionUuid === SERVICE_UNAVAILABLE_UUID) {
      return problemJson(serviceUnavailableProblem(), 503)
    }

    const url = new URL(request.url)
    const all = url.searchParams.get('all') === 'true'

    const result = listBets(auctionUuid, all)
    if (!result) {
      return problemJson(notFoundProblem(), 404)
    }

    return HttpResponse.json(result)
  }),

  http.post(`${API_BASE_URL}/auctions/:auctionUuid/bets`, async ({ params, request }) => {
    const auctionUuid = getPathParam(params.auctionUuid)

    if (auctionUuid === SERVICE_UNAVAILABLE_UUID) {
      return problemJson(serviceUnavailableProblem(), 503)
    }

    const body = (await request.json()) as SetBetRequest
    const result = setBet(auctionUuid, body.price)

    if (!result.ok) {
      return problemJson(result.body, result.status)
    }

    return new HttpResponse(null, { status: 200 })
  }),
]
