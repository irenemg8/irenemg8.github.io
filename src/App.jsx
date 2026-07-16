import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'
import Scene from './Scene.jsx'
import { useBoxStore, boxStore } from './boxStore.js'
import { BOXES } from './Boxes.jsx'
import { useAudio, audio, playSfx, startMusicOnGesture } from './audio.js'

// Pokémon-style dialogue. Types text letter by letter with a blinking arrow;
// any key advances. A box may also carry a branching `menu` (pick a place →
// read its story → choose again or bow out). Finishing the dialogue (or picking
// "That’s all for now") exits the box view — no manual exit key.
const EXIT_OPTION = { label: 'That’s all for now', exit: true }
const exitBox = () => boxStore.set({ peek: null })

function DialogueBox() {
  const { peek } = useBoxStore()
  const box = peek != null ? BOXES[peek] : null
  const menu = box?.menu ?? null
  const options = menu ? [...menu.options, EXIT_OPTION] : null

  const [view, setView] = useState('text') // 'text' | 'menu'
  const [pages, setPages] = useState([]) // current text block
  const [page, setPage] = useState(0)
  const [n, setN] = useState(0) // characters revealed on the current page
  const [menuIndex, setMenuIndex] = useState(0)
  const [heard, setHeard] = useState(0) // how many places already explained

  const text = view === 'text' ? pages[page] ?? '' : ''
  const full = n >= text.length

  // (Re)start the dialogue for the current box.
  const start = (b) => {
    setHeard(0)
    setMenuIndex(0)
    setPage(0)
    setN(0)
    if (b?.dialog?.length) {
      setView('text')
      setPages(b.dialog)
    } else if (b?.menu) {
      setView('menu')
      setPages([])
    }
  }

  // Entering a new box restarts everything.
  useEffect(() => {
    if (box) start(box)
  }, [peek])

  // Reset the typewriter whenever the visible text block/page changes.
  useEffect(() => {
    setN(0)
  }, [pages, page, view])

  // Typewriter: reveal one more character until the page is full.
  useEffect(() => {
    if (view !== 'text' || n >= text.length) return
    const id = setTimeout(() => setN((c) => c + 1), 28)
    return () => clearTimeout(id)
  }, [view, n, text])

  const advanceText = () => {
    playSfx('blip')
    if (!full) setN(text.length) // finish typing this page instantly
    else if (page < pages.length - 1) setPage((p) => p + 1)
    else if (menu) {
      setView('menu') // end of a text block -> back to the menu
      setMenuIndex(0)
    } else exitBox() // plain box finished -> leave the box view
  }

  const selectOption = (idx) => {
    const opt = options?.[idx]
    if (!opt) return
    playSfx('select')
    if (opt.exit) {
      exitBox() // "That’s all for now" -> leave the box view
      return
    }
    setHeard((h) => h + 1)
    setPages(opt.text)
    setPage(0)
    setN(0)
    setView('text')
  }

  // Keyboard drives the dialogue (no manual exit key).
  useEffect(() => {
    if (!box) return
    const onKey = (e) => {
      if (['KeyF', 'ShiftLeft', 'ShiftRight'].includes(e.code)) return
      if (view === 'menu' && options) {
        const len = options.length
        const COLS = 2 // matches the 2-column grid in CSS
        if (e.code === 'ArrowUp') {
          e.preventDefault()
          playSfx('move')
          setMenuIndex((i) => (i - COLS >= 0 ? i - COLS : i))
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          playSfx('move')
          setMenuIndex((i) => (i + COLS < len ? i + COLS : i))
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault()
          playSfx('move')
          setMenuIndex((i) => (i > 0 ? i - 1 : i))
        } else if (e.code === 'ArrowRight') {
          e.preventDefault()
          playSfx('move')
          setMenuIndex((i) => (i < len - 1 ? i + 1 : i))
        } else if (['Enter', 'NumpadEnter', 'Space'].includes(e.code)) {
          e.preventDefault()
          setMenuIndex((i) => {
            selectOption(i)
            return i
          })
        }
        return
      }
      e.preventDefault()
      advanceText()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [box, view, options, full, text, page, pages])

  if (!box) return null

  if (view === 'menu' && options) {
    return (
      <div className="dialogue dialogue--menu">
        <div className="dialogue__prompt">{heard === 0 ? menu.prompt : menu.again}</div>
        <ul className="dialogue__options">
          {options.map((o, i) => (
            <li
              key={i}
              className={i === menuIndex ? 'is-active' : ''}
              onMouseEnter={() => setMenuIndex(i)}
              onClick={() => selectOption(i)}
            >
              <span className="dialogue__cursor">{i === menuIndex ? '▶' : ' '}</span>
              {o.label}
            </li>
          ))}
        </ul>
        <div className="dialogue__hint">↑↓←→ choose · Enter to select</div>
      </div>
    )
  }

  return (
    <div className="dialogue" onClick={advanceText}>
      <div className="dialogue__text">{text.slice(0, n)}</div>
      <div className="dialogue__hint">Any key to continue</div>
      {full && <div className="dialogue__arrow">▼</div>}
    </div>
  )
}

function PeekHint() {
  const { near, peek } = useBoxStore()
  // while peeking the dialogue box takes over; only prompt when we're near one.
  const text = peek != null ? null : near != null ? 'Press F to look inside 📦' : null
  if (!text) return null
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '5.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.92)',
        color: '#16141a',
        padding: '0.55rem 1.2rem',
        borderRadius: 999,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: '0.9rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  )
}

function Loader() {
  const { progress, active } = useProgress()
  if (!active && progress >= 100) return null
  return (
    <div className="loading">
      <div className="loading__title">Irene Medina</div>
      <div className="loading__bar">
        <div className="loading__fill" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
      <div className="loading__hint">Furnishing the apartment… {Math.floor(progress)}%</div>
    </div>
  )
}

const CONTROLS = [
  { keys: ['W', 'A', 'S', 'D'], action: 'Move around' },
  { keys: ['Shift'], action: 'Run' },
  { keys: ['Mouse'], action: 'Look around (1st person)' },
  { keys: ['F'], action: 'Look inside a box 📦' },
  { keys: ['Any key'], action: 'Advance dialogue' },
  { keys: ['↑', '↓', '←', '→'], action: 'Choose in a menu' },
  { keys: ['Enter'], action: 'Select menu option' },
]

// Top-right settings: music / SFX volume + a controls cheatsheet.
function SettingsPanel() {
  const s = useAudio()
  const [open, setOpen] = useState(false)
  const [controls, setControls] = useState(false)

  return (
    <div className="settings">
      <div className="settings__buttons">
        <button
          className={open ? 'iconbtn iconbtn--on' : 'iconbtn'}
          title="Settings"
          onClick={() => setOpen((v) => !v)}
        >
          ⚙️
        </button>
        <button
          className={controls ? 'iconbtn iconbtn--on' : 'iconbtn'}
          title="Controls"
          onClick={() => setControls((v) => !v)}
        >
          🎮
        </button>
      </div>

      {open && (
        <div className="panel">
          <div className="panel__row">
            <button className="panel__toggle" onClick={() => audio.set({ musicOn: !s.musicOn })}>
              {s.musicOn ? '🔊' : '🔇'} Music
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={s.musicVol}
              onChange={(e) => audio.set({ musicVol: parseFloat(e.target.value) })}
            />
          </div>
          <div className="panel__row">
            <button className="panel__toggle" onClick={() => audio.set({ sfxOn: !s.sfxOn })}>
              {s.sfxOn ? '🔊' : '🔇'} Effects
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={s.sfxVol}
              onChange={(e) => audio.set({ sfxVol: parseFloat(e.target.value) })}
            />
          </div>
          <div className="panel__hint">🎵 Lake — Piano cover</div>
        </div>
      )}

      {controls && (
        <div className="panel panel--controls">
          <div className="panel__title">Controls</div>
          {CONTROLS.map((c) => (
            <div className="panel__ctrl" key={c.action}>
              <span className="panel__keys">
                {c.keys.map((k) => (
                  <kbd className="key" key={k}>
                    {k}
                  </kbd>
                ))}
              </span>
              <span className="panel__act">{c.action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('third') // 'third' | 'first'
  const [showMarkers, setShowMarkers] = useState(true) // placement pins (hide later)

  // Start the looping background music on the first user interaction.
  useEffect(() => {
    startMusicOnGesture()
  }, [])

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [4, 2, 6], fov: 50, near: 0.05, far: 1500 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.05
        }}
      >
        <Suspense fallback={null}>
          <Scene mode={mode} showMarkers={showMarkers} />
        </Suspense>
      </Canvas>

      <Loader />

      <div className="hud">
        <div className="brand">
          <div className="brand__name">Irene Medina</div>
          <div className="brand__tag">
            WASD to move{mode === 'first' ? ' · click to look' : ''}
          </div>
        </div>

        <div className="crosshair" style={{ display: mode === 'first' ? 'block' : 'none' }} />
        <PeekHint />
        <DialogueBox />
        <SettingsPanel />

        <div className="controls">
          <button
            className="pill"
            onClick={() => setMode((m) => (m === 'first' ? 'third' : 'first'))}
          >
            {mode === 'first' ? '👀 First person' : '🧍 Third person'}
          </button>
          <button
            className={mode === 'top' ? 'pill pill--accent' : 'pill'}
            onClick={() => setMode((m) => (m === 'top' ? 'third' : 'top'))}
          >
            {mode === 'top' ? '🗺️ Top view: on' : '🗺️ Top view'}
          </button>
          <button className="pill" onClick={() => setShowMarkers((v) => !v)}>
            {showMarkers ? '📍 Markers: on' : '📍 Markers: off'}
          </button>
          {mode === 'first' && (
            <button id="lookbtn" className="pill pill--accent">
              Click to look around
            </button>
          )}
        </div>
      </div>
    </>
  )
}
