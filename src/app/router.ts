import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { RoutePendingFallback } from './ui'

export const router = createRouter({
  routeTree,
  defaultPreload: false,
  defaultPendingComponent: RoutePendingFallback,
  defaultPendingMs: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
