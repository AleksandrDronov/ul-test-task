# Грузовые аукционы — SPA

Клиентское приложение для просмотра грузовых аукционов, истории ставок и размещения ставок. Работает **только с MSW-моком** — реального бэкенда, авторизации и WebSocket в проекте нет.

## Быстрый старт

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`. MSW подключается автоматически в dev-режиме (`src/main.tsx`).

Дополнительные команды:

```bash
npm test          # unit-тесты (Vitest)
npm run lint      # ESLint
npm run build     # typecheck + production-сборка
npm run preview   # предпросмотр production-сборки
npm run generate:api  # перегенерация типов из openapi.auctions.v0.json
```

## Архитектура

Проект следует **Feature-Sliced Design (FSD)**:

| Слой       | Назначение                                                   |
| ---------- | ------------------------------------------------------------ |
| `app`      | Роутер, провайдеры, глобальные стили                         |
| `pages`    | Страницы-оркестраторы (fetch + состояния UI)                 |
| `widgets`  | Крупные UI-блоки (карточка, фильтры, таблица ставок)         |
| `features` | Пользовательские сценарии (фильтры, ставка, prefetch)        |
| `entities` | Доменные сущности (auction, bet), API-хуки, мапперы DTO → VM |
| `shared`   | UI-kit, HTTP-клиент, MSW, утилиты, конфиг                    |

**Ключевые решения:**

- **TanStack Router** — file-based routing, фильтры списка в URL (`validateSearch` + Zod)
- **TanStack Query** — кэш, prefetch при hover, инвалидация после ставки
- **ViewModels** — UI не импортирует OpenAPI DTO напрямую; маппинг в `entities/*/model/`
- **React Hook Form + Zod** — форма ставки с клиентской валидацией min/max/step
- **Zustand** — только UI-состояние мобильного sheet фильтров (значения фильтров — в URL)

Файлы маршрутов в `src/app/routes/` содержат только конфиг `createFileRoute`.

## Структура проекта

```
src/
├── app/                  # router, routes, providers, layout
├── pages/                # auctions-list, auction-detail, auction-bets, auction-bet
├── widgets/              # auction-card, auctions-filters, bets-table, auction-summary
├── features/             # filter-auctions, set-bet, prefetch-auction
├── entities/             # auction, bet (api + model)
└── shared/               # api (http, msw, openapi types), ui, lib, config
tests/                    # unit-тесты (мапперы, схемы, MSW store, http-client)
openapi.auctions.v0.json  # контракт API
```

## Маршруты

| URL                           | Экран                                     |
| ----------------------------- | ----------------------------------------- |
| `/`                           | Список аукционов с фильтрами и пагинацией |
| `/auctions/:auctionUuid`      | Детали аукциона                           |
| `/auctions/:auctionUuid/bets` | История ставок                            |
| `/auctions/:auctionUuid/bet`  | Форма ставки                              |

## Тестирование

Покрытие unit-тестами (75 тестов в 10 файлах):

- парсинг и сборка параметров фильтров (`features/filter-auctions`)
- маппинг DTO → ViewModel (`entities/auction`, `entities/bet`)
- схема валидации ставки (`features/set-bet`)
- MSW store (setBet side effects, пагинация, 422)
- HTTP-клиент (ApiError, problem+json)

```bash
npm test
```

## Проверенные сценарии

Ручная проверка (dev + MSW):

1. Список загружается; фильтр `cargo_num` меняет URL и результат
2. Hover prefetch на карточке не ломает UI
3. Детали показывают все секции (организатор, маршрут, груз, торги и т.д.)
4. Успешная ставка обновляет цену, историю и статус без перезагрузки страницы
5. 422 при неверном шаге цены (клиент + сервер)
6. Аукцион с `hide_bets_history` — пустое состояние «история скрыта»
7. Мобильные фильтры в Sheet (ширина ≤ md)

### Seed-аукционы для ручных проверок

| UUID (суффикс) | Кейс                                           |
| -------------- | ---------------------------------------------- |
| `...0501`      | Активный, можно ставить, есть чужие ставки     |
| `...0502`      | Пользователь уже лидирует                      |
| `...0504`      | `can_set_bet: false`                           |
| `...0505`      | `hide_bets_history: true`                      |
| `...0506`      | Пустая история ставок                          |
| `...0507`      | Скрыты адреса/контакты + `no_view_cargo_price` |
| `...0508`      | Статус Planning — ставки ещё недоступны        |
| `...0509`      | Завершён, пользователь — победитель            |

### Триггеры ошибок (ручная проверка)

| Действие                                                          | Ожидаемый статус                   |
| ----------------------------------------------------------------- | ---------------------------------- |
| Фильтр `cargo_num = __401__`                                      | 401 — «Сессия истекла»             |
| UUID `00000000-0000-4000-8000-000000000503` (детали/ставки/форма) | 503 — «Сервис временно недоступен» |
| Несуществующий UUID                                               | 404 — «Не найдено»                 |
| Ставка с неверным шагом / вне min-max                             | 422 — ошибка валидации             |

## Ограничения и известные допущения

### MSW only

- Нет реального API, авторизации, refresh-токенов, WebSocket/realtime
- MSW включается **только в dev** (`import.meta.env.DEV`); production-сборка ходит на `API_BASE_URL` без мока
- In-memory store: данные сбрасываются при перезагрузке страницы

### Флаги ограничений — UI gate, не redaction

Мок **не редактирует** DTO (адреса, цены, ставки остаются в ответе). UI скрывает поля по флагам:

- `hide_points_address_and_contacts` — адреса точек и секция контактов
- `no_view_cargo_price` — цена груза и цена за км
- `hide_bets_history` — таблица ставок (запрос bets не выполняется)
- `can_set_bet` — форма ставки в disabled-состоянии

### Прокси на списке: `viewBets` vs `disabled`

В **list DTO** нет полей `no_view_cargo_price` и `hide_bets_history` (они есть только в detail). Для кнопки «Смотреть ставки» на карточке используется прокси:

- пока статус `Planning` → кнопка `disabled` («Ставка недоступна»)
- для любого другого статуса → `viewBets` («Смотреть ставки»)

Это **не эквивалент** detail-флагу `hide_bets_history`: аукцион `...0505` в статусе Auction на списке покажет «Смотреть ставки», а на странице ставок — «история скрыта». Поведение задокументировано как осознанное допущение (см. `map-auction-list-item.ts`).

### Прочее

- `status_mobile` в list DTO — урезанный enum относительно detail; маппер сужает тип
- На карточке списка нет `step` (поле отсутствует в list DTO)
- Vite предупреждает о размере main chunk > 500 kB (нет lazy routes)

## Стек

React 19, TypeScript, Vite 8, TanStack Router/Query, Tailwind CSS 4, shadcn/ui (Radix), MSW 2, Zod, React Hook Form, Zustand, openapi-typescript, Vitest, ESLint.
