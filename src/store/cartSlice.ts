import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, StoreProduct } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<StoreProduct>) => {
      const existing = state.items.find((i) => i.product.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ product: action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload)
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.product.id === action.payload.productId)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },
})

export const {
  addToCart, removeFromCart, updateQuantity, clearCart,
  toggleCart, openCart, closeCart,
} = cartSlice.actions
export default cartSlice.reducer
