import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ['**/routeTree.gen.ts', '**/openapi.d.ts', '**/mockServiceWorker.js'],
  },
  {
    rules: {
      // Public API через index.ts; для shared/ui (shadcn) правило не применяется
      'fsd/public-api': 'off',
      // В небольшом SPA слайс с одной страницей — нормальная декомпозиция
      'fsd/insignificant-slice': 'off',
    },
  },
])
