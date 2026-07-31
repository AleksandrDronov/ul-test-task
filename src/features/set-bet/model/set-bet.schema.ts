import { z } from 'zod'

export type SetBetLimits = {
  min?: number | null
  max?: number | null
  step?: number | null
}

/**
 * Matches `isOnStep` in `src/shared/api/msw/store.ts`: the mock rejects a
 * price that isn't an exact whole number of `step`s down from `max`, using
 * the same epsilon to stay safe against floating-point rounding.
 */
const FLOAT_EPSILON = 1e-6

const isOnStep = (price: number, max: number, step: number): boolean => {
  if (step <= 0) return true
  const stepsFromMax = (max - price) / step
  return Math.abs(stepsFromMax - Math.round(stepsFromMax)) < FLOAT_EPSILON
}

/**
 * Client-side mirror of the mock's `setBet` validation order (see
 * task-5 brief resolution #4, replicated in `store.ts`'s doc comment):
 * positive -> above max -> below min -> off-step. `canSetBet` is not part of
 * this schema - it's a form-level disabled state (task-7 resolution #6).
 */
export const createSetBetSchema = (limits: SetBetLimits) =>
  z.object({
    price: z
      .number({ invalid_type_error: 'Введите цену ставки.' })
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
