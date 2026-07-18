import { useEffect, useRef, useState } from 'react'
import { touch } from './touchState.js'

// A floating on-screen joystick for touch devices: press anywhere on the empty
// part of the screen and drag to move, like an analog stick. Buttons (the F
// cues, dialogues, settings) sit above this layer, so tapping them still works
// — only touches on empty space drive movement.
const R = 60 // max stick travel in px (also the analog range)

export default function TouchControls() {
  const [coarse, setCoarse] = useState(false)
  const [stick, setStick] = useState(null) // { ox, oy, kx, ky } while dragging
  const originId = useRef(null)
  const origin = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only phones/tablets (a coarse pointer) get the joystick.
    setCoarse(!!window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  }, [])
  useEffect(() => () => {
    touch.x = 0
    touch.y = 0
    touch.active = false
  }, [])

  if (!coarse) return null

  const start = (e) => {
    if (originId.current != null) return
    const t = e.changedTouches[0]
    originId.current = t.identifier
    origin.current = { x: t.clientX, y: t.clientY }
    setStick({ ox: t.clientX, oy: t.clientY, kx: t.clientX, ky: t.clientY })
  }
  const move = (e) => {
    if (originId.current == null) return
    const t = [...e.changedTouches].find((c) => c.identifier === originId.current)
    if (!t) return
    let dx = t.clientX - origin.current.x
    let dy = t.clientY - origin.current.y
    const d = Math.hypot(dx, dy)
    if (d > R) {
      dx = (dx / d) * R
      dy = (dy / d) * R
    }
    touch.x = dx / R
    touch.y = dy / R
    touch.active = true
    setStick({ ox: origin.current.x, oy: origin.current.y, kx: origin.current.x + dx, ky: origin.current.y + dy })
  }
  const end = (e) => {
    const t = [...e.changedTouches].find((c) => c.identifier === originId.current)
    if (!t) return
    originId.current = null
    touch.x = 0
    touch.y = 0
    touch.active = false
    setStick(null)
  }

  return (
    <div
      className="touchzone"
      onTouchStart={start}
      onTouchMove={move}
      onTouchEnd={end}
      onTouchCancel={end}
    >
      {stick && (
        <>
          <div className="joy joy--base" style={{ left: stick.ox, top: stick.oy }} />
          <div className="joy joy--knob" style={{ left: stick.kx, top: stick.ky }} />
        </>
      )}
    </div>
  )
}
