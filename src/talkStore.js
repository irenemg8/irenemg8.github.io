import { useSyncExternalStore } from 'react'

// Reactive store for talking to a prop (e.g. the sneaky llama):
//  near = index of the nearest speaker in range (or null)
//  open = index of the speaker we're currently chatting with (or null)
let state = { near: null, open: null }
const listeners = new Set()

export const talkStore = {
  get: () => state,
  set: (patch) => {
    const next = { ...state, ...patch }
    if (next.near === state.near && next.open === state.open) return
    state = next
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export const useTalkStore = () => useSyncExternalStore(talkStore.subscribe, talkStore.get)
