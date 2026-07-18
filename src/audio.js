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
    loadStep() // warm the footstep sample so early steps aren't silent
    window.removeEventListener('pointerdown', go)
    window.removeEventListener('keydown', go)
  }
  window.addEventListener('pointerdown', go)
  window.addEventListener('keydown', go)
}

// --- sound effects (Web Audio blips, no asset files needed) ---
let actx = null

// Call from a real user gesture (e.g. the "Enter" click) to unlock audio, so
// the very next sound — the welcome's voice line — plays on cue rather than
// waiting for some later interaction.
export function unlockAudio() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)()
    if (actx.state !== 'running') actx.resume()
  } catch {
    /* ignore */
  }
}
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

let noiseBuf = null
function noiseBuffer(ctx) {
  if (noiseBuf) return noiseBuf
  const len = Math.floor(ctx.sampleRate * 0.2)
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return noiseBuf
}

// A big-room reverb (long decaying-noise impulse) so steps echo cutely.
let convNode = null
function reverbNode(ctx) {
  if (convNode) return convNode
  const dur = 1.2 // longer tail = bigger room / more echo
  const len = Math.floor(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2)
  }
  convNode = ctx.createConvolver()
  convNode.buffer = buf
  convNode.connect(ctx.destination) // wet -> out
  return convNode
}

// One-shot sound clips loaded from files (e.g. a pug bark on chat). Cached by
// URL; missing files are remembered as `false` and stay silent.
const clipCache = {}
function fetchClip(full) {
  if (full in clipCache) return
  clipCache[full] = null // pending
  actx = actx || new (window.AudioContext || window.webkitAudioContext)()
  fetch(full)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
    .then((a) => actx.decodeAudioData(a))
    .then((buf) => {
      clipCache[full] = buf
    })
    .catch(() => {
      clipCache[full] = false
    })
}
export function preloadClip(url) {
  if (!url) return
  try {
    fetchClip(`${import.meta.env.BASE_URL}${url}`)
  } catch {
    /* ignore */
  }
}
let clipToken = 0
export function playClip(url, vol = 1) {
  if (!state.sfxOn || !url) return
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)()
    const full = `${import.meta.env.BASE_URL}${url}`
    const buf = clipCache[full]
    if (buf === undefined) {
      fetchClip(full) // warm the cache; nothing to play yet
      return
    }
    if (!buf) return // pending decode or missing file
    const fire = () => {
      const g = actx.createGain()
      g.gain.value = state.sfxVol * vol
      g.connect(actx.destination)
      const src = actx.createBufferSource()
      src.buffer = buf
      src.connect(g)
      src.start()
      if (import.meta.env.DEV) (window.__clipLog ||= []).push({ url, t: Math.round(performance.now()) })
    }
    // NEVER start a source on a suspended context: it sits on a frozen clock and
    // then fires together with every other queued clip the instant audio
    // unlocks (that's the "they all play at once, late" bug). Play now if the
    // context is running; otherwise play once it resumes — and only the most
    // recent such request, so a burst can't bunch up.
    if (actx.state === 'running') {
      fire()
      return
    }
    const mine = ++clipToken
    actx.resume().then(() => {
      if (mine === clipToken) fire()
    }).catch(() => {})
  } catch {
    /* ignore */
  }
}

// Footstep: plays the real single-step sample (public/audio/paso.mp3) once per
// footfall, with a little pitch wobble + echo. The walk cycle triggers two
// footfalls, so walking naturally sounds two steps.
let stepBuf = null
let stepTried = false
function loadStep() {
  if (stepTried) return
  stepTried = true
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)()
    fetch(`${import.meta.env.BASE_URL}audio/paso.mp3`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((a) => actx.decodeAudioData(a))
      .then((buf) => {
        stepBuf = buf
      })
      .catch(() => {})
  } catch {
    /* ignore */
  }
}

export function playFootstep(running = false, vol = 1) {
  if (!state.sfxOn || vol <= 0.02) return
  if (!stepBuf) {
    loadStep() // warm up; silent until the sample is ready
    return
  }
  try {
    if (actx.state === 'suspended') actx.resume()
    const t = actx.currentTime
    const out = actx.createGain()
    out.gain.value = state.sfxVol * (running ? 1 : 0.9) * vol
    out.connect(actx.destination) // dry
    const wet = actx.createGain() // echo
    wet.gain.value = 0.5
    out.connect(wet)
    wet.connect(reverbNode(actx))

    const src = actx.createBufferSource()
    src.buffer = stepBuf
    src.playbackRate.value = 1 + (Math.random() * 0.06 - 0.03) // tiny variation
    src.connect(out)
    src.start(t)
  } catch {
    /* ignore */
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
