import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreProduct } from '@/types'
import { storeProducts } from '@/data'

interface StoreState {
  products: StoreProduct[]
  selectedProduct: StoreProduct | null
  categoryFilter: string | null
  isLoading: boolean
}

const initialState: StoreState = {
  products: storeProducts,
  selectedProduct: null,
  categoryFilter: null,
  isLoading: false,
}

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<StoreProduct[]>) => {
      state.products = action.payload
    },
    setSelectedProduct: (state, action: PayloadAction<StoreProduct | null>) => {
      state.selectedProduct = action.payload
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.categoryFilter = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setProducts, setSelectedProduct, setCategoryFilter, setLoading } = storeSlice.actions
export default storeSlice.reducer
