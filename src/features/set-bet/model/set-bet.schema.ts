import { z } from 'zod'

export type SetBetLimits = {
  min?: number | null
  max?: number | null
  step?: number | null
}

/**
 * Совпадает с `isOnStep` в `src/shared/api/msw/store.ts`: мок отклоняет цену,
 * не кратную `step` от `max`, с тем же epsilon для защиты от ошибок float.
 */
const FLOAT_EPSILON = 1e-6

const isOnStep = (price: number, max: number, step: number): boolean => {
  if (step <= 0) return true
  const stepsFromMax = (max - price) / step
  return Math.abs(stepsFromMax - Math.round(stepsFromMax)) < FLOAT_EPSILON
}

/**
 * Клиентское зеркало порядка валидации мока `setBet` (разрешение #4 task-5,
 * см. комментарий в `store.ts`): positive → выше max → ниже min → off-step.
 * `canSetBet` не входит в схему — это disabled-состояние формы (разрешение task-7 #6).
 */
export const createSetBetSchema = (limits: SetBetLimits) =>
  z.object({
    price: z
      .number({
        required_error: 'Введите цену ставки.',
        invalid_type_error: 'Введите цену ставки.',
      })
      .superRefine((price, ctx) => {
      if (price <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Цена должна быть больше 0.' })
        return
      }

      const { min, max, step } = limits

      if (typeof max === 'number' && price > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Цена не может быть больше ${String(max)}.`,
        })
        return
      }

      if (typeof min === 'number' && price < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Цена не может быть меньше ${String(min)}.`,
        })
        return
      }

      if (typeof max === 'number' && typeof step === 'number' && !isOnStep(price, max, step)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Цена должна быть кратна шагу ${String(step)} (считая от максимальной цены).`,
        })
      }
    }),
  })

export type SetBetFormValues = z.infer<ReturnType<typeof createSetBetSchema>>
