import { useEffect, useState } from 'react'

// True on touch devices (a coarse pointer). Reactive, in case a hybrid device
// switches pointer type.
export function useTouch() {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(pointer: coarse)')
    const on = () => setTouch(mq.matches)
    on()
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return touch
}

// Reword a "Press F to …" prompt as "Tap to …" on touch devices.
export function phrase(text, touch) {
  if (!touch || !text) return text
  return text.replace('Press F to', 'Tap to').replace('Press F', 'Tap')
}
