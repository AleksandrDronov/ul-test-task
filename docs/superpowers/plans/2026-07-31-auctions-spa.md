# Auctions SPA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production-ready SPA для грузовых аукционов (список, детали, ставки, установка ставки) строго по OpenAPI и design spec.

**Architecture:** Strict FSD на Vite/React/TS. DTO из `openapi-typescript`, UI только через ViewModel-мапперы. Фильтры в URL (Zod). Stateful MSW. Query keys: `auctions.list` / `auction.detail` / `auction.bets`; mutation `setBet` инвалидирует все три. UI: Tailwind + shadcn.

**Tech Stack:** React 19, TypeScript, Vite, TanStack Router, TanStack Query, RHF + Zod, MSW, Zustand, Vitest, Tailwind, shadcn/ui, Sonner, openapi-typescript.

**Spec:** `docs/superpowers/specs/2026-07-31-auctions-spa-design.md`

## Global Constraints

- Без `any` / `as any`
- UI не импортирует DTO напрямую — только ViewModel
- OpenAPI — единственный источник полей/enum/nullable
- Query keys точно: `auctions.list`, `auction.detail`, `auction.bets`; mutation id `setBet`
- После `setBet` invalidate list + detail + bets
- Обработка HTTP 401 / 404 / 422 / 503
- Semicolons в JS/TS не использовать (project style)
- Коммиты: только если пользователь явно разрешил; до `git init` шаги Commit пропускать или делать `git init` в Task 1 по запросу

---

## File map (целевая структура)

```text
openapi.auctions.v0.json          # source of truth (уже есть)
package.json
vite.config.ts
tsconfig.json
vitest.config.ts
index.html
public/mockServiceWorker.js
README.md
AI_USAGE.md
src/
  main.tsx
  app/
    AppProviders.tsx
    styles.css
    router.tsx
  pages/
    auctions-list/ui/AuctionsListPage.tsx
    auction-detail/ui/AuctionDetailPage.tsx
    auction-bets/ui/AuctionBetsPage.tsx
    auction-bet/ui/AuctionBetPage.tsx
  widgets/
    auction-card/ui/AuctionCard.tsx
    auctions-filters/ui/AuctionsFilters.tsx
    bets-table/ui/BetsTable.tsx
    auction-summary/ui/AuctionSummary.tsx
  features/
    filter-auctions/
      model/auctions-search-params.schema.ts
      model/parse-auctions-search-params.ts
      model/build-auction-list-request.ts
      model/filters-ui.store.ts
    set-bet/
      model/set-bet.schema.ts
      ui/SetBetForm.tsx
      api/use-set-bet-mutation.ts
    prefetch-auction/
      model/use-prefetch-auction.ts
  entities/
    auction/
      api/auction.api.ts
      api/auction.query-keys.ts
      model/auction-list.vm.ts
      model/auction-detail.vm.ts
      model/map-auction-list-item.ts
      model/map-auction-detail.ts
      api/use-auctions-list-query.ts
      api/use-auction-detail-query.ts
    bet/
      api/bet.api.ts
      model/bet.vm.ts
      model/map-bet-item.ts
      api/use-auction-bets-query.ts
  shared/
    api/
      base-url.ts
      http-client.ts
      api-error.ts
      types/openapi.d.ts          # generated
      msw/browser.ts
      msw/handlers.ts
      msw/store.ts
      msw/seed.ts
      msw/cities.ts
    config/auction-status-map.ts
    lib/cn.ts
    lib/format.ts
    ui/                           # shadcn primitives
tests/
  features/filter-auctions/parse-auctions-search-params.test.ts
  features/filter-auctions/build-auction-list-request.test.ts
  entities/auction/map-auction-list-item.test.ts
  features/set-bet/set-bet.schema.test.ts
```

---

### Task 1: Scaffold проекта + FSD + tooling

**Files:**

- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vitest.config.ts`, `index.html`, `eslint.config.js`, `.gitignore`, `src/main.tsx`, `src/app/styles.css`, `src/app/AppProviders.tsx`, `src/shared/lib/cn.ts`, `src/shared/api/base-url.ts`
- Create: empty FSD dirs with `.gitkeep` where needed
- Modify: copy/keep `openapi.auctions.v0.json` at repo root

**Interfaces:**

- Produces: Vite app boots; `API_BASE_URL = '/api/v1'`; `cn()` helper; Vitest runnable; script `generate:api`

- [ ] **Step 1: Initialize Vite React-TS app in repo root**

```bash
cd "/Users/aleksandrdronov/Documents/тестовые/ul-test-task"
npm create vite@latest . -- --template react-ts
```

Если каталог не пуст — создать вручную `package.json` / конфиги Vite без затирания `openapi*.json`, `docs/`, `AI_AGENT_SPECIFICATION.md`, PDF.

- [ ] **Step 2: Install dependencies**

```bash
npm install react react-dom @tanstack/react-router @tanstack/react-query @tanstack/router-devtools zustand react-hook-form @hookform/resolvers zod sonner class-variance-authority clsx tailwind-merge lucide-react
npm install -D tailwindcss @tailwindcss/vite typescript vite @types/react @types/react-dom @tanstack/router-plugin openapi-typescript vitest @testing-library/react @testing-library/jest-dom jsdom eslint typescript-eslint msw @types/node
```

- [ ] **Step 3: Configure Vite + Tailwind + path aliases + Vitest**

`vite.config.ts`:

```ts
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite({ routesDirectory: './src/app/routes' }), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
})
```

`tsconfig` paths: `"@/*": ["./src/*"]`.

`src/app/styles.css`:

```css
@import 'tailwindcss';
```

`src/shared/api/base-url.ts`:

```ts
export const API_BASE_URL = '/api/v1' as const
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "generate:api": "openapi-typescript openapi.auctions.v0.json -o src/shared/api/types/openapi.d.ts"
  }
}
```

- [ ] **Step 4: Generate OpenAPI types**

```bash
npm run generate:api
```

Expected: файл `src/shared/api/types/openapi.d.ts` создан.

- [ ] **Step 5: Init shadcn (button, input, label, select, skeleton, badge, sheet, separator, sonner)**

Следовать актуальному CLI shadcn для Vite + Tailwind v4. Компоненты класть в `src/shared/ui/`. Обёртки-страницы позже импортируют только оттуда.

- [ ] **Step 6: Smoke boot**

```bash
npm run build
```

Expected: успешная сборка (можно с заглушкой `App`).

- [ ] **Step 7: Commit (если git init разрешён пользователем)**

```bash
git init
git add -A
git commit -m "$(cat <<'EOF'
chore: scaffold vite react app with fsd tooling

EOF
)"
```

---

### Task 2: HTTP client + ApiError

**Files:**

- Create: `src/shared/api/api-error.ts`, `src/shared/api/http-client.ts`
- Test: optional smoke via types only (логика ошибок покрыта интеграционно позже)

**Interfaces:**

- Produces:
  - `class ApiError extends Error { status: number; code: string; title: string; message: string; fieldErrors?: Array<{ field: string; message: string; code?: string }> }`
  - `apiRequest<T>(path: string, init?: RequestInit): Promise<T>`
- Consumes: `API_BASE_URL`, OpenAPI `components['schemas']['ProblemDetail']`

- [ ] **Step 1: Implement ApiError + parser**

```ts
// src/shared/api/api-error.ts
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
  let body: unknown = null
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
    return [
      {
        field: e.field,
        message: e.message,
        code: typeof e.code === 'string' ? e.code : undefined,
      },
    ]
  })

  return new ApiError({
    status: response.status,
    code,
    title,
    message,
    fieldErrors,
  })
}
```

- [ ] **Step 2: Implement http client**

```ts
// src/shared/api/http-client.ts
import { API_BASE_URL } from './base-url'
import { parseApiError } from './api-error'

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
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
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/api/api-error.ts src/shared/api/http-client.ts
git commit -m "feat(api): add typed http client and ApiError"
```

---

### Task 3: Search params parser (TDD)

**Files:**

- Create: `src/features/filter-auctions/model/auctions-search-params.schema.ts`, `src/features/filter-auctions/model/parse-auctions-search-params.ts`
- Create: `src/shared/config/auction-status-map.ts`
- Test: `tests/features/filter-auctions/parse-auctions-search-params.test.ts`

**Interfaces:**

- Produces:
  - `type AuctionsSearchParams` — validated filters
  - `parseAuctionsSearchParams(input: Record<string, unknown>): AuctionsSearchParams`
  - defaults: `page=1`, `per_page` из `DEFAULT_AUCTIONS_LIST_SEARCH`
- Consumes: Zod

- [ ] **Step 1: Write failing tests**

```ts
// tests/features/filter-auctions/parse-auctions-search-params.test.ts
import { describe, expect, it } from 'vitest'
import { parseAuctionsSearchParams } from '@/features/filter-auctions/model/parse-auctions-search-params'

