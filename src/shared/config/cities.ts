/**
 * Словарь городов для UI-фильтров и MSW seed (точки маршрута).
 * `gcId` соответствует полю `city_gc_id` в схеме OpenAPI.
 */
export type City = {
  gcId: number
  name: string
}

export const CITIES: readonly City[] = [
  { gcId: 59, name: 'Пермь' },
  { gcId: 100, name: 'Москва' },
  { gcId: 78, name: 'Санкт-Петербург' },
  { gcId: 66, name: 'Екатеринбург' },
  { gcId: 54, name: 'Новосибирск' },
  { gcId: 36, name: 'Воронеж' },
  { gcId: 23, name: 'Краснодар' },
  { gcId: 16, name: 'Казань' },
]

export const CITY_NAMES: readonly string[] = CITIES.map((city) => city.name)

export const getCityByName = (name: string): City | undefined =>
  CITIES.find((city) => city.name === name)
