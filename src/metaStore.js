import { useSyncExternalStore } from 'react'

// Tiny reactive store for the Meta glasses:
//  near = the player is close enough to put them on
//  mode = 'off' (hidden) | 'ask' (yes/no prompt) | 'on' (VR view showing)
let state = { near: false, mode: 'off' }
const listeners = new Set()

export const metaStore = {
  get: () => state,
  set: (patch) => {
    const next = { ...state, ...patch }
    if (next.near === state.near && next.mode === state.mode) return
    state = next
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export const useMetaStore = () => useSyncExternalStore(metaStore.subscribe, metaStore.get)
