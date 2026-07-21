import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { hearts } from './hearts.js'

// A little pool of heart sprites that float up and fade — popped by
// hearts.burst() when you pet Nilo. No image asset: the heart is drawn once to
// a canvas texture. Everything is animated by mutating sprite refs in useFrame,
// so there are no React re-renders while hearts are flying.
const POOL = 18

function heartTexture() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#ff5c8a'
  ctx.beginPath()
  const x = s / 2
  const y = s * 0.34
  const w = s * 0.42
  const h = s * 0.38
  ctx.moveTo(x, y + h * 0.9)
  ctx.bezierCurveTo(x + w, y - h * 0.6, x + w * 1.1, y + h * 0.9, x, y + h * 1.7)
  ctx.bezierCurveTo(x - w * 1.1, y + h * 0.9, x - w, y - h * 0.6, x, y + h * 0.9)
  ctx.fill()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function Hearts() {
  const sprites = useRef([])
  const state = useRef(
    Array.from({ length: POOL }, () => ({ life: 0, max: 1, vx: 0, vy: 0, vz: 0, spin: 0, delay: 0 })),
  )
  const cursor = useRef(0)

  const materials = useMemo(() => {
    const tex = heartTexture()
    return Array.from({ length: POOL }, () =>
      new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false }),
    )
  }, [])

  useEffect(() => {
    hearts._spawn = (x, y, z) => {
      const n = 5 + ((Math.random() * 3) | 0) // 5–7 hearts per pet
      for (let k = 0; k < n; k++) {
        const p = state.current[cursor.current % POOL]
        const sp = sprites.current[cursor.current % POOL]
        cursor.current++
        if (!sp) continue
        p.max = 1.6 + Math.random() * 0.8
        p.life = p.max
        p.delay = (k / n) * 0.5 // stagger the burst over ~0.5s
        p.vx = (Math.random() - 0.5) * 0.35
        p.vy = 0.4 + Math.random() * 0.25 // slower, gentler rise
        p.vz = (Math.random() - 0.5) * 0.35
        p.spin = (Math.random() - 0.5) * 1.4
        sp.position.set(x + (Math.random() - 0.5) * 0.15, y, z + (Math.random() - 0.5) * 0.15)
        const s0 = 0.12 + Math.random() * 0.06
        sp.scale.set(s0, s0, s0)
        sp.material.rotation = (Math.random() - 0.5) * 0.6
        sp.material.opacity = 0 // hidden until its delay elapses
      }
    }
    return () => {
      if (hearts._spawn) hearts._spawn = null
    }
  }, [])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    for (let i = 0; i < POOL; i++) {
      const p = state.current[i]
      const sp = sprites.current[i]
      if (!sp || p.life <= 0) {
        if (sp) sp.material.opacity = 0
        continue
      }
      if (p.delay > 0) {
        p.delay -= dt // wait its turn (staggered burst); stay hidden
        sp.material.opacity = 0
        continue
      }
      p.life -= dt
      p.vy -= dt * 0.25 // gentle ease-off as they rise
      sp.position.x += p.vx * dt
      sp.position.y += p.vy * dt
      sp.position.z += p.vz * dt
      sp.material.rotation += p.spin * dt
      const t = Math.max(0, p.life / p.max)
      sp.material.opacity = Math.min(1, t * 1.6) // fade out near the end
      const s = 0.12 + (1 - t) * 0.1 // grow a touch as they fade
      sp.scale.set(s, s, s)
    }
  })

  return (
    <group>
      {materials.map((m, i) => (
        <sprite
          key={i}
          ref={(el) => (sprites.current[i] = el)}
          material={m}
          renderOrder={999}
        />
      ))}
    </group>
  )
}
