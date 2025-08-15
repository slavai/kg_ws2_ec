'use client'

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Cart hooks
export const useCart = () => {
  return useAppSelector((state) => state.cart)
}

export const useCartItems = () => {
  return useAppSelector((state) => state.cart.items)
}

export const useCartTotal = () => {
  return useAppSelector((state) => state.cart.total)
}

export const useCartItemCount = () => {
  return useAppSelector((state) => state.cart.itemCount)
}

export const useCartLoading = () => {
  return useAppSelector((state) => state.cart.loading)
}

// Orders hooks
export const useOrders = () => {
  return useAppSelector((state) => state.orders)
}

export const useOrdersList = () => {
  return useAppSelector((state) => state.orders.orders)
}

export const usePurchasedProducts = () => {
  return useAppSelector((state) => state.orders.purchasedProducts)
}

export const useOrdersLoading = () => {
  return useAppSelector((state) => state.orders.loading)
}
