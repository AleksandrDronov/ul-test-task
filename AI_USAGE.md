# Использование AI при разработке

Честный отчёт о том, что сгенерировал AI, какие решения принимал человек (контроллер), и что проверялось вручную.

## Что делал AI

- **Скаффолдинг проекта**: Vite + React + TypeScript, ESLint, Vitest, Tailwind, path alias `@/`
- **MSW**: seed из ≥8 аукционов с edge-кейсами, stateful store (setBet меняет цену/статус/историю), error triggers
- **FSD-структура**: слои, public API через index-импорты, wiring роутера и провайдеров
- **OpenAPI**: `openapi-typescript`, типы в `shared/api/types/openapi.d.ts`
- **Entities/features**: мапперы DTO→VM, query keys, mutation с инвалидацией, request builder фильтров
- **UI**: shadcn-компоненты (button, input, sheet, select, tooltip и др.), страницы, виджеты, состояния skeleton/empty/error
- **Форма ставки**: `SetBetForm`, Zod-схема `createSetBetSchema`, хук `useSetBetForm`, `getDefaultBetPrice`, обработка 422 по полю `price`
- **Обработка ошибок запросов**: `AsyncQueryView`, `AuctionQueryError` (404 → empty state, остальное → `ApiErrorState`), вынесенный `query-client.ts`
- **Роутер**: TanStack Router с `autoCodeSplitting: true` в Vite-плагине
- **Тесты**: 75 unit-тестов (мапперы, схемы, MSW store, http-client, `SetBetForm`, mutation)
- **Документация**: README и этот файл; JSDoc и комментарии в коде переведены на русский



## Решения человека (контроллер)


| Решение            | Выбор                                                      | Почему                                                    |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------------- |
| Архитектура        | Strict FSD                                                 | Явные границы слоёв, тестируемые мапперы                  |
| Фильтры            | URL (TanStack Router search params), не localStorage       | Шаринг ссылок, back/forward, единый source of truth       |
| UI-kit             | shadcn + Tailwind                                          | Быстрый старт, доступность Radix                          |
| Роутинг            | Отдельные маршруты (вариант A): list / detail / bets / bet | Чёткие URL, проще prefetch и состояния                    |
| Типы API           | openapi-typescript (вариант A)                             | Контракт из `openapi.auctions.v0.json`                    |
| Client state       | Zustand (только sheet), не MobX                            | Минимальный стор для UI chrome                            |
| Флаги ограничений  | UI gate по флагам, mock не redact'ит DTO                   | Соответствует design spec; проще отладка                  |
| List primaryAction | Прокси `status !== 'Planning'` для viewBets                | В list DTO нет `hide_bets_history`; осознанный компромисс |
| Retry policy       | 4xx не ретраятся в QueryClient                             | Иначе 404/422 «залипают» на skeleton                      |
| Форма ставки       | Presentational/container: `SetBetForm` + `useSetBetForm`   | UI остаётся тонким, логику проще тестировать отдельно     |
| Ошибки страниц     | `AsyncQueryView` + feature `auction-error`                 | Единый паттерн pending/error/retry на detail/bets/bet     |
| Дефолты списка     | `DEFAULT_AUCTIONS_LIST_SEARCH` (`page: 1`, `per_page: 8`)  | Один источник для парсера URL и ссылок «назад к списку»   |
| Тесты формы ставки | Мок `postSetBet` на границе API, не RHF/Zod                | Проверяем реальную валидацию и wiring формы               |
| Валидация step     | Zod-схема зеркалит `isOnStep` из MSW store                 | Одинаковый порядок проверок и `FLOAT_EPSILON`             |




## Отклонённые идеи

- **Pages-first** вместо FSD — отклонено: сложнее масштабировать и тестировать
- **MobX** — отклонено в пользу URL + TanStack Query + минимальный Zustand
- **localStorage для фильтров** — отклонено: URL как source of truth
- **Выдуманные поля в list DTO** (`no_view_cargo_price`, `hide_bets_history`) — отклонено: только то, что есть в OpenAPI; прокси на списке вместо фиктивных полей
- **Мок React Hook Form в тестах** `SetBetForm` — отклонено: теряется покрытие реальной валидации и submit-flow
- **Общий npm-пакет валидации цены** — отклонено на текущем этапе: достаточно синхронизации алгоритма в схеме и MSW через комментарии



## Ручные проверки

Проверено в dev с MSW (в т.ч. Playwright на task 8):

- [x] Ставка → инвалидация detail + bets + list, UI обновляется без reload
- [x] `hide_bets_history` (`...0505`) — empty state, bets query не вызывается
- [x] 422 на неверном step (клиентская форма + MSW store)
- [x] Фильтры синхронизируются с URL (в т.ч. debounced `cargo_num`, reset, пагинация)
- [x] Hover prefetch на карточке
- [x] Мобильный sheet фильтров
- [x] Error states: 401 (`__401__`), 404, 503 (`...0503`)
- [x] Форма ставки: prefill по `available`, quick-bid кнопка, disabled при `canSetBet: false`
- [x] 422 с полем `price` маппится на поле формы; прочие API-ошибки — `ApiErrorState` с retry
- [x] Сброс формы и лимитов при смене `price` props (после инвалидации detail)



## Риски и технический долг

1. **OpenAPI enum drift**: `status_mobile` в list item — подмножество значений detail enum; маппер сужает тип, при расширении API нужен ревью
2. **Дублирование валидации step**: Zod-схема и MSW `setBet` используют одинаковый алгоритм, но код всё ещё в двух файлах — при смене правил легко забыть обновить оба
3. **List vs detail для hide flags**: прокси `Planning` ≠ `hide_bets_history`; карточка может вести на bets, где история скрыта
4. **MSW только в dev**: production build без мока — нужен реальный backend для деплоя



## «Ещё один день» — что бы добавили

- E2E (Playwright) в CI с покрытием основных флоу
- Полнее OpenAPI-фильтры (все поля `AuctionListRequest`, если появятся в UI)
- Выделить `isOnStep` / валидацию цены в `shared/lib` и переиспользовать в форме и MSW
- Storybook для виджетов и состояний empty/error
- Починить тесты `parse-auctions-search-params` под актуальный `per_page: 8`

