import { useSyncExternalStore } from 'react'

// Simple audio manager: looping background music (Lake, Pokémon D/P/Pt piano
// cover) + lightweight Web-Audio sound effects, with on/off + volume settings
// persisted to localStorage. Browsers block autoplay until the first user
// gesture, so music actually starts via startMusicOnGesture().

const KEY = 'irene-audio'
const DEFAULTS = { musicOn: true, musicVol: 0.5, sfxOn: true, sfxVol: 0.6 }

function load() {
  try {
    return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }
  } catch {
    return { ...DEFAULTS }
  }
}

let state = load()
const listeners = new Set()
const emit = () => listeners.forEach((l) => l())
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

// --- background music (HTMLAudioElement) ---
let music = null
let gestureArmed = false

function ensureMusic() {
  if (music) return music
  music = new Audio(`${import.meta.env.BASE_URL}audio/lake.mp3`)
  music.loop = true
  music.preload = 'auto'
  music.volume = state.musicVol
  return music
}

function applyMusic() {
  if (!music) return
  music.volume = state.musicVol
  if (state.musicOn) music.play().catch(() => {})
  else music.pause()
}

// Start (or resume) music on the first user interaction, then apply settings.
export function startMusicOnGesture() {
  if (gestureArmed) return
  gestureArmed = true
  const go = () => {
    ensureMusic()
    applyMusic()
    window.removeEventListener('pointerdown', go)
    window.removeEventListener('keydown', go)
  }
  window.addEventListener('pointerdown', go)
  window.addEventListener('keydown', go)
}

// --- sound effects (Web Audio blips, no asset files needed) ---
let actx = null
function blip(freq, dur = 0.06, type = 'square') {
  if (!state.sfxOn) return
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)()
    if (actx.state === 'suspended') actx.resume()
    const osc = actx.createOscillator()
    const gain = actx.createGain()
    osc.type = type
    osc.frequency.value = freq
    const t = actx.currentTime
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, state.sfxVol * 0.3), t + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain)
    gain.connect(actx.destination)
    osc.start(t)
    osc.stop(t + dur)
  } catch {
    /* ignore */
  }
}

export function playSfx(name) {
  switch (name) {
    case 'move':
      return blip(520, 0.04, 'square')
    case 'select':
      return blip(720, 0.08, 'square')
    case 'blip':
      return blip(880, 0.02, 'sine')
    default:
      return undefined
  }
}

// --- settings store ---
export const audio = {
  get: () => state,
  set: (patch) => {
    state = { ...state, ...patch }
    save()
    applyMusic()
    emit()
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export function useAudio() {
  return useSyncExternalStore(audio.subscribe, audio.get, audio.get)
}
