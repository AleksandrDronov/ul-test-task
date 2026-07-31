import { z } from 'zod'
import type { components } from '@/shared/api/types/openapi'
import { isAuctionStatusCode } from '@/shared/config/auction-status-map'

type TradingStatus = components['schemas']['TradingStatus']
type AuctionListRequest = components['schemas']['AuctionListRequest']
type AuctionAucType = NonNullable<AuctionListRequest['auc_type']>[number]

const TRADING_STATUS_VALUES = [
  'NotParticipating',
  'Leading',
  'Losing',
  'OnPending',
  'Confirmed',
  'ChoosingWinner',
  'Winner',
  'Accepted',
  'Unknown',
] as const satisfies readonly TradingStatus[]

const AUC_TYPE_VALUES = [
  'Request',
  'Up',
  'Down',
  'FixPrice',
] as const satisfies readonly AuctionAucType[]

const ISO_DATETIME_WITH_OFFSET =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/

const isBlank = (value: unknown): value is '' | null | undefined =>
  value === undefined || value === null || value === ''

const splitToTokens = (value: string): string[] =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

const toStringTokens = (value: unknown): string[] | undefined => {
  if (isBlank(value)) {
    return undefined
  }

  if (Array.isArray(value)) {
    const tokens = value.flatMap((item) => {
      if (typeof item === 'string') {
        return splitToTokens(item)
      }

      return []
    })

    return tokens.length > 0 ? tokens : undefined
  }

  if (typeof value === 'string') {
    const tokens = splitToTokens(value)
    return tokens.length > 0 ? tokens : undefined
  }

  return undefined
}

const filterEnumTokens = <const T extends readonly string[]>(
  allowed: T,
  value: unknown,
): T[number][] | undefined => {
  const tokens = toStringTokens(value)
  if (!tokens) {
    return undefined
  }

  const allowedSet = new Set<string>(allowed)
  const filtered = tokens.filter((token): token is T[number] => allowedSet.has(token))

  return filtered.length > 0 ? filtered : undefined
}

const toOptionalString = (value: unknown): string | undefined => {
  if (isBlank(value)) {
    return undefined
  }

  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const toOptionalBoolean = (value: unknown): boolean | undefined => {
  if (isBlank(value)) {
    return undefined
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return undefined
}

const toClampedInt = (
  value: unknown,
  { min, max, fallback }: { min: number, max: number, fallback: number },
): number => {
  if (isBlank(value)) {
    return fallback
  }

  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) {
    return fallback
  }

  const integer = Math.trunc(numeric)
  return Math.min(max, Math.max(min, integer))
}

const toOptionalNumber = (value: unknown): number | undefined => {
  if (isBlank(value)) {
    return undefined
  }

  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) {
    return undefined
  }

  return numeric
}

const toStatusCodes = (value: unknown): number[] | undefined => {
  const tokens = toStringTokens(value)
  if (!tokens) {
    return undefined
  }

  const codes = tokens
    .map((token) => Number(token))
    .filter((code) => Number.isInteger(code) && isAuctionStatusCode(code))

  return codes.length > 0 ? codes : undefined
}

const toOptionalDateTime = (value: unknown): string | undefined => {
  const dateTime = toOptionalString(value)
  if (!dateTime) {
    return undefined
  }

  if (!ISO_DATETIME_WITH_OFFSET.test(dateTime)) {
    return undefined
  }

  return dateTime
}

export const auctionsSearchParamsSchema = z.object({
  page: z.preprocess(
    (value) => toClampedInt(value, { min: 1, max: Number.MAX_SAFE_INTEGER, fallback: 1 }),
    z.number().int().min(1),
  ).default(1),
  per_page: z.preprocess(
    (value) => toClampedInt(value, { min: 1, max: 100, fallback: 20 }),
    z.number().int().min(1).max(100),
  ).default(20),
  cargo_num: z.preprocess(toOptionalString, z.string().optional()),
  status: z.preprocess(
    (value) => filterEnumTokens(TRADING_STATUS_VALUES, value),
    z.array(z.enum(TRADING_STATUS_VALUES)).optional(),
  ),
  statuses: z.preprocess(toStatusCodes, z.array(z.number().int()).optional()),
  auc_type: z.preprocess(
    (value) => filterEnumTokens(AUC_TYPE_VALUES, value),
    z.array(z.enum(AUC_TYPE_VALUES)).optional(),
  ),
  load_city: z.preprocess(toOptionalString, z.string().optional()),
  unload_city: z.preprocess(toOptionalString, z.string().optional()),
  load_date_from: z.preprocess(toOptionalDateTime, z.string().optional()),
  load_date_to: z.preprocess(toOptionalDateTime, z.string().optional()),
  is_available: z.preprocess(toOptionalBoolean, z.boolean().optional()),
  is_bidder: z.preprocess(toOptionalBoolean, z.boolean().optional()),
  current_price_from: z.preprocess(toOptionalNumber, z.number().optional()),
  current_price_to: z.preprocess(toOptionalNumber, z.number().optional()),
})

export type AuctionsSearchParams = z.infer<typeof auctionsSearchParamsSchema>
