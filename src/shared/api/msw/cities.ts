/**
 * Small city dictionary shared by the MSW seed data (route points) and by
 * Task 8's filter UI (city autocomplete/select). `gcId` mirrors the
 * `city_gc_id` field used on route points in the OpenAPI schema.
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
