import { useEffect, useId, useMemo, useState, type BaseSyntheticEvent } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { AuctionDetailTradingPriceVm } from '@/entities/auction'
import type { components } from '@/shared/api/types/openapi'
import { ApiError } from '@/shared/api'
import { getSetBetLimits, type SetBetLimits } from '@/shared/lib'
import { useSetBetMutation } from '../api'
import { createSetBetSchema, type SetBetFormValues } from './set-bet.schema'
import { getDefaultBetPrice } from './get-default-bet-price'

type AuctionType = components['schemas']['AuctionType']

const GENERIC_ERROR_MESSAGE = 'Не удалось отправить ставку. Попробуйте ещё раз.'

const parsePriceInput = (value: string): number | undefined => {
  if (value === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export type UseSetBetFormParams = {
  /** UUID аукциона, для которого отправляется ставка. */
  auctionUuid: string
  /** Торговые ограничения цены: min, max, step и текущая доступная цена. */
  price: AuctionDetailTradingPriceVm
  /** Тип аукциона — влияет на эффективные min/max для валидации. */
  aucType: AuctionType | null
}

export type UseSetBetFormReturn = {
  inputId: string
  hintId: string
  errorId: string
  priceRegister: UseFormRegisterReturn<'price'>
  limits: SetBetLimits
  priceErrorMessage: string | undefined
  isBusy: boolean
  describedBy: string
  submitError: unknown
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  handleUseAvailablePrice: () => void
  handleRetrySubmit: () => void
}

/**
 * Логика формы размещения ставки: валидация через zod, отправка мутации,
 * обработка серверных ошибок 422 по полю `price` и состояние busy для UI.
 *
 * @param params - Параметры аукциона и торговых ограничений.
 * @returns Поля и обработчики для `SetBetForm`: id для a11y, register поля цены,
 *   сообщения об ошибках, флаги `isBusy`/`submitError` и обработчики submit/retry/available price.
 */
export const useSetBetForm = ({
  auctionUuid,
  price,
  aucType,
}: UseSetBetFormParams): UseSetBetFormReturn => {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()

  const [submitError, setSubmitError] = useState<unknown>(null)

  const limits = useMemo(() => getSetBetLimits(price, aucType), [price, aucType])

  const schema = useMemo(() => createSetBetSchema(limits), [limits])

  const resolver = useMemo(() => zodResolver(schema), [schema])

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    setFocus,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SetBetFormValues>({
    resolver,
    defaultValues: { price: getDefaultBetPrice(price) },
  })

  const mutation = useSetBetMutation(auctionUuid)

  useEffect(() => {
    reset({ price: getDefaultBetPrice(price) })
    clearErrors()
  }, [price, aucType, reset, clearErrors])

  const handleUseAvailablePrice = () => {
    if (typeof price.available !== 'number') return
    setValue('price', price.available, { shouldValidate: true, shouldDirty: true })
    setFocus('price')
  }

  const handleRetrySubmit = () => {
    setSubmitError(null)
    mutation.reset()
  }

  const onSubmit = handleSubmit((values) => {
    setSubmitError(null)

    mutation.mutate(values.price, {
      onSuccess: () => {
        toast.success('Ставка принята')
        reset({ price: getDefaultBetPrice(price) })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 422) {
          const priceError = error.fieldErrors.find((fieldError) => fieldError.field === 'price')
          if (priceError) {
            setError('price', { type: 'server', message: priceError.message })
            setFocus('price')
            return
          }
        }

        setSubmitError(error)

        if (!(error instanceof ApiError)) {
          toast.error(GENERIC_ERROR_MESSAGE)
        }
      },
    })
  })

  const priceErrorMessage = errors.price?.message
  const isBusy = isSubmitting || mutation.isPending
  const describedBy = [hintId, priceErrorMessage ? errorId : null].filter(Boolean).join(' ')

  const priceRegister = register('price', { setValueAs: parsePriceInput })

  return {
    inputId,
    hintId,
    errorId,
    limits,
    priceRegister,
    priceErrorMessage,
    isBusy,
    describedBy,
    submitError,
    onSubmit,
    handleUseAvailablePrice,
    handleRetrySubmit,
  }
}
