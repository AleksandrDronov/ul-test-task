# Design: SPA грузовых аукционов

Дата: 2026-07-31  
Источники: `AI_AGENT_SPECIFICATION.md`, тестовое задание (Frontend Developer), `openapi.auctions.v0.json`

## Цель

Production-ready SPA для списка аукционов, детальной карточки, истории ставок и установки ставки. OpenAPI — единственный источник истины для контрактов API.

## Решения (зафиксировано)

| Тема                | Выбор                                         |
| ------------------- | --------------------------------------------- |
| UI                  | Tailwind CSS + shadcn/ui (Radix)              |
| Клиентский UI-state | Zustand (точечно)                             |
| Фильтры             | URL search params + Zod fallback              |
| Типы DTO            | `openapi-typescript` + ручные Zod/мапперы     |
| Архитектура         | Strict FSD                                    |
| Маршруты            | Отдельные path для list / detail / bets / bet |

## Стек

- React, TypeScript, Vite
- TanStack Router, TanStack Query
- React Hook Form + Zod
- MSW (stateful)
- Zustand
- Feature-Sliced Design
- Vitest (минимум unit-тестов)
- shadcn/ui + Tailwind CSS + Sonner (toast)

## Архитектура FSD

```text
src/
  app/           # providers, router, global styles, MSW bootstrap
  pages/         # auctions-list, auction-detail, auction-bets, auction-bet
  widgets/       # auction-card, auctions-filters, bets-table, auction-summary
  features/      # filter-auctions, set-bet, prefetch-auction
  entities/      # auction, bet (api, dto, model/vm, mappers, queries)
  shared/        # ui (shadcn), api (http, openapi types, errors), lib, config
```

### Правила слоёв

- UI работает только с ViewModel, не с DTO.
- DTO живут в `entities/*/api` и входe мапперов.
- Мапперы: `mapAuctionListItemDtoToVm`, `mapAuctionDetailDtoToVm`, `mapBetItemDtoToVm`.
- Без `any` и небезопасных приведений типов.

## Маршруты

| Path                          | Назначение                                 |
| ----------------------------- | ------------------------------------------ |
| `/`                           | Список аукционов + фильтры в search params |
| `/auctions/$auctionUuid`      | Детальная страница                         |
| `/auctions/$auctionUuid/bets` | История ставок                             |
| `/auctions/$auctionUuid/bet`  | Форма ставки (deep-link)                   |

`$auctionUuid` — `main.order_uid` (UUID) из list/detail; path param OpenAPI `auctionUuid`.

## API

Базовый URL: `/api/v1` (как в OpenAPI `servers`).

| Method | Path                           | Query key / mutation |
| ------ | ------------------------------ | -------------------- |
| POST   | `/auctions/list`               | `auctions.list`      |
| GET    | `/auctions/{auctionUuid}`      | `auction.detail`     |
| GET    | `/auctions/{auctionUuid}/bets` | `auction.bets`       |
| POST   | `/auctions/{auctionUuid}/bets` | mutation `setBet`    |

После успешного `setBet` инвалидировать: `auctions.list`, `auction.detail`, `auction.bets`.

### Ошибки

Тело ошибок — `ProblemDetail` (`code`, `title`, `message`, optional `trace_id`).  
Для 422 — `ValidationFailed` с массивом ошибок полей.

Обрабатывать HTTP: **401**, **404**, **422**, **503**.  
Маппинг в toast и/или inline UI; для 422 на ставке — `setError` в RHF по `field`.

## DTO → ViewModel

### List item ViewModel (минимум для карточки)

Поля только из `AuctionListItem` (не выдумывать):

- номер заявки, тип аукциона, статус аукциона, торговый статус пользователя
- маршрут погрузка → выгрузка, даты
- груз: название, вес, объём, тип кузова (из route/cargo секций list item)
- текущая цена / current_no_vat, `price_per_km` из `main` (поля `step` в list DTO **нет** — на карточке списка шаг не показываем; шаг — на detail/форме ставки)
- флаг «моя ставка есть / нет» (`trading.your.bet`)
- primary action: `setBet` | `changeBet` | `viewBets` | `disabled` (+ label) из `can_set_bet` + `your.bet` + возможности открыть `/bets`

`hide_points_address_and_contacts` — скрывать адрес на карточке списка.

### Detail ViewModel

Секции: main, organizer, contacts, routes, cargo (+ требования ТС), payment, trading (price/your/settings), admitted orgs.  
Флаги: `can_set_bet`, `hide_bets_history`, `hide_points_address_and_contacts`, `no_view_cargo_price`.

