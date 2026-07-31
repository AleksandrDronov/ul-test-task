import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/app/App.providers.component'
import './app/styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

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
