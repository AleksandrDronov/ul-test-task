import { create } from 'zustand'

/**
 * UI-only state: whether the mobile filters Sheet is open. Filter *values*
 * always live in the URL (resolution #1) — this store never mirrors them.
 */
type FiltersUiStore = {
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
}

export const useFiltersUiStore = create<FiltersUiStore>((set) => ({
  filtersOpen: false,
  setFiltersOpen: (open) => {
    set({ filtersOpen: open })
  },
}))
