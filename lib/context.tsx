'use client'

import React, { createContext, useContext } from 'react'
import { useTrackerStore } from './store'

type StoreType = ReturnType<typeof useTrackerStore>
const StoreContext = createContext<StoreType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useTrackerStore()
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