При `hide_points_address_and_contacts` — не показывать адреса точек и контакты.  
При `no_view_cargo_price` — не показывать цену груза.  
При `hide_bets_history` — на странице ставок показать состояние «история скрыта» вместо списка.

### Bet ViewModel

id, даты, цены с/без НДС, перевозчик, place, is_win, is_rejected/cancel_reason, participants count на уровне списка (derived: unique orgs или length bets — зафиксировать: **число уникальных `organization_id` среди ставок**).

## Фильтры и search params

Хранить в URL. Валидировать Zod-схемой с безопасными fallback.

Минимальный набор (из ТЗ):

- `cargo_num` (string)
- `status` (TradingStatus[])
- `statuses` (number[] — статусы аукциона 1–7)
- `auc_type` (AuctionType[] без Unknown в фильтре UI, но контракт допускает значения enum фильтра)
- `load_city`, `unload_city` (из мок-словаря городов)
- `load_date_from`, `load_date_to` (ISO date-time)
- `is_available`, `is_bidder` (boolean)
- `current_price_from`, `current_price_to` (number)
- `page`, `per_page` (defaults в `DEFAULT_AUCTIONS_LIST_SEARCH` / парсере URL)

Request builder строит `AuctionListRequest` только из валидных полей, без выдуманных ключей.

## MSW

- Handlers для всех 4 endpoints + ответы ошибок по сценариям.
- In-memory store: auctions (list + detail payload), bets by auction uuid, cities dictionary.
- `setBet`:
  1. 404 если аукцион не найден
  2. 422 если price невалидна (≤0, вне min/max, не кратна step при наличии step)
  3. иначе добавить ставку, обновить current/available, your.*, status_mobile, is_bidder, list item
- Seed-данные покрывают edge cases: `can_set_bet=false`, `hide_bets_history`, empty bets, hidden contacts/addresses, `no_view_cargo_price`.

Симуляция 401/503 — опциональные query-флаги debug или отдельный мок-переключатель в dev не обязателен; минимум — корректная обработка, если handler вернул эти статусы (можно триггерить через спец. `cargo_num`/`auctionUuid` в моках для ручной проверки).

## UI-поведение

Каждый запрос: Loading (Skeleton) / Empty / Error / Success.

### Список

- TanStack Query, пагинация из `meta`
- Prefetch detail по hover/intent карточки или ссылки
- Адаптив: desktop — фильтры видимы; mobile — Sheet/Drawer (Zustand: `filtersOpen`)

### Карточка (list)

Primary action по правилам:

- `can_set_bet` и нет своей ставки → «Сделать ставку» → `/bet`
- `can_set_bet` и есть своя ставка → «Изменить ставку» → `/bet`
- иначе если ставки можно смотреть → «Смотреть ставки» → `/bets`
- иначе disabled

### Детали / ставки / форма

Как в ТЗ. Форма ставки: RHF + Zod, подсказка available + step, success/error toast.

## Тесты

Vitest:

1. parser search params (Zod fallback)
2. request builder
3. mapper(s) DTO → ViewModel
4. validation schema ставки (required, >0, min, max, step)

## Документация

- `README.md` — установка, запуск, архитектура, структура, тестирование, известные ограничения, что проверялось
- `AI_USAGE.md` — вклад AI, решения разработчика, отклонённые предложения, ручная проверка, риски, улучшения «ещё за день»

## Критерии приёмки

- `vite build` успешен, нет ошибок TypeScript и ESLint
- OpenAPI-контракт соблюдён
- DTO не в UI, нет `any`
- FSD-слои соблюдены
- После мутации инвалидируются list/detail/bets
- MSW реально меняет состояние после ставки

## Замечания по контракту OpenAPI

- Enum `status_mobile` в list item уже, чем `TradingStatus` в detail — парсить оба без расширения значений сверх схемы соответствующего ответа.
- Фильтр `statuses` в схеме — integer[]; UI мапит выбранные статусы аукциона в числа 1–8 по документации enum (Planning=1 … Canceled=8), даже если description фильтра говорит «1–7».
- `setBet` 200 в схеме без body schema — MSW может вернуть пустой `{}` или echo; клиент не зависит от тела успеха.

## Вне скоупа

- Реальный backend / auth
- WebSocket live-обновления торгов
- Полный набор фильтров OpenAPI сверх минимального списка ТЗ (можно добавить позже без ломки builder)
- E2E (Playwright) — опционально, не блокер
- Git init/commit design doc — репозиторий ещё не инициализирован; коммит после `git init` по запросу
  `)
