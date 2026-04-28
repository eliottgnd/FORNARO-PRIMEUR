import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateDiscount } from '@/lib/price-utils'
import { getProductImage } from '@/lib/product-image-utils'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  discountPercent?: number
  quantity: number
  unit: string
  imageUrl: string
  availabilities?: string[]
}

interface CartState {
  items: CartItem[]
  addItem: (product: any, quantity?: number) => { added: boolean; alreadyExists: boolean }
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
  getUniqueItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 0.5) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.productId === product.id)

        if (existingItem) {
          return { added: false, alreadyExists: true }
        } else {
          const { discountedPrice, originalPrice, discountPercent, hasPromotion } = calculateDiscount(product)
          set({
            items: [
              ...currentItems,
              {
                id: Math.random().toString(36).substring(7),
                productId: product.id,
                name: product.nom || product.name,
                price: discountedPrice,
                originalPrice: hasPromotion ? originalPrice : undefined,
                discountPercent: hasPromotion ? discountPercent : undefined,
                quantity,
                unit: product.unit || product.unite,
                imageUrl: getProductImage(product),
                availabilities: Array.isArray(product.availabilities)
                  ? product.availabilities.map((a: any) => typeof a === 'string' ? a : a?.city).filter(Boolean)
                  : [],
              },
            ],
          })
          return { added: true, alreadyExists: false }
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },
      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },
      getUniqueItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
)
