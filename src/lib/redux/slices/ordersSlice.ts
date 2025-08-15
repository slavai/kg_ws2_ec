'use client'

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Order, PurchasedProduct } from '@/lib/types/database'

interface OrdersState {
  orders: Order[]
  purchasedProducts: PurchasedProduct[]
  loading: boolean
  error: string | null
}

const initialState: OrdersState = {
  orders: [],
  purchasedProducts: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      return data.orders || []
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPurchasedProducts = createAsyncThunk(
  'orders/fetchPurchasedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/purchased-products')
      if (!response.ok) {
        throw new Error('Failed to fetch purchased products')
      }
      const data = await response.json()
      return data.products || []
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateProductStatus = createAsyncThunk(
  'orders/updateProductStatus',
  async ({ productId, status }: { productId: string; status: 'not_applied' | 'applied' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/purchased-products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product status')
      }
      
      const data = await response.json()
      return data.product
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const processPurchase = createAsyncThunk(
  'orders/processPurchase',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process purchase')
      }
      
      const data = await response.json()
      return data.order
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch purchased products
    builder
      .addCase(fetchPurchasedProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPurchasedProducts.fulfilled, (state, action: PayloadAction<PurchasedProduct[]>) => {
        state.loading = false
        state.purchasedProducts = action.payload
      })
      .addCase(fetchPurchasedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update product status
    builder
      .addCase(updateProductStatus.pending, (state) => {
        state.error = null
      })
      .addCase(updateProductStatus.fulfilled, (state, action: PayloadAction<PurchasedProduct>) => {
        const index = state.purchasedProducts.findIndex(
          product => product.id === action.payload.id
        )
        
        if (index !== -1) {
          state.purchasedProducts[index] = action.payload
        }
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.error = action.payload as string
      })

    // Process purchase
    builder
      .addCase(processPurchase.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(processPurchase.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        state.orders.unshift(action.payload) // Add new order to the beginning
      })
      .addCase(processPurchase.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = ordersSlice.actions
export default ordersSlice.reducer
