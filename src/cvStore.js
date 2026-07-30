import { useSyncExternalStore } from 'react'

// Tiny reactive store for the CV hologram:
//  near = the player is close enough to step up and read it
//  open = the camera has moved in and the page controls are showing
//  page = which CV_PAGES sheet is being projected
let state = { near: false, open: false, page: 0 }
const listeners = new Set()

export const cvStore = {
  get: () => state,
  set: (patch) => {
    const next = { ...state, ...patch }
    if (next.near === state.near && next.open === state.open && next.page === state.page) return
    state = next
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export const useCvStore = () => useSyncExternalStore(cvStore.subscribe, cvStore.get)
