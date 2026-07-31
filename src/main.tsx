import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/app/App.providers.component'
import './app/styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

const enableMocking = async (): Promise<void> => {
  if (!import.meta.env.DEV) return

  const { worker } = await import('@/shared/api/msw/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

void enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>
        <main className="min-h-screen bg-background p-8 text-foreground">
          <h1 className="text-2xl font-semibold">Грузовые аукционы</h1>
          <p className="mt-2 text-muted-foreground">Приложение в разработке</p>
        </main>
      </AppProviders>
    </StrictMode>,
  )
})
