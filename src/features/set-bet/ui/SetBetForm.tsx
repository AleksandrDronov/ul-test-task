import { useId, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { AuctionDetailTradingPriceVm } from '@/entities/auction/model/auction-detail.vm'
import { ApiError } from '@/shared/api/api-error'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useSetBetMutation } from '../api/use-set-bet-mutation'
import { createSetBetSchema, type SetBetFormValues } from '../model/set-bet.schema'

export type SetBetFormProps = {
  /** Аукцион, для которого размещается ставка. */
  auctionUuid: string
  /** Границы торговой цены, против которых форма валидирует ставку (см. `AuctionDetailVm.trading.price`). */
  price: AuctionDetailTradingPriceVm
  /** При `false` форма отображается disabled с пояснением, а не скрывается (разрешение #6). */
  canSetBet: boolean
}

const CANNOT_BID_MESSAGE = 'Ставки по этому аукциону недоступны.'
const GENERIC_ERROR_MESSAGE = 'Не удалось отправить ставку. Попробуйте ещё раз.'

export const SetBetForm = ({ auctionUuid, price, canSetBet }: SetBetFormProps) => {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()

  const schema = useMemo(
    () => createSetBetSchema({ min: price.min, max: price.max, step: price.step }),
    [price.min, price.max, price.step],
  )

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SetBetFormValues>({ resolver: zodResolver(schema) })

  const mutation = useSetBetMutation(auctionUuid)

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values.price, {
      onSuccess: () => {
        toast.success('Ставка принята')
        reset()
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 422) {
          const priceError = error.fieldErrors.find((fieldError) => fieldError.field === 'price')
          if (priceError) {
            setError('price', { type: 'server', message: priceError.message })
            return
          }
        }

        if (error instanceof ApiError) {
          toast.error(error.title, { description: error.message })
          return
        }

        toast.error(GENERIC_ERROR_MESSAGE)
      },
    })
  })

  const priceErrorMessage = errors.price?.message
  const isBusy = isSubmitting || mutation.isPending
  const describedBy = [hintId, priceErrorMessage ? errorId : null].filter(Boolean).join(' ')

  return (
    <form
      onSubmit={(event) => {
        void onSubmit(event)
      }}
      noValidate
      className="space-y-3"
    >
      <fieldset disabled={!canSetBet} className="space-y-3">
        {!canSetBet && (
          <p role="status" className="text-sm text-muted-foreground">
            {CANNOT_BID_MESSAGE}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor={inputId}>Ваша ставка</Label>
          <Input
            id={inputId}
            type="number"
            step="any"
            inputMode="decimal"
            aria-invalid={Boolean(priceErrorMessage)}
            aria-describedby={describedBy || undefined}
            {...register('price', { valueAsNumber: true })}
          />
          <p id={hintId} className="text-sm text-muted-foreground">
            Доступная цена: {price.available ?? '—'}, шаг: {price.step ?? '—'}
          </p>
          {priceErrorMessage && (
            <p id={errorId} role="alert" className="text-sm text-destructive">
              {priceErrorMessage}
            </p>
          )}
        </div>

        <Button type="submit" disabled={!canSetBet || isBusy} aria-busy={isBusy}>
          {isBusy ? 'Отправка…' : 'Сделать ставку'}
        </Button>
      </fieldset>
    </form>
  )
}
