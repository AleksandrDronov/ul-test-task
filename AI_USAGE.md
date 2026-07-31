# Использование AI при разработке

Честный отчёт о том, что сгенерировал AI, какие решения принимал человек (контроллер), и что проверялось вручную.

## Что делал AI

- **Скаффолдинг проекта**: Vite + React + TypeScript, ESLint, Vitest, Tailwind, path alias `@/`
- **MSW**: seed из ≥8 аукционов с edge-кейсами, stateful store (setBet меняет цену/статус/историю), error triggers
- **FSD-структура**: слои, public API через index-импорты, wiring роутера и провайдеров
- **OpenAPI**: `openapi-typescript`, типы в `shared/api/types/openapi.d.ts`
- **Entities/features**: мапперы DTO→VM, query keys, mutation с инвалидацией, request builder фильтров
- **UI**: shadcn-компоненты (button, input, sheet, select, tooltip и др.), страницы, виджеты, состояния skeleton/empty/error
- **Тесты**: 69 unit-тестов (мапперы, схемы, MSW store, http-client)
- **Документация**: черновики README и этого файла

## Решения человека (контроллер)

| Решение | Выбор | Почему |
|---------|-------|--------|
| Архитектура | Strict FSD | Явные границы слоёв, тестируемые мапперы |
| Фильтры | URL (TanStack Router search params), не localStorage | Шаринг ссылок, back/forward, единый source of truth |
| UI-kit | shadcn + Tailwind | Быстрый старт, доступность Radix |
| Роутинг | Отдельные маршруты (вариант A): list / detail / bets / bet | Чёткие URL, проще prefetch и состояния |
| Типы API | openapi-typescript (вариант A) | Контракт из `openapi.auctions.v0.json` |
| Client state | Zustand (только sheet), не MobX | Минимальный стор для UI chrome |
| Флаги ограничений | UI gate по флагам, mock не redact'ит DTO | Соответствует design spec; проще отладка |
| List primaryAction | Прокси `status !== 'Planning'` для viewBets | В list DTO нет `hide_bets_history`; осознанный компромисс |
| Retry policy | 4xx не ретраятся в QueryClient | Иначе 404/422 «залипают» на skeleton |

## Отклонённые идеи

- **Pages-first** вместо FSD — отклонено: сложнее масштабировать и тестировать
- **MobX** — отклонено в пользу URL + TanStack Query + минимальный Zustand
- **localStorage для фильтров** — отклонено: URL как source of truth
- **Выдуманные поля в list DTO** (`no_view_cargo_price`, `hide_bets_history`) — отклонено: только то, что есть в OpenAPI; прокси на списке вместо фиктивных полей

## Ручные проверки

Проверено в dev с MSW (в т.ч. Playwright на task 8):

- [x] Ставка → инвалидация detail + bets + list, UI обновляется без reload
- [x] `hide_bets_history` (`...0505`) — empty state, bets query не вызывается
- [x] 422 на неверном step (клиентская форма + MSW store)
- [x] Фильтры синхронизируются с URL (в т.ч. debounced `cargo_num`, reset, пагинация)
- [x] Hover prefetch на карточке
- [x] Мобильный sheet фильтров
- [x] Error states: 401 (`__401__`), 404, 503 (`...0503`)

## Риски и технический долг

1. **OpenAPI enum drift**: `status_mobile` в list item — подмножество значений detail enum; маппер сужает тип, при расширении API нужен ревью
2. **Дублирование валидации step**: Zod-схема формы и MSW `setBet` проверяют min/max/step независимо — рассинхрон при смене правил
3. **List vs detail для hide flags**: прокси `Planning` ≠ `hide_bets_history`; карточка может вести на bets, где история скрыта
4. **Bundle size**: ~610 kB main chunk без code splitting / lazy routes
5. **MSW только в dev**: production build без мока — нужен реальный backend для деплоя

## «Ещё один день» — что бы добавили

- E2E (Playwright) в CI с покрытием основных флоу
- Полнее OpenAPI-фильтры (все поля `AuctionListRequest`, если появятся в UI)
- Lazy routes / bundle splitting для снижения initial load
- Storybook для виджетов и состояний empty/error
- Единый модуль валидации цены (shared между формой и MSW) для устранения дублирования
