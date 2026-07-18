import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'
import Scene from './Scene.jsx'
import { useBoxStore, boxStore } from './boxStore.js'
import { useMetaStore, metaStore } from './metaStore.js'
import { useTalkStore, talkStore } from './talkStore.js'
import { useChatStore, chatStore, chat, openChat, closeChat, endChat } from './npcChat.js'
import { AGENTS } from './npcState.js'
import { BOXES } from './Boxes.jsx'
import { TALKERS } from './talkers.js'
import { META_SECTIONS } from './metaContent.js'
import { useAudio, audio, playSfx, playClip, preloadClip, startMusicOnGesture, unlockAudio } from './audio.js'
import { ui } from './uiState.js'

const META_COLS = 2 // menu grid columns

// Near the Meta glasses: press F -> yes/no prompt -> VR two-lens view. You pick
// a photo from a menu; its story types out as a dialogue and the shot shows in
// the lenses. With nothing picked, the lenses show a glitchy colour-bar screen.
function MetaVision() {
  const { near, mode } = useMetaStore()
  const [ask, setAsk] = useState(0) // 0 = Yes, 1 = No
  const [section, setSection] = useState(null) // META_SECTIONS index, or null (root)
  const [item, setItem] = useState(null) // section item index, or null (section menu)
  const [page, setPage] = useState(0)
  const [n, setN] = useState(0) // typewriter progress
  const [cursor, setCursor] = useState(0) // menu cursor

  const sec = section != null ? META_SECTIONS[section] : null
  const inView = sec != null && item != null
  const it = inView ? sec.items[item] : null
  const pages = it?.text ?? []
  const text = inView ? pages[page] ?? '' : ''
  const full = n >= text.length

  // options for the current menu level (root sections, or a section's items)
  let menuOptions = null
  let menuPrompt = ''
  if (mode === 'on' && !inView) {
    if (sec == null) {
      menuOptions = [...META_SECTIONS.map((s) => s.label), 'Take the glasses off']
      menuPrompt = 'What do you want to see?'
    } else {
      menuOptions = [...sec.items.map((i) => i.label), '← Back']
      menuPrompt = sec.prompt
    }
  }

  const confirm = (yes) => {
    playSfx('select')
    metaStore.set({ mode: yes ? 'on' : 'off' })
  }
  const selectMenu = (idx) => {
    playSfx('select')
    if (sec == null) {
      if (idx >= META_SECTIONS.length) return metaStore.set({ mode: 'off' }) // exit
      setSection(idx)
      setItem(null)
      setCursor(0)
    } else {
      if (idx >= sec.items.length) {
        setSection(null) // "← Back"
        setItem(null)
        setCursor(0)
        return
      }
      setItem(idx)
      setPage(0)
      setN(0)
    }
  }
  const advanceView = () => {
    playSfx('blip')
    if (!full) setN(text.length)
    else if (page < pages.length - 1) {
      setPage((p) => p + 1)
      setN(0)
    } else {
      setItem(null) // done reading -> back to the section menu
      setCursor(0)
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

  // Reset to the root hub each time the prompt / view opens.
  useEffect(() => {
    if (mode === 'ask') setAsk(0)
    if (mode === 'on') {
      setSection(null)
      setItem(null)
      setCursor(0)
      setPage(0)
      setN(0)
    }
  }, [mode])

  // Typewriter for the current item's text.
  useEffect(() => {
    if (mode !== 'on' || !inView || n >= text.length) return
    const id = setTimeout(() => setN((c) => c + 1), 28)
    return () => clearTimeout(id)
  }, [mode, inView, n, text])

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

  // Menu / view keyboard.
  useEffect(() => {
    if (mode !== 'on') return
    const onKey = (e) => {
      if (e.code === 'KeyF' || e.code === 'Escape') return // F / Esc exit (handled above)
      if (!inView && menuOptions) {
        const len = menuOptions.length
        if (e.code === 'ArrowUp') {
          e.preventDefault()
          playSfx('move')
          setCursor((v) => (v - META_COLS >= 0 ? v - META_COLS : v))
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          playSfx('move')
          setCursor((v) => (v + META_COLS < len ? v + META_COLS : v))
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault()
          playSfx('move')
          setCursor((v) => (v > 0 ? v - 1 : v))
        } else if (e.code === 'ArrowRight') {
          e.preventDefault()
          playSfx('move')
          setCursor((v) => (v < len - 1 ? v + 1 : v))
        } else if (['Enter', 'NumpadEnter', 'Space'].includes(e.code)) {
          e.preventDefault()
          setCursor((v) => {
            selectMenu(v)
            return v
          })
        }
      } else {
        e.preventDefault()
        advanceView()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, inView, menuOptions, cursor, section, item, n, text, page, pages])

  const base = import.meta.env.BASE_URL

  if (near && mode === 'off') {
    return (
      <button className="cue" onClick={() => metaStore.set({ mode: 'ask' })}>
        Press F to try Irene’s Meta glasses 🥽
      </button>
    )
  }

  if (mode === 'ask') {
    return (
      <div className="dialogue dialogue--menu">
        <div className="dialogue__prompt">
          Ready to peek into Irene’s world?
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
    // photos use left/right (stylised/real); projects & press use one image in
    // both lenses. In a menu (nothing picked) -> glitchy colour-bar screen.
    const imgFor = (side) => {
      if (!it) return null
      if (it.left || it.right) return side === 'l' ? it.left ?? it.right : it.right ?? it.left
      return it.image
    }
    const lens = (side) => {
      const img = imgFor(side)
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

        {!inView ? (
          <div className="dialogue dialogue--menu">
            <div className="dialogue__prompt">{menuPrompt}</div>
            <ul className="dialogue__options">
              {menuOptions.map((label, idx) => (
                <li
                  key={label}
                  className={idx === cursor ? 'is-active' : ''}
                  onMouseEnter={() => setCursor(idx)}
                  onClick={() => selectMenu(idx)}
                >
                  <span className="dialogue__cursor">{idx === cursor ? '▶' : ' '}</span>
                  {label}
                </li>
              ))}
            </ul>
            <div className="dialogue__hint">↑︎↓︎←︎→︎ choose · Enter select · F / Esc to take off</div>
          </div>
        ) : (
          <div className="dialogue" onClick={advanceView}>
            <div className="dialogue__text">
              {text.slice(0, n)}
              {full && page === pages.length - 1 && it.links && (
                <span className="meta__links">
                  {it.links.map((l) => (
                    <a
                      key={l.url}
                      className="dialogue__link"
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {l.label}
                    </a>
                  ))}
                </span>
              )}
            </div>
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

  // A page wrapped in _underscores_ renders in italics (e.g. Nilo's quoted
  // words of wisdom). Strip the markers; type out the plain text.
  const rawPage = view === 'text' ? pages[page] ?? '' : ''
  const italic = rawPage.length > 2 && rawPage.startsWith('_') && rawPage.endsWith('_')
  const text = italic ? rawPage.slice(1, -1) : rawPage
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
    // A speaker can word its own prompt (the guitar plays, Nilo's notes intrigue).
    return near != null ? (
      <button className="cue" onClick={() => talkStore.set({ open: talkStore.get().near })}>
        {TALKERS[near].cue ?? 'Press F to chat 💬'}
      </button>
    ) : null
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
      <div className={`dialogue__text${italic ? ' dialogue__text--italic' : ''}`}>
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

// Two visitors having a natter. You can't join in — you sidle up, press F and
// eavesdrop line by line. Once they've said their piece the chat is over and
// they wander off, so this only ever shows while a pair are actually talking.
const CHAT_SOUND = 'audio/npc_random.mp3'

function NpcChat() {
  const { near, open, id } = useChatStore()
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)

  const lines = open ? chat.lines : []
  const text = lines[i] ?? ''
  const full = n >= text.length
  // Scripts strictly alternate, so even lines are the first speaker (agent `a`).
  const first = i % 2 === 0
  const who = AGENTS[first ? chat.a : chat.b]
  // chat.left is 0 when agent `a` is the one on screen-left, so the name tag
  // lands on the same side as the visitor you can see saying it.
  const onLeft = first === (chat.left === 0)

  useEffect(() => {
    setI(0)
    setN(0)
  }, [open, id])
  useEffect(() => {
    setN(0)
  }, [i])
  useEffect(() => {
    if (!open || n >= text.length) return
    const t = setTimeout(() => setN((c) => c + 1), 28)
    return () => clearTimeout(t)
  }, [open, n, text])
  useEffect(() => {
    preloadClip(CHAT_SOUND)
  }, [])
  useEffect(() => {
    if (open) playClip(CHAT_SOUND, 1.4) // the murmur of a conversation
  }, [open, id])

  const advance = () => {
    playSfx('blip')
    if (!full) setN(text.length)
    else if (i < lines.length - 1) setI((v) => v + 1)
    else endChat() // that's the lot — off they go, each their own way
  }

  // F listens in; F / Esc slips away and leaves them to it.
  useEffect(() => {
    const onKey = (e) => {
      const s = chatStore.get()
      if (e.code === 'KeyF') {
        if (s.open) closeChat()
        else if (s.near) openChat()
      } else if (e.code === 'Escape' && s.open) closeChat()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (['KeyF', 'Escape', 'ShiftLeft', 'ShiftRight'].includes(e.code)) return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, i, n, full, text, lines])

  if (!open) {
    return near ? (
      <button className="cue" onClick={openChat}>
        Press F to listen in 👂
      </button>
    ) : null
  }
  if (!who) return null

  return (
    <div className="dialogue dialogue--chat" onClick={advance}>
      <div className={`dialogue__who${onLeft ? '' : ' dialogue__who--right'}`}>
        <span className="dialogue__dot" style={{ background: who.color }} />
        {who.name}
      </div>
      <div className="dialogue__text">{text.slice(0, n)}</div>
      <div className="dialogue__hint">Any key to continue · F / Esc to slip away</div>
      {full && <div className="dialogue__arrow">▼</div>}
    </div>
  )
}

// A one-time welcome, shown as a Pokémon-style dialogue once the room has
// actually drawn (ready). Types out, advances on any key / click, and frees you
// to roam when it ends. Movement is held until then (ui.welcomeOpen).
const WELCOME_PAGES = [
  'Welcome to Irene’s little world — a gallery you can explore at your own pace. 🌸',
  'Wander wherever you like with the W A S D keys or the arrows, and hold Shift to run.',
  'Press F to peek inside boxes, read notes, chat with the locals and try the Meta glasses. Enjoy the visit! 🐾',
]

function Welcome({ ready }) {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [n, setN] = useState(0)
  const text = WELCOME_PAGES[page] ?? ''
  const full = n >= text.length

  // Gate movement imperatively (not via an effect) so there's no cleanup-order
  // race over the shared flag — set it the instant open flips.
  const show = (v) => {
    ui.welcomeOpen = v
    setOpen(v)
  }
  useEffect(() => {
    if (ready) {
      show(true)
      setPage(0)
      setN(0)
    }
  }, [ready])
  useEffect(() => () => { ui.welcomeOpen = false }, []) // belt-and-braces on unmount
  useEffect(() => {
    WELCOME_PAGES.forEach((_, i) => preloadClip(`audio/intro${i + 1}.mp3`)) // warm them
  }, [])
  useEffect(() => {
    setN(0)
    if (open) playClip(`audio/intro${page + 1}.mp3`) // one voice line per message
  }, [open, page])
  useEffect(() => {
    if (!open || n >= text.length) return
    const t = setTimeout(() => setN((c) => c + 1), 28)
    return () => clearTimeout(t)
  }, [open, n, text])

  const advance = () => {
    playSfx('blip')
    if (!full) setN(text.length)
    else if (page < WELCOME_PAGES.length - 1) setPage((p) => p + 1)
    else show(false) // last page done -> off you go
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      // let modifier-only presses through, so Shift/Ctrl don't skip a page
      if (['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight'].includes(e.code)) return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, page, n, text, full])

  if (!open) return null
  return (
    <div className="dialogue" onClick={advance}>
      <div className="dialogue__text">{text.slice(0, n)}</div>
      <div className="dialogue__hint">Any key to continue</div>
      {full && <div className="dialogue__arrow">▼</div>}
    </div>
  )
}

function PeekHint() {
  const { near, peek } = useBoxStore()
  // while peeking the dialogue box takes over; only cue when we're near one.
  if (peek != null || near == null) return null
  return (
    <button className="cue" onClick={() => boxStore.set({ peek: boxStore.get().near })}>
      Press F to look inside 📦
    </button>
  )
}

// Shows the progress bar until the room reports it's actually drawn a frame
// (`ready`) — `progress` only tracks downloads, and there's a long quiet stretch
// after those finish while the collider is built, so hiding on progress alone
// shows a black screen. Once ready, it waits on an "Enter" gesture: that first
// click/key is what unlocks audio, so the welcome's voice starts on cue.
function Loader({ ready, onEnter }) {
  const { progress } = useProgress()
  const peak = useRef(0)
  // Progress is re-reported as each new batch of assets queues up, so it can
  // jump backwards. Never let the bar retreat — it just looks broken.
  peak.current = Math.max(peak.current, Math.min(100, progress))
  const pct = peak.current

  useEffect(() => {
    if (!ready) return
    const enter = () => onEnter()
    window.addEventListener('keydown', enter)
    window.addEventListener('pointerdown', enter)
    return () => {
      window.removeEventListener('keydown', enter)
      window.removeEventListener('pointerdown', enter)
    }
  }, [ready, onEnter])

  const base = import.meta.env.BASE_URL
  return (
    <div
      className={`loading${ready ? ' loading--ready' : ''}`}
      style={{ backgroundImage: `url(${base}ui/fondo.webp)` }}
      onClick={ready ? onEnter : undefined}
    >
      <div className="loading__title">Irene Medina García</div>
      {ready ? (
        <>
          <img
            className="loading__start"
            src={`${base}ui/start.webp`}
            alt="Start"
            onClick={onEnter}
          />
          <div className="loading__hint">Click, or press any key</div>
        </>
      ) : (
        <>
          <div className="loading__bar">
            <div className="loading__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="loading__hint">
            {pct >= 100 ? 'Almost there — arranging the furniture…' : `Furnishing the gallery… ${Math.floor(pct)}%`}
          </div>
        </>
      )}
    </div>
  )
}

const CONTROLS = [
  { keys: ['W', 'A', 'S', 'D'], action: 'Move around' },
  { keys: ['Shift'], action: 'Run' },
 // { keys: ['Mouse'], action: 'Look around (1st person)' },
  { keys: ['F'], action: 'Look inside a box 📦' },
  { keys: ['F'], action: 'Eavesdrop on a chat 👂' },
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
  const [ready, setReady] = useState(false) // the room has drawn its first frame
  const [entered, setEntered] = useState(false) // clicked "Enter" (unlocks audio)

  // Start the looping background music on the first user interaction, and warm
  // the sounds that fire early (welcome voice lines) so they're decoded and
  // ready by the time the room finishes loading.
  useEffect(() => {
    startMusicOnGesture()
    WELCOME_PAGES.forEach((_, i) => preloadClip(`audio/intro${i + 1}.mp3`))
  }, [])

  // The "Enter" gesture unlocks audio, then the welcome (and its voice) begins.
  const enter = () => {
    unlockAudio()
    setEntered(true)
  }

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
          <Scene mode={mode} showMarkers={showMarkers} onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>

      {!entered && <Loader ready={ready} onEnter={enter} />}
      <Welcome ready={entered} />

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
        <NpcChat />
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
