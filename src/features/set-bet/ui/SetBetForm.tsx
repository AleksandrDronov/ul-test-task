import type { AuctionDetailTradingPriceVm } from '@/entities/auction'
import type { components } from '@/shared/api/types/openapi'
import { formatPrice } from '@/shared/lib'
import { ApiErrorState, Button, Input, Label } from '@/shared/ui'
import { useSetBetForm } from '../model/use-set-bet-form'

type AuctionType = components['schemas']['AuctionType']

export type SetBetFormProps = {
  auctionUuid: string
  price: AuctionDetailTradingPriceVm
  aucType: AuctionType | null
  canSetBet: boolean
}

const CANNOT_BID_MESSAGE = 'Ставки по этому аукциону недоступны.'

export const SetBetForm = ({ auctionUuid, price, aucType, canSetBet }: SetBetFormProps) => {
  const {
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
  } = useSetBetForm({ auctionUuid, price, aucType })

  const hasAvailablePrice = typeof price.available === 'number'

  return (
    <section className="space-y-3" aria-labelledby="set-bet-heading">
      <h2 id="set-bet-heading" className="text-base font-semibold text-foreground">
        Разместить ставку
      </h2>

      {submitError !== null && (
        <ApiErrorState
          error={submitError}
          onRetry={handleRetrySubmit}
          className="p-4"
        />
      )}

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
              step={limits.step ?? price.step ?? 'any'}
              min={limits.min ?? undefined}
              max={limits.max ?? undefined}
              inputMode="decimal"
              autoComplete="off"
              aria-invalid={Boolean(priceErrorMessage)}
              aria-describedby={describedBy || undefined}
              {...priceRegister}
            />
            <p id={hintId} className="text-sm text-muted-foreground">
              Доступная цена: {formatPrice(price.available)}, шаг: {formatPrice(price.step)}
              {typeof limits.min === 'number' && typeof limits.max === 'number' && (
                <>
                  {' '}
                  · от {formatPrice(limits.min)} до {formatPrice(limits.max)}
                </>
              )}
            </p>
            {priceErrorMessage && (
              <p id={errorId} role="alert" className="text-sm text-destructive">
                {priceErrorMessage}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {hasAvailablePrice && (
              <Button
                type="button"
                variant="outline"
                disabled={!canSetBet || isBusy}
                onClick={handleUseAvailablePrice}
              >
                {formatPrice(price.available)}
              </Button>
            )}

            <Button type="submit" disabled={!canSetBet || isBusy} aria-busy={isBusy}>
              {isBusy ? 'Отправка…' : 'Сделать ставку'}
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  )
}
