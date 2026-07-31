import type { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/shared/api'
import { SetBetForm } from '@/features/set-bet'
import type { AuctionDetailTradingPriceVm } from '@/entities/auction'
import * as betApi from '@/entities/bet'

// Stub the API boundary (the mutation's actual network call), not React
// Hook Form or the schema - we want to exercise real validation and real
// form wiring, per the brief's testing guidance.
vi.mock('@/entities/bet', () => ({
  postSetBet: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const postSetBetMock = vi.mocked(betApi.postSetBet)

// Realistic trading params from the MSW seed (cargo_num '00000000501'): a
// `Down` auction with min 30000, max 50000, step 1000.
const PRICE: AuctionDetailTradingPriceVm = {
  start: 50000,
  startNoVat: 41666.67,
  current: 46000,
  currentNoVat: 38333.33,
  available: 45000,
  availableNoVat: 37500,
  min: 30000,
  minNoVat: 25000,
  max: 50000,
  maxNoVat: 41666.67,
  step: 1000,
  stepNoVat: 833.33,
  pricePerKm: 21.3,
}

const renderForm = (overrides: Partial<ComponentProps<typeof SetBetForm>> = {}) => {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <SetBetForm auctionUuid="uuid-1" price={PRICE} canSetBet {...overrides} />
    </QueryClientProvider>,
  )
}

const getPriceInput = () => screen.getByLabelText('Ваша ставка')
const getSubmitButton = () => screen.getByRole('button', { name: /сделать ставку/i })

describe('SetBetForm', () => {
  beforeEach(() => {
    postSetBetMock.mockReset()
  })

  it('shows the field error for an invalid price and does not call the mutation', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(getPriceInput(), '100')
    await user.click(getSubmitButton())

    expect(await screen.findByRole('alert')).toHaveTextContent('Цена не может быть меньше 30000.')
    expect(postSetBetMock).not.toHaveBeenCalled()
  })

  it('calls the mutation with the parsed numeric price on a valid submit', async () => {
    postSetBetMock.mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderForm()

    await user.type(getPriceInput(), '45000')
    await user.click(getSubmitButton())

    await waitFor(() => {
      expect(postSetBetMock).toHaveBeenCalledWith('uuid-1', 45000)
    })
  })

  it('maps a 422 price field error from the server onto the field', async () => {
    postSetBetMock.mockRejectedValue(
      new ApiError({
        status: 422,
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
        fieldErrors: [{ field: 'price', message: 'Ставки по этому аукциону недоступны.' }],
      }),
    )
    const user = userEvent.setup()
    renderForm()

    await user.type(getPriceInput(), '45000')
    await user.click(getSubmitButton())

    expect(await screen.findByRole('alert')).toHaveTextContent('Ставки по этому аукциону недоступны.')
  })

  it('renders disabled with an explanation and blocks submission when canSetBet is false', async () => {
    const user = userEvent.setup()
    renderForm({ canSetBet: false })

    expect(screen.getByRole('status')).toHaveTextContent('Ставки по этому аукциону недоступны.')
    expect(getPriceInput()).toBeDisabled()
    expect(getSubmitButton()).toBeDisabled()

    await user.click(getSubmitButton())
    expect(postSetBetMock).not.toHaveBeenCalled()
  })
})
