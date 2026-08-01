import { z } from 'zod'
import { isBetPriceOnStep, type SetBetLimits } from '@/shared/lib'

export type { SetBetLimits }

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

      const { min, max, step, stepReference, stepDirection } = limits

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

      if (
        typeof stepReference === 'number' &&
        typeof step === 'number' &&
        typeof stepDirection === 'string' &&
        !isBetPriceOnStep(price, step, stepReference, stepDirection)
      ) {
        const stepAnchorLabel =
          stepDirection === 'increasing' ? 'минимальной цены' : 'максимальной цены'

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Цена должна быть кратна шагу ${String(step)} (считая от ${stepAnchorLabel}).`,
        })
      }
    }),
  })

export type SetBetFormValues = z.infer<ReturnType<typeof createSetBetSchema>>
