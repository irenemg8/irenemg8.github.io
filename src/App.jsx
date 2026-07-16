import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'
import Scene from './Scene.jsx'
import { useBoxStore, boxStore } from './boxStore.js'
import { useMetaStore, metaStore } from './metaStore.js'
import { useTalkStore, talkStore } from './talkStore.js'
import { BOXES } from './Boxes.jsx'
import { TALKERS } from './talkers.js'
import { useAudio, audio, playSfx, playClip, preloadClip, startMusicOnGesture } from './audio.js'

// Camera-roll entries. The LEFT lens shows the stylised (Animal-Crossing-ish)
// version; the RIGHT lens shows the matching real photo (falls back to the
// stylised one until the real one is added). `text` is the story dialogue.
const META_PHOTOS = [
  { label: 'Me 👋', styled: 'photos/styled/me.webp', real: null, text: 'That’s me — welcome to my little world!' },
  { label: 'Chocolate bun 🍫', styled: 'photos/styled/pastry.webp', real: null, text: 'A warm chocolate-filled bun — the little joys count.' },
  { label: 'Nilo 🐶', styled: 'photos/styled/nilo.webp', real: null, text: 'Nilo, my pug — the tiny king of the house.' },
  { label: 'Warsaw 🌸', styled: 'photos/styled/warsaw.webp', real: null, text: 'Warsaw at sunset, during my Erasmus.' },
  { label: 'China 🏯', styled: 'photos/styled/china.webp', real: null, text: 'A garden pavilion in China — it left me speechless.' },
  { label: 'Paris 2024 🥐', styled: 'photos/styled/paris.webp', real: null, text: 'Paris during the 2024 Olympics.' },
  { label: 'Fallas 🔥', styled: 'photos/styled/fallas.webp', real: null, text: 'The Fallas of Valencia — art, fire and fiesta.' },
  { label: 'Polish feast 🥟', styled: 'photos/styled/polishfood.webp', real: null, text: 'A proper Polish feast — pierogi everywhere!' },
  { label: 'Ayora 💙', styled: 'photos/styled/ayora.webp', real: null, text: '“Bésame en este rincón” — a corner of Ayora.' },
]
const META_COLS = 2 // photo menu grid columns

