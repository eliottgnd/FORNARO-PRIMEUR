import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteIds: string[]
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (productId) => {
        set({ favoriteIds: [...get().favoriteIds, productId] })
      },
      removeFavorite: (productId) => {
        set({ favoriteIds: get().favoriteIds.filter(id => id !== productId) })
      },
      isFavorite: (productId) => {
        return get().favoriteIds.includes(productId)
      },
      toggleFavorite: (productId) => {
        if (get().favoriteIds.includes(productId)) {
          get().removeFavorite(productId)
        } else {
          get().addFavorite(productId)
        }
      },
    }),
    {
      name: 'favorites-store',
    }
  )
)