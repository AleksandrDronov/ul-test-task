import { Link, Outlet } from '@tanstack/react-router'
import { DEFAULT_AUCTIONS_LIST_SEARCH } from '@/shared/config'

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-3 md:px-8">
          <Link
            to="/"
            search={DEFAULT_AUCTIONS_LIST_SEARCH}
            className="rounded-sm text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Грузовые аукционы
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
