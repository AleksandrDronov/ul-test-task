import { create } from 'zustand'

/**
 * Только UI-состояние: открыт ли Sheet с фильтрами на мобильных. Значения фильтров
 * всегда в URL (разрешение #1) — этот стор их никогда не дублирует.
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
