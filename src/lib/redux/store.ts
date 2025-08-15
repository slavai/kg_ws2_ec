import { configureStore, createSlice } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Temporary slice для инициализации store
const tempSlice = createSlice({
  name: 'temp',
  initialState: { initialized: true },
  reducers: {}
})

export const store = configureStore({
  reducer: {
    temp: tempSlice.reducer,
    // Здесь будем добавлять другие slices
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch