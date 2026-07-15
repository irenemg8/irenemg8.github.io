import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { recolor } from './utils/recolor.js'
import { ARTWORKS, DOORS, NPC_SPAWNS, benchSeats } from './data/galleryLayout.js'

const N = 6
const SPEED = 0.8
const NPC_R = 0.42 // wall clearance + separation radius
const PROBE = [0.4, 1.0]
// No red here — red is reserved for the player only.
const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#a855f7']

// Shared positions for cheap NPC↔NPC separation.
const crowd = Array.from({ length: N }, () => new THREE.Vector3())

const V = (a) => new THREE.Vector3(a[0], a[1], a[2])
const SEATS = benchSeats()

function pickTarget() {
  const r = Math.random()
  if (r < 0.62) return { pos: V(ARTWORKS[(Math.random() * ARTWORKS.length) | 0].position), kind: 'view' }
  if (r < 0.82 && SEATS.length) {
    const s = SEATS[(Math.random() * SEATS.length) | 0]
    return { pos: V(s.position), kind: 'sit', face: s.face }
  }
  return { pos: V(DOORS[(Math.random() * DOORS.length) | 0].position), kind: 'leave' }
}

function GalleryNPC({ index, collider }) {
  const { scene, animations } = useGLTF('/models/stickman.glb')
  const group = useRef()
  const color = COLORS[index % COLORS.length]
  const model = useMemo(() => {
    const c = cloneSkeleton(scene)
    recolor(c, color)
    c.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) o.frustumCulled = false
    })
    return c
  }, [scene, color])

  const { actions } = useAnimations(animations, group)
  const cur = useRef('Idle')
  const play = (n) => {
    if (cur.current === n) return
    const nx = actions[n]
    if (!nx) return
    nx.reset().fadeIn(0.25).play()
    actions[cur.current]?.fadeOut(0.25)
    cur.current = n
  }
  useEffect(() => {
    if (actions?.Run) actions.Run.timeScale = 0.8
    actions?.Idle?.reset().play()
  }, [actions])

  const st = useRef(null)
  if (!st.current) {
    const spawn = NPC_SPAWNS[index % NPC_SPAWNS.length].position
    st.current = {
      pos: V(spawn),
      heading: Math.PI,
      mode: 'walk', // walk | view | sit
      target: pickTarget(),
      timer: 0,
      stuck: 0,
    }
  }

  const ray = useRef(new THREE.Raycaster())
  const tmp = useRef(new THREE.Vector3())
  useEffect(() => {
    ray.current.firstHitOnly = true
  }, [])

  const clear = (x, z, dx, dz, dist) => {
    if (!collider) return true
    tmp.current.set(dx, 0, dz).normalize()
    ray.current.far = dist + NPC_R
    ray.current.near = 0
    for (const h of PROBE) {
      ray.current.set(new THREE.Vector3(x, h, z), tmp.current)
      if (ray.current.intersectObject(collider).length) return false
    }
    return true
  }

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const s = st.current
    if (!group.current) return
    crowd[index].copy(s.pos)

    if (s.mode === 'walk') {
      const t = s.target.pos
      let dx = t.x - s.pos.x
      let dz = t.z - s.pos.z
      const dist = Math.hypot(dx, dz)
      // stand back to view a piece; get close for seats/doors
      const arriveDist = s.target.kind === 'view' ? 1.5 : 0.4

      if (dist < arriveDist) {
        // arrived
        if (s.target.kind === 'leave') {
          // reached a door — turn around and pick a new spot (no teleport jump)
          s.target = pickTarget()
        } else if (s.target.kind === 'sit') {
          s.mode = 'sit'
          s.timer = 5 + Math.random() * 6
          s.seatY = s.target.pos.y // seat height comes from the bench data
          if (s.target.face != null) s.heading = s.target.face
        } else {
          s.mode = 'view'
          s.timer = 3 + Math.random() * 4
          s.heading = Math.atan2(dx, dz) // face the piece
        }
      } else {
        dx /= dist
        dz /= dist
        // separation from other NPCs
        for (let j = 0; j < N; j++) {
          if (j === index) continue
          const ox = s.pos.x - crowd[j].x
          const oz = s.pos.z - crowd[j].z
          const d = Math.hypot(ox, oz)
          if (d > 0.001 && d < NPC_R * 2) {
            dx += (ox / d) * 0.8
            dz += (oz / d) * 0.8
          }
        }
        const len = Math.hypot(dx, dz) || 1
        dx /= len
        dz /= len
        const step = SPEED * dt
        let moved = false
        if (clear(s.pos.x, s.pos.z, Math.sign(dx), 0, Math.abs(dx * step))) {
          s.pos.x += dx * step
          moved = true
        }
        if (clear(s.pos.x, s.pos.z, 0, Math.sign(dz), Math.abs(dz * step))) {
          s.pos.z += dz * step
          moved = true
        }
        s.heading = Math.atan2(dx, dz)
        s.stuck = moved ? 0 : s.stuck + dt
        if (s.stuck > 1.5) {
          s.target = pickTarget()
          s.stuck = 0
        }
        play('Run')
      }
    } else {
      // view / sit
      s.timer -= dt
      play('Idle')
      if (s.timer <= 0) {
        s.mode = 'walk'
        s.target = pickTarget()
      }
    }

    const seated = s.mode === 'sit'
    group.current.position.set(s.pos.x, seated ? (s.seatY ?? 0) : 0, s.pos.z)
    group.current.rotation.y = s.heading
  })

  return (
    <group ref={group} scale={0.85}>
      <primitive object={model} />
    </group>
  )
}

export default function GalleryNPCs({ collider }) {
  return (
    <group>
      {Array.from({ length: N }, (_, i) => (
        <GalleryNPC key={i} index={i} collider={collider} />
      ))}
    </group>
  )
}

useGLTF.preload('/models/stickman.glb')