describe('parseAuctionsSearchParams', () => {
  it('falls back to defaults for empty input', () => {
    expect(parseAuctionsSearchParams({})).toEqual(DEFAULT_AUCTIONS_LIST_SEARCH)
  })

  it('parses known filters and drops invalid enum values', () => {
    const result = parseAuctionsSearchParams({
      page: '2',
      per_page: '10',
      cargo_num: '0001',
      status: ['Leading', 'Nope'],
      statuses: ['2', 'x'],
      auc_type: ['Down', 'Bad'],
      is_available: 'true',
      current_price_from: '1000',
    })

    expect(result.page).toBe(2)
    expect(result.per_page).toBe(10)
    expect(result.cargo_num).toBe('0001')
    expect(result.status).toEqual(['Leading'])
    expect(result.statuses).toEqual([2])
    expect(result.auc_type).toEqual(['Down'])
    expect(result.is_available).toBe(true)
    expect(result.current_price_from).toBe(1000)
  })

  it('clamps invalid page to 1', () => {
    expect(parseAuctionsSearchParams({ page: '-5' }).page).toBe(1)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- tests/features/filter-auctions/parse-auctions-search-params.test.ts
```

Expected: FAIL (module not found)

- [ ] **Step 3: Implement schema + parser**

Поддержать comma-separated и single/array значения из TanStack Router search. Невалидные значения отбрасывать, не бросать.

```ts
// src/features/filter-auctions/model/parse-auctions-search-params.ts
import {
  auctionsSearchParamsSchema,
  type AuctionsSearchParams,
} from './auctions-search-params.schema'

export const parseAuctionsSearchParams = (input: Record<string, unknown>): AuctionsSearchParams => {
  const parsed = auctionsSearchParamsSchema.safeParse(input)
  if (parsed.success) return parsed.data
  return DEFAULT_SEARCH_PARAMS
}
```

Схему реализовать так, чтобы тест выше проходил (preprocess строк в числа/boolean/array).

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- tests/features/filter-auctions/parse-auctions-search-params.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/features/filter-auctions tests/features/filter-auctions/parse-auctions-search-params.test.ts src/shared/config/auction-status-map.ts
git commit -m "feat(filters): add zod search params parser"
```

---

### Task 4: Request builder (TDD)

**Files:**

- Create: `src/features/filter-auctions/model/build-auction-list-request.ts`
- Test: `tests/features/filter-auctions/build-auction-list-request.test.ts`

**Interfaces:**

- Consumes: `AuctionsSearchParams`
- Produces: `buildAuctionListRequest(params: AuctionsSearchParams): components['schemas']['AuctionListRequest']` — только определённые поля, без `undefined` ключей

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest'
import { buildAuctionListRequest } from '@/features/filter-auctions/model/build-auction-list-request'

describe('buildAuctionListRequest', () => {
  it('maps search params to OpenAPI request body', () => {
    expect(
      buildAuctionListRequest({
        page: 2,
        per_page: 10,
        cargo_num: '0001',
        status: ['Leading'],
        statuses: [2],
        auc_type: ['Down'],
        load_city: 'Пермь',
        unload_city: 'Москва',
        load_date_from: '2026-05-26T00:00:00+03:00',
        load_date_to: '2026-05-27T00:00:00+03:00',
        is_available: true,
        is_bidder: false,
        current_price_from: 1000,
        current_price_to: 50000,
      }),
    ).toEqual({
      page: 2,
      per_page: 10,
      cargo_num: '0001',
      status: ['Leading'],
      statuses: [2],
      auc_type: ['Down'],
      load_city: 'Пермь',
      unload_city: 'Москва',
      load_date_from: '2026-05-26T00:00:00+03:00',
      load_date_to: '2026-05-27T00:00:00+03:00',
      is_available: true,
      is_bidder: false,
      current_price_from: 1000,
      current_price_to: 50000,
    })
  })

  it('omits empty optional fields', () => {
    expect(buildAuctionListRequest({ page: 1, per_page: 20 })).toEqual({
      page: 1,
      per_page: 20,
    })
  })
})
```

- [ ] **Step 2: Run — FAIL**

```bash
npm test -- tests/features/filter-auctions/build-auction-list-request.test.ts
```

- [ ] **Step 3: Implement builder**

```ts
import type { components } from '@/shared/api/types/openapi'
import type { AuctionsSearchParams } from './auctions-search-params.schema'

type AuctionListRequest = components['schemas']['AuctionListRequest']

export const buildAuctionListRequest = (params: AuctionsSearchParams): AuctionListRequest => {
  const body: AuctionListRequest = {
    page: params.page,
    per_page: params.per_page,
  }

  if (params.cargo_num) body.cargo_num = params.cargo_num
  if (params.status?.length) body.status = params.status
  if (params.statuses?.length) body.statuses = params.statuses
  if (params.auc_type?.length) body.auc_type = params.auc_type
  if (params.load_city) body.load_city = params.load_city
  if (params.unload_city) body.unload_city = params.unload_city
  if (params.load_date_from) body.load_date_from = params.load_date_from
  if (params.load_date_to) body.load_date_to = params.load_date_to
  if (params.is_available !== undefined) body.is_available = params.is_available
  if (params.is_bidder !== undefined) body.is_bidder = params.is_bidder
  if (params.current_price_from !== undefined) body.current_price_from = params.current_price_from
  if (params.current_price_to !== undefined) body.current_price_to = params.current_price_to

  return body
}
```

Типы `status` / `auc_type` должны совпадать с generated OpenAPI enums.

- [ ] **Step 4: Run — PASS**

```bash
npm test -- tests/features/filter-auctions/build-auction-list-request.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/features/filter-auctions/model/build-auction-list-request.ts tests/features/filter-auctions/build-auction-list-request.test.ts
git commit -m "feat(filters): add auction list request builder"
```

---

### Task 5: MSW store + handlers

**Files:**

- Create: `src/shared/api/msw/cities.ts`, `src/shared/api/msw/seed.ts`, `src/shared/api/msw/store.ts`, `src/shared/api/msw/handlers.ts`, `src/shared/api/msw/browser.ts`
- Create: `public/mockServiceWorker.js` via `npx msw init public/ --save`

**Interfaces:**

- Produces:
  - `listAuctions(body): AuctionListResponseBase`
  - `getAuction(uuid): AuctionShowResponse | null`
  - `listBets(uuid, all?): BetListResponse | null | 'hidden'`
  - `setBet(uuid, price): { ok: true } | { ok: false; status: 404 | 422; body }`
- Seed ≥ 6 аукционов с кейсами: active+can_set_bet, your.bet=true, can_set_bet=false, hide_bets_history, empty bets, hide_points + no_view_cargo_price
- Error triggers: `cargo_num === '__401__'` → 401; `auctionUuid === '00000000-0000-4000-8000-000000000503'` → 503

- [ ] **Step 1: Init MSW worker**

```bash
npx msw init public/ --save
```

- [ ] **Step 2: Implement cities + seed + store**

Store держит deep-copyable state. `setBet` обязан:

1. найти auction по `order_uid`
2. если нет → 404 ProblemDetail
3. если `!trading.can_set_bet` → 422 field `price`
4. валидировать price > 0, min/max/step из `trading.price`
5. добавить `BetItem` (текущий перевозчик: org id 14, name «ООО Перевозчик»)
6. обновить `trading.price.current` / `available` (для Down: current = price, available = price - step)
7. `your.bet = true`, `your.last_bet = price`, `status_mobile = 'Leading'`, `is_bidder = true`
8. синхронизировать соответствующий list item

- [ ] **Step 3: Handlers**

```ts
// paths relative to API_BASE_URL
http.post('/api/v1/auctions/list', ...)
http.get('/api/v1/auctions/:auctionUuid', ...)
http.get('/api/v1/auctions/:auctionUuid/bets', ...)
http.post('/api/v1/auctions/:auctionUuid/bets', ...)
```

Для `hide_bets_history` на GET bets: вернуть 200 `{ bets: [] }` и пусть UI ориентируется на detail flag; либо 200 с пустым списком + UI читает flag из detail (как в design — UI gate по flag).

- [ ] **Step 4: Bootstrap in main**

```ts
async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { worker } = await import('@/shared/api/msw/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(...).render(...)
})
```

- [ ] **Step 5: Manual smoke via curl/browser later; Commit**

```bash
git add src/shared/api/msw public/mockServiceWorker.js package.json
git commit -m "feat(msw): add stateful auction mocks"
```

---

### Task 6: Entity mappers (TDD) + API + query keys

**Files:**

- Create: entity model/api files listed in file map
- Test: `tests/entities/auction/map-auction-list-item.test.ts`

**Interfaces:**

- Produces:
  - `auctionQueryKeys = { list: (body) => ['auctions.list', body], detail: (id) => ['auction.detail', id], bets: (id, all?) => ['auction.bets', id, all] }`
  - `mapAuctionListItemDtoToVm(dto): AuctionListItemVm`
  - `mapAuctionDetailDtoToVm(dto): AuctionDetailVm`
  - `mapBetItemDtoToVm(dto): BetItemVm`
  - `mapBetListToVm(bets): { items: BetItemVm[]; participantsCount: number }` — participants = unique `organization_id`
  - `fetchAuctionsList`, `fetchAuctionDetail`, `fetchAuctionBets`, `postSetBet`

`AuctionListItemVm.primaryAction`:

```ts
export type PrimaryAction =
  | { type: 'setBet'; label: 'Сделать ставку' }
  | { type: 'changeBet'; label: 'Изменить ставку' }
  | { type: 'viewBets'; label: 'Смотреть ставки' }
  | { type: 'disabled'; label: 'Ставка недоступна' }
```

Правила из design spec.

- [ ] **Step 1: Failing mapper test** (минимум: cargo_num, primaryAction setBet/changeBet, hide address)

- [ ] **Step 2: Implement mappers + api functions + query hooks** (`useQuery` / не вызывать из UI с raw DTO — хуки возвращают VM)

- [ ] **Step 3: Tests PASS**

```bash
npm test -- tests/entities/auction/map-auction-list-item.test.ts
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(entities): add auction/bet mappers and queries"
```

---

### Task 7: Set-bet Zod schema (TDD) + mutation + form

**Files:**

- Create: `src/features/set-bet/model/set-bet.schema.ts`, `src/features/set-bet/api/use-set-bet-mutation.ts`, `src/features/set-bet/ui/SetBetForm.tsx`
- Test: `tests/features/set-bet/set-bet.schema.test.ts`

**Interfaces:**

- Produces: `createSetBetSchema(limits: { min?: number | null; max?: number | null; step?: number | null })`
- Mutation `setBet`: onSuccess invalidate three keys; on 422 map `fieldErrors` to RHF

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from 'vitest'
import { createSetBetSchema } from '@/features/set-bet/model/set-bet.schema'

describe('createSetBetSchema', () => {
  const schema = createSetBetSchema({ min: 20000, max: 30000, step: 500 })

  it('requires price > 0', () => {
    expect(schema.safeParse({ price: 0 }).success).toBe(false)
  })

  it('rejects below min', () => {
    expect(schema.safeParse({ price: 19500 }).success).toBe(false)
  })

  it('rejects off-step', () => {
    expect(schema.safeParse({ price: 20100 }).success).toBe(false)
  })

  it('accepts valid price', () => {
    expect(schema.safeParse({ price: 29000 }).success).toBe(true)
  })
})
```

- [ ] **Step 2: Implement schema + form + mutation**

Форма показывает available + step hint. Toast success/error через Sonner.

```ts
// mutation key / meta
mutationKey: ['setBet']
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['auctions.list'] })
  queryClient.invalidateQueries({ queryKey: ['auction.detail', auctionUuid] })
  queryClient.invalidateQueries({ queryKey: ['auction.bets', auctionUuid] })
}
```

(точное совпадение с factory keys из Task 6 — использовать те же helpers).

- [ ] **Step 3: Tests PASS + Commit**

```bash
git commit -m "feat(set-bet): add validation schema form and mutation"
```

---

### Task 8: Router + pages + widgets

**Files:**

- Create: route tree under `src/app/routes/` (TanStack file routing) OR manual `router.tsx` with 4 routes
- Create: all `pages/**/ui/*.tsx` and `widgets/**/ui/*.tsx`
- Create: `src/features/prefetch-auction/model/use-prefetch-auction.ts`
- Create: `src/features/filter-auctions/model/filters-ui.store.ts` (`filtersOpen` boolean)
- Create: filters UI + sheet

**Interfaces:**

- Routes exactly as design table
- Index route search: validate with `parseAuctionsSearchParams`
- Prefetch: `queryClient.prefetchQuery` on card `onMouseEnter` / `onFocus`

- [ ] **Step 1: Wire router + providers** (QueryClient, Router, Toaster, TooltipProvider)

- [ ] **Step 2: List page** — filters, skeleton, empty, error (ApiError UI), pagination, cards

- [ ] **Step 3: Detail page** — sections + CTA links to `/bet` and `/bets`; respect hide flags

- [ ] **Step 4: Bets page** — if `hide_bets_history` show hidden state; else table + participantsCount; empty state

- [ ] **Step 5: Bet page** — gate on `can_set_bet`; else message + link back

- [ ] **Step 6: Visual pass** — adaptive layout, no purple/glow AI defaults; business UI (neutral slate/zinc + one accent)

- [ ] **Step 7: Commit**

```bash
git commit -m "feat(ui): add auction pages widgets and routes"
```

---

### Task 9: README + AI_USAGE + final verification

**Files:**

- Create: `README.md`, `AI_USAGE.md`

- [ ] **Step 1: Write README** — install, `npm run dev`, architecture FSD, structure, testing commands, verified scenarios, limitations (MSW-only, no realtime)

- [ ] **Step 2: Write AI_USAGE.md** — AI scaffold/codegen/UI; human decisions (FSD strict, URL filters, shadcn, route A); rejected ideas (localStorage filters, MobX); manual checks (bet invalidation, hide flags); risks (OpenAPI enum drift list vs detail); one-more-day improvements (E2E, fuller filters)

- [ ] **Step 3: Run full gate**

```bash
npm test
npm run lint
npm run build
```

Expected: all green, no TS errors.

- [ ] **Step 4: Manual checklist**

1. Список грузится, фильтр `cargo_num` меняет URL и результат
2. Hover prefetch не ломает UI
3. Детали показывают блоки
4. Ставка успешна → цена/история/статус обновляются без reload
5. 422 на неверном step
6. `hide_bets_history` аукцион
7. Mobile filters sheet

- [ ] **Step 5: Commit**

```bash
git commit -m "docs: add README and AI_USAGE"
```

---

## Spec coverage checklist

| Spec requirement                   | Task       |
| ---------------------------------- | ---------- |
| FSD                                | 1, 8       |
| openapi-typescript DTO             | 1, 6       |
| URL filters + Zod                  | 3          |
| request builder                    | 4          |
| MSW stateful + setBet side effects | 5          |
| mappers VM                         | 6          |
| query keys + invalidate            | 6, 7       |
| set bet RHF+Zod min/max/step       | 7          |
| pages list/detail/bets/bet         | 8          |
| skeleton/empty/error               | 8          |
| prefetch hover                     | 8          |
| 401/404/422/503 handling           | 2, 5, 8    |
| tests ×4                           | 3, 4, 6, 7 |
| README + AI_USAGE                  | 9          |
| build/lint clean                   | 9          |

## Plan self-review notes

- Placeholders removed: concrete paths, schemas, mutation invalidate keys.
- `status_mobile` list vs detail enum asymmetry handled in mappers (narrow list enum).
- List card does not show `step` (absent in list DTO).
- Git commits gated by user permission / `git init`.
  `)
