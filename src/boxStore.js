import { useSyncExternalStore } from 'react'

// Tiny reactive store for the diorama-box interaction:
//  near = index of the box the player is close to (or null)
//  peek = index of the box we're currently looking inside (or null)
let state = { near: null, peek: null }
const listeners = new Set()

export const boxStore = {
  get: () => state,
  set: (patch) => {
    const next = { ...state, ...patch }
    if (next.near === state.near && next.peek === state.peek) return
    state = next
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export const useBoxStore = () => useSyncExternalStore(boxStore.subscribe, boxStore.get)