// Near the Meta glasses: press F -> yes/no prompt -> VR two-lens view. You pick
// a photo from a menu; its story types out as a dialogue and the shot shows in
// the lenses. With nothing picked, the lenses show a glitchy colour-bar screen.
function MetaVision() {
  const { near, mode } = useMetaStore()
  const [ask, setAsk] = useState(0) // 0 = Yes, 1 = No
  const [view, setView] = useState('menu') // 'menu' | 'text'
  const [pick, setPick] = useState(0) // menu cursor
  const [shown, setShown] = useState(null) // photo index currently displayed
  const [n, setN] = useState(0) // typewriter progress

  const options = [...META_PHOTOS.map((p) => p.label), 'Take the glasses off']
  const caption = shown != null ? META_PHOTOS[shown].text : ''
  const full = n >= caption.length

  const confirm = (yes) => {
    playSfx('select')
    metaStore.set({ mode: yes ? 'on' : 'off' })
  }
  const selectOption = (idx) => {
    playSfx('select')
    if (idx >= META_PHOTOS.length) {
      metaStore.set({ mode: 'off' }) // "Take the glasses off"
      return
    }
    setShown(idx)
    setN(0)
    setView('text')
  }
  const advance = () => {
    playSfx('blip')
    if (!full) setN(caption.length)
    else {
      setView('menu') // done reading -> back to the photo menu
      setShown(null)
    }
  }

  // F opens the prompt when near / takes the glasses off; Esc always exits.
  useEffect(() => {
    const onKey = (e) => {
      const s = metaStore.get()
      if (e.code === 'Escape') {
        if (s.mode !== 'off') metaStore.set({ mode: 'off' })
        return
      }
      if (e.code !== 'KeyF') return
      if (s.mode === 'on') metaStore.set({ mode: 'off' })
      else if (s.mode === 'off' && s.near) metaStore.set({ mode: 'ask' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!near) metaStore.set({ mode: 'off' }) // walking away resets
  }, [near])

  // Reset sub-state each time the prompt / view opens.
  useEffect(() => {
    if (mode === 'ask') setAsk(0)
    if (mode === 'on') {
      setView('menu')
      setPick(0)
      setShown(null)
      setN(0)
    }
  }, [mode])

  // Typewriter for the picked photo's story.
  useEffect(() => {
    if (mode !== 'on' || view !== 'text' || n >= caption.length) return
    const id = setTimeout(() => setN((c) => c + 1), 28)
    return () => clearTimeout(id)
  }, [mode, view, n, caption])

  // Yes/No keyboard.
  useEffect(() => {
    if (mode !== 'ask') return
    const onKey = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault()
        playSfx('move')
        setAsk((v) => (v === 0 ? 1 : 0))
      } else if (['Enter', 'NumpadEnter', 'Space'].includes(e.code)) {
        e.preventDefault()
        confirm(ask === 0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, ask])

  // Photo-menu / story keyboard.
  useEffect(() => {
    if (mode !== 'on') return
    const onKey = (e) => {
      if (e.code === 'KeyF' || e.code === 'Escape') return // F / Esc exit (handled above)
      if (view === 'menu') {
        const len = options.length
        if (e.code === 'ArrowUp') {
          e.preventDefault()
          playSfx('move')
          setPick((v) => (v - META_COLS >= 0 ? v - META_COLS : v))
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          playSfx('move')
          setPick((v) => (v + META_COLS < len ? v + META_COLS : v))
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault()
          playSfx('move')
          setPick((v) => (v > 0 ? v - 1 : v))
        } else if (e.code === 'ArrowRight') {
          e.preventDefault()
          playSfx('move')
          setPick((v) => (v < len - 1 ? v + 1 : v))
        } else if (['Enter', 'NumpadEnter', 'Space'].includes(e.code)) {
          e.preventDefault()
          selectOption(pick)
        }
      } else {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, view, pick, shown, n])

  const base = import.meta.env.BASE_URL

  if (near && mode === 'off') {
    return <div className="meta-hint">Press F to try Irene’s Meta glasses 🥽</div>
  }

  if (mode === 'ask') {
    return (
      <div className="dialogue dialogue--menu">
        <div className="dialogue__prompt">
          You’re about to browse Irene’s camera roll. Want a look?
        </div>
        <ul className="dialogue__options meta-ask">
          {['Yes', 'No'].map((label, idx) => (
            <li
              key={label}
              className={idx === ask ? 'is-active' : ''}
              onMouseEnter={() => setAsk(idx)}
              onClick={() => confirm(idx === 0)}
            >
              <span className="dialogue__cursor">{idx === ask ? '▶' : ' '}</span>
              {label}
            </li>
          ))}
        </ul>
        <div className="dialogue__hint">←︎ →︎ choose · Enter to select</div>
      </div>
    )
  }

  if (mode === 'on') {
    // left lens = stylised version, right lens = real photo (falls back to the
    // stylised one). Nothing picked -> a glitchy colour-bar "broken" screen.
    const lens = (side) => {
      const p = shown != null ? META_PHOTOS[shown] : null
      const img = p ? (side === 'l' ? p.styled : p.real ?? p.styled) : null
      return (
        <div className="meta__lens" key={side}>
          {img ? (
            <img src={base + img} alt="" className="meta__photo is-on" />
          ) : (
            <div className="meta__broken" />
          )}
          <div className="meta__vignette" />
        </div>
      )
    }
    return (
      <div className="meta">
        <div className="meta__scrim" />
        <div className="meta__lenses">
          {lens('l')}
          {lens('r')}
        </div>

        {view === 'menu' ? (
          <div className="dialogue dialogue--menu">
            <div className="dialogue__prompt">What do you want to see?</div>
            <ul className="dialogue__options">
              {options.map((label, idx) => (
                <li
                  key={label}
                  className={idx === pick ? 'is-active' : ''}
                  onMouseEnter={() => setPick(idx)}
                  onClick={() => selectOption(idx)}
                >
                  <span className="dialogue__cursor">{idx === pick ? '▶' : ' '}</span>
                  {label}
                </li>
              ))}
            </ul>
            <div className="dialogue__hint">↑︎↓︎←︎→︎ choose · Enter select · F / Esc to take off</div>
          </div>
        ) : (
          <div className="dialogue" onClick={advance}>
            <div className="dialogue__text">{caption.slice(0, n)}</div>
            <div className="dialogue__hint">Any key to continue · F / Esc to take off</div>
            {full && <div className="dialogue__arrow">▼</div>}
          </div>
        )}
      </div>
    )
  }

  return null
}

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
        <div className="dialogue__hint">↑︎↓︎←︎→︎ choose · Enter to select</div>
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

// Talk to a nearby talker (llama, pug, door guides…): approach + F. Supports a
// plain line dialogue (lines) or an intro + branching menu (like the boxes).
// Takes priority over boxes so the two don't fire together (see Boxes.jsx).
const TALK_EXIT = { label: 'That’s all, thanks', exit: true }

function PropTalk() {
  const { near, open } = useTalkStore()
  const sp = open != null ? TALKERS[open] : null
  const menu = sp?.menu ?? null
  const options = menu ? [...menu.options, TALK_EXIT] : null

  const [view, setView] = useState('text') // 'text' | 'menu'
  const [pages, setPages] = useState([])
  const [page, setPage] = useState(0)
  const [n, setN] = useState(0)
  const [menuIndex, setMenuIndex] = useState(0)
  const [heard, setHeard] = useState(0)
  const [link, setLink] = useState(null) // clickable link for the current block

  const text = view === 'text' ? pages[page] ?? '' : ''
  const full = n >= text.length
  const showLink = link && page === pages.length - 1 && full

  const start = (s) => {
    setHeard(0)
    setMenuIndex(0)
    setPage(0)
    setN(0)
    setLink(null)
    if (s?.intro?.length) {
      setView('text')
      setPages(s.intro)
    } else if (s?.menu) {
      setView('menu')
      setPages([])
    } else {
      setView('text')
      setPages(s?.lines ?? [])
    }
  }

  useEffect(() => {
    if (sp) start(sp)
  }, [open])
  useEffect(() => {
    setN(0)
  }, [pages, page, view])
  useEffect(() => {
    if (view !== 'text' || n >= text.length) return
    const id = setTimeout(() => setN((c) => c + 1), 28)
    return () => clearTimeout(id)
  }, [view, n, text])
  useEffect(() => {
    if (near == null && open != null) talkStore.set({ open: null }) // walked away
  }, [near, open])
  useEffect(() => {
    TALKERS.forEach((s) => preloadClip(s.sound)) // warm each speaker's sound
  }, [])
  useEffect(() => {
    if (open != null) playClip(TALKERS[open].sound, TALKERS[open].soundVol ?? 1) // bark / llama / guide
  }, [open])

  const advanceText = () => {
    playSfx('blip')
    if (!full) setN(text.length)
    else if (page < pages.length - 1) setPage((p) => p + 1)
    else if (menu) {
      setView('menu') // end of a text block -> back to the menu
      setMenuIndex(0)
    } else talkStore.set({ open: null }) // plain dialogue done -> leave
  }
  const selectOption = (idx) => {
    const opt = options?.[idx]
    if (!opt) return
    playSfx('select')
    if (opt.exit) {
      talkStore.set({ open: null })
      return
    }
    setHeard((h) => h + 1)
    setLink(opt.link ?? null)
    setPages(opt.text)
    setPage(0)
    setN(0)
    setView('text')
  }

  // F/Esc open & close the chat.
  useEffect(() => {
    const onKey = (e) => {
      const s = talkStore.get()
      if (e.code === 'KeyF') {
        if (s.open != null) talkStore.set({ open: null })
        else if (s.near != null) talkStore.set({ open: s.near })
      } else if (e.code === 'Escape' && s.open != null) {
        talkStore.set({ open: null })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Drive the dialogue while it's open.
  useEffect(() => {
    if (open == null) return
    const onKey = (e) => {
      if (['KeyF', 'Escape', 'ShiftLeft', 'ShiftRight'].includes(e.code)) return
      if (view === 'menu' && options) {
        const len = options.length
        const COLS = 2
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
  }, [open, view, options, full, text, page, pages])

  if (open == null || !sp) {
    return near != null ? <div className="meta-hint">Press F to chat 💬</div> : null
  }

  if (view === 'menu' && options) {
    return (
      <div className="dialogue dialogue--menu">
        <div className="dialogue__prompt">{heard === 0 ? menu.prompt : menu.again}</div>
        <ul className="dialogue__options">
          {options.map((o, i) => (
            <li
              key={o.label}
              className={i === menuIndex ? 'is-active' : ''}
              onMouseEnter={() => setMenuIndex(i)}
              onClick={() => selectOption(i)}
            >
              <span className="dialogue__cursor">{i === menuIndex ? '▶' : ' '}</span>
              {o.label}
            </li>
          ))}
        </ul>
        <div className="dialogue__hint">↑︎↓︎←︎→︎ choose · Enter select · F / Esc to leave</div>
      </div>
    )
  }

  return (
    <div className="dialogue" onClick={advanceText}>
      <div className="dialogue__text">
        {text.slice(0, n)}
        {showLink && (
          <>
            {' '}
            <a
              className="dialogue__link"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Irene Medina García
            </a>
          </>
        )}
      </div>
      <div className="dialogue__hint">Any key to continue · F / Esc to leave</div>
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
      <div className="loading__title">Irene Medina García</div>
      <div className="loading__bar">
        <div className="loading__fill" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
      <div className="loading__hint">Furnishing the gallery… {Math.floor(progress)}%</div>
    </div>
  )
}

const CONTROLS = [
  { keys: ['W', 'A', 'S', 'D'], action: 'Move around' },
  { keys: ['Shift'], action: 'Run' },
  { keys: ['Mouse'], action: 'Look around (1st person)' },
  { keys: ['F'], action: 'Look inside a box 📦' },
  { keys: ['Any key'], action: 'Advance dialogue' },
  // ︎ forces text (non-emoji) rendering so all four arrows match in style.
  { keys: ['↑︎', '↓︎', '←︎', '→︎'], action: 'Move in a menu' },
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
        <div className="panel panel--controls">
          <div className="panel__title">Sound</div>
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
  const [showMarkers, setShowMarkers] = useState(false) // placement pins (toggle hidden for now)

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
          <div className="brand__name">Irene Medina García</div>
          <div className="brand__tag">
          </div>
        </div>

        <div className="crosshair" style={{ display: mode === 'first' ? 'block' : 'none' }} />
        <PeekHint />
        <DialogueBox />
        <PropTalk />
        <MetaVision />
        <SettingsPanel />

        <div className="controls">
          {/* Hidden for now: First person / Top view / Markers toggles.
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
          */}
        </div>
      </div>
    </>
  )
}
