import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { recolor } from './utils/recolor.js'
import { ARTWORKS, DOORS, benchSeats } from './data/galleryLayout.js'
import { playerPos } from './playerState.js'
import { AGENTS, N, isFree } from './npcState.js'
import { chat, chatStore, endChat, CHAT_SCRIPTS } from './npcChat.js'

const SPEED = 0.78
const NPC_R = 0.4 // body radius: how much clearance they keep off walls
const SEP_R = 0.95 // personal space: how close another visitor feels crowded
const AVOID = 1.0 // how far ahead they look for walls
const WHISKERS = [-0.55, 0, 0.55] // feeler angles: left, straight on, right
const TURN_RATE = 5 // how quickly they ease onto a new heading
const PROBE_H = [0.45, 1.05] // ray heights: knees and chest
const CAM_H = [0.95] // height of the eavesdropping camera (see PlayerController)

const SEATS = benchSeats()
const V = (a) => new THREE.Vector3(a[0], a[1], a[2])

// One shared raycaster: useFrame is synchronous, so there's no reason for six.
const _ray = new THREE.Raycaster()
_ray.firstHitOnly = true
const _origin = new THREE.Vector3()
const _dir = new THREE.Vector3()

// Distance to the nearest wall along (dx, dz), or Infinity if it's all clear.
function castDist(collider, x, z, dx, dz, far, heights = PROBE_H) {
  if (!collider) return Infinity
  const l = Math.hypot(dx, dz)
  if (l < 1e-6) return Infinity
  _dir.set(dx / l, 0, dz / l)
  _ray.far = far
  _ray.near = 0
  let best = Infinity
  for (const h of heights) {
    _ray.set(_origin.set(x, h, z), _dir)
    const hits = _ray.intersectObject(collider)
    if (hits.length && hits[0].distance < best) best = hits[0].distance
  }
  return best
}

// Spot reservations. Two visitors heading for the same painting is what made
// them bunch up and shuffle on the spot — so a spot belongs to one of them.
const claims = new Map()
const release = (i) => {
  for (const [k, v] of claims) if (v === i) claims.delete(k)
}
const freeSpots = (list, prefix, i) => {
  const out = []
  for (let k = 0; k < list.length; k++) {
    const owner = claims.get(`${prefix}:${k}`)
    if (owner === undefined || owner === i) out.push(k)
  }
  return out
}

// Is there room to actually stand here? (Used to vet a meeting spot before
// sending two visitors to it — otherwise they shuffle at it forever.)
const SPOT_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const clearSpot = (collider, x, z) =>
  SPOT_DIRS.every(([dx, dz]) => castDist(collider, x, z, dx, dz, NPC_R) >= NPC_R)

function pickTarget(i) {
  release(i)
  const r = Math.random()
  if (r < 0.64) {
    const free = freeSpots(ARTWORKS, 'art', i)
    if (free.length) {
      const k = free[(Math.random() * free.length) | 0]
      claims.set(`art:${k}`, i)
      return { pos: V(ARTWORKS[k].position), kind: 'view' }
    }
  }
  if (r < 0.86 && SEATS.length) {
    const free = freeSpots(SEATS, 'seat', i)
    if (free.length) {
      const k = free[(Math.random() * free.length) | 0]
      claims.set(`seat:${k}`, i)
      return { pos: V(SEATS[k].position), kind: 'sit', face: SEATS[k].face }
    }
  }
  return { pos: V(DOORS[(Math.random() * DOORS.length) | 0].position), kind: 'leave' }
}

function GalleryNPC({ index, collider }) {
  const { scene, animations } = useGLTF('/models/stickman.glb')
  const group = useRef()
  const s = AGENTS[index]
  const model = useMemo(() => {
    const c = cloneSkeleton(scene)
    recolor(c, s.color)
    c.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) o.frustumCulled = false
    })
    return c
  }, [scene, s.color])

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

  const arriveAt = () => {
    if (s.mode === 'meet') {
      s.mode = 'chat' // stand and wait; the other one may still be on their way
      s.speed = 0
      return
    }
    if (s.target.kind === 'leave') {
      s.target = pickTarget(index) // reached a door — turn round, don't teleport
    } else if (s.target.kind === 'sit') {
      s.mode = 'sit'
      s.speed = 0
      s.timer = 6 + Math.random() * 7
      s.seatY = s.target.pos.y // seat height comes from the bench data
      if (s.target.face != null) s.heading = s.target.face
    } else {
      s.mode = 'view'
      s.speed = 0
      s.timer = 4 + Math.random() * 5
      s.heading = Math.atan2(s.target.pos.x - s.pos.x, s.target.pos.z - s.pos.z)
    }
  }

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    if (!group.current) return

    if (s.mode === 'walk' || s.mode === 'meet') {
      if (s.mode === 'walk' && !s.target) s.target = pickTarget(index)
      const t = s.mode === 'meet' ? s.slot : s.target.pos
      // They stop within `arrive` of their spot and always on the near side, so
      // a meeting ends up roughly CHAT_GAP + 2*arrive apart — CHAT_GAP is set
      // low to account for it. Don't tighten this: they can't turn sharply
      // enough to hit a smaller window, and end up circling it forever.
      const arrive = s.mode === 'meet' ? 0.18 : s.target.kind === 'view' ? 1.4 : 0.45
      let dx = t.x - s.pos.x
      let dz = t.z - s.pos.z
      const dist = Math.hypot(dx, dz)

      if (dist < arrive) {
        arriveAt()
      } else {
        dx /= dist
        dz /= dist
        let sx = dx
        let sz = dz

        // Personal space: ease apart before they end up shoving each other. The
        // one exception is whoever you're off to have a chat with — they stand
        // closer than this, so keeping our distance would fight the meeting.
        for (let j = 0; j < N; j++) {
          if (j === index || (s.mode === 'meet' && j === s.partner)) continue
          const ox = s.pos.x - AGENTS[j].pos.x
          const oz = s.pos.z - AGENTS[j].pos.z
          const d = Math.hypot(ox, oz)
          if (d > 0.001 && d < SEP_R) {
            const w = (1 - d / SEP_R) * 1.5
            sx += (ox / d) * w
            sz += (oz / d) * w
          }
        }

        // Walls: three feelers ahead. A hit steers them along the wall (always
        // to their own preferred side, so they don't dither left-right-left).
        //
        // Never look further than where we're headed. Avoidance pushes harder
        // than the pull of the target, so a wall *behind* the target would win
        // and they'd circle their destination forever, never arriving.
        const look = Math.min(AVOID, dist)
        for (const a of WHISKERS) {
          const ca = Math.cos(a)
          const sa = Math.sin(a)
          const wx = dx * ca - dz * sa
          const wz = dx * sa + dz * ca
          const hit = castDist(collider, s.pos.x, s.pos.z, wx, wz, look)
          if (hit >= look) continue
          const w = (1 - hit / look) * 1.8
          sx += -wz * w * s.turn // slide along it…
          sz += wx * w * s.turn
          sx -= wx * w * 0.6 // …and stop walking into it
          sz -= wz * w * 0.6
        }

        const l = Math.hypot(sx, sz) || 1
        sx /= l
        sz /= l
        // Ease onto the new direction so nobody twitches.
        s.dir.x += (sx - s.dir.x) * Math.min(1, dt * TURN_RATE)
        s.dir.z += (sz - s.dir.z) * Math.min(1, dt * TURN_RATE)
        const dl = Math.hypot(s.dir.x, s.dir.z) || 1
        const nx = s.dir.x / dl
        const nz = s.dir.z / dl

        // Ease off over the last stretch of a meeting. At full pelt their turn
        // radius (~0.2) is wider than the spot they're aiming for, so they sail
        // past and circle it forever instead of stopping to talk. Slowing down
        // tightens the turn enough to actually land.
        const slow = s.mode === 'meet' ? Math.max(0.18, Math.min(1, dist / 0.6)) : 1
        const step = Math.min(SPEED * slow * dt, dist)
        const px = s.pos.x
        const pz = s.pos.z
        if (castDist(collider, px, pz, nx, nz, step + NPC_R) > step + NPC_R) {
          s.pos.x += nx * step
          s.pos.z += nz * step
        } else {
          // Blocked head-on: slide along whichever axis is still open.
          const gx = Math.abs(nx * step) + NPC_R
          const gz = Math.abs(nz * step) + NPC_R
          if (castDist(collider, px, pz, nx, 0, gx) > gx) s.pos.x += nx * step
          if (castDist(collider, s.pos.x, pz, 0, nz, gz) > gz) s.pos.z += nz * step
        }

        const moved = Math.hypot(s.pos.x - px, s.pos.z - pz)
        s.speed = moved / dt
        if (moved > 1e-4) s.heading = Math.atan2(nx, nz)

        // Going nowhere? Try swerving the other way, then give up and go
        // somewhere else — rather than jogging on the spot forever.
        if (moved < step * 0.25) {
          s.stuck += dt
          if (s.stuck > 0.7 && !s.flipped) {
            s.turn = -s.turn
            s.flipped = true
          }
          if (s.stuck > 2.2) {
            s.stuck = 0
            s.flipped = false
            if (s.mode === 'meet') {
              s.mode = 'walk' // can't reach them; the director will call it off
              s.partner = -1
              s.target = pickTarget(index)
            } else s.target = pickTarget(index)
          }
        } else {
          s.stuck = 0
          s.flipped = false
        }
      }
    } else if (s.mode === 'view' || s.mode === 'sit') {
      s.speed = 0
      s.timer -= dt
      if (s.timer <= 0) {
        s.mode = 'walk'
        s.target = pickTarget(index)
      }
    } else if (s.mode === 'chat') {
      s.speed = 0
      const o = AGENTS[s.partner] // turn to face whoever we're nattering with
      if (o) {
        const hx = o.pos.x - s.pos.x
        const hz = o.pos.z - s.pos.z
        if (Math.hypot(hx, hz) > 0.01) {
          let d = Math.atan2(hx, hz) - s.heading
          d = Math.atan2(Math.sin(d), Math.cos(d))
          s.heading += d * Math.min(1, dt * 6)
        }
      }
    }

    // Animate off measured speed, not intent — that's what had them sprinting on
    // the spot when they were wedged against something. The bar is deliberately
    // low (they only have to be genuinely moving) and the clip is retimed to
    // match, so someone squeezing along a wall walks slowly instead of freezing
    // into an idle mid-stride.
    const walking =
      (s.mode === 'walk' || s.mode === 'meet') && s.speed > (cur.current === 'Run' ? 0.04 : 0.1)
    play(walking ? 'Run' : 'Idle')
    if (walking && actions.Run) {
      actions.Run.timeScale = 0.8 * Math.max(0.45, Math.min(1, s.speed / SPEED))
    }

    group.current.position.set(s.pos.x, s.mode === 'sit' ? s.seatY : 0, s.pos.z)
    group.current.rotation.y = s.heading
  })

  return (
    <group ref={group} scale={0.85}>
      <primitive object={model} />
    </group>
  )
}

// Every so often, pairs two visitors up: they walk to each other, stand face to
// face and get talking. Press F nearby to eavesdrop (App.jsx draws it).
const MEET_MAX = 5 // furthest apart two of them will bother pairing up from
const MEET_MIN = 0.9
// How far apart they stand while nattering (they're only ~0.9 tall). They stop
// short of their spots, so the gap you actually see is this + ~0.3.
const CHAT_GAP = 0.45
const EAVES_R = 2 // how close you must be to listen in

if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__npc = { AGENTS, chat } // dev: peek at what the visitors are up to
}

function ChatDirector({ collider }) {
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)

    if (chat.phase === 'off') {
      chat.cool -= dt
      if (chat.cool > 0) return
      // The closest free pair who can actually see each other — line of sight
      // means the midpoint between them is somewhere they can both stand.
      let bi = -1
      let bj = -1
      let bd = MEET_MAX
      for (let i = 0; i < N; i++) {
        if (!isFree(AGENTS[i])) continue
        for (let j = i + 1; j < N; j++) {
          if (!isFree(AGENTS[j])) continue
          const dx = AGENTS[j].pos.x - AGENTS[i].pos.x
          const dz = AGENTS[j].pos.z - AGENTS[i].pos.z
          const d = Math.hypot(dx, dz)
          if (d < MEET_MIN || d >= bd) continue
          if (castDist(collider, AGENTS[i].pos.x, AGENTS[i].pos.z, dx, dz, d) < d) continue
          bi = i
          bj = j
          bd = d
        }
      }
      if (bi < 0) {
        chat.cool = 2 // nobody suitable right now; look again shortly
        return
      }
      const a = AGENTS[bi]
      const b = AGENTS[bj]
      const mx = (a.pos.x + b.pos.x) / 2
      const mz = (a.pos.z + b.pos.z) / 2
      let ux = b.pos.x - a.pos.x
      let uz = b.pos.z - a.pos.z
      const l = Math.hypot(ux, uz) || 1
      ux /= l
      uz /= l
      a.slot.set(mx - (ux * CHAT_GAP) / 2, 0, mz - (uz * CHAT_GAP) / 2)
      b.slot.set(mx + (ux * CHAT_GAP) / 2, 0, mz + (uz * CHAT_GAP) / 2)
      if (!clearSpot(collider, a.slot.x, a.slot.z) || !clearSpot(collider, b.slot.x, b.slot.z)) {
        chat.cool = 2 // no room to stand and talk there; try again shortly
        return
      }
      release(bi)
      release(bj)
      a.mode = 'meet'
      a.partner = bj
      a.stuck = 0
      b.mode = 'meet'
      b.partner = bi
      b.stuck = 0
      chat.a = bi
      chat.b = bj
      chat.phase = 'meeting'
      chat.wait = 10
      return
    }

    const a = AGENTS[chat.a]
    const b = AGENTS[chat.b]

    if (chat.phase === 'meeting') {
      chat.wait -= dt
      const lost = (x) => x.mode !== 'meet' && x.mode !== 'chat'
      if (a.mode === 'chat' && b.mode === 'chat') {
        // Measure the elbow room either side of them now, while we've got the
        // collider to hand: openChat picks whichever side the camera fits on.
        const mx = (a.pos.x + b.pos.x) / 2
        const mz = (a.pos.z + b.pos.z) / 2
        let ux = b.pos.x - a.pos.x
        let uz = b.pos.z - a.pos.z
        const l = Math.hypot(ux, uz) || 1
        ux /= l
        uz /= l
        chat.roomPlus = castDist(collider, mx, mz, -uz, ux, 3, CAM_H)
        chat.roomMinus = castDist(collider, mx, mz, uz, -ux, 3, CAM_H)
        chat.lines = CHAT_SCRIPTS[(Math.random() * CHAT_SCRIPTS.length) | 0]
        chat.phase = 'talking'
        chat.timeout = 24
        chatStore.set({ id: chatStore.get().id + 1 }) // fresh conversation for the UI
      } else if (chat.wait <= 0 || lost(a) || lost(b)) {
        endChat(6) // couldn't reach each other — never mind
      }
      return
    }

    // Talking: they hold the conversation until you listen in, or they give up
    // and drift apart. Your F prompt is just proximity to the pair.
    if (chatStore.get().open) return
    const mx = (a.pos.x + b.pos.x) / 2
    const mz = (a.pos.z + b.pos.z) / 2
    chatStore.set({ near: Math.hypot(playerPos.x - mx, playerPos.z - mz) < EAVES_R })
    chat.timeout -= dt
    if (chat.timeout <= 0) endChat()
  })
  return null
}

export default function GalleryNPCs({ collider }) {
  return (
    <group>
      {Array.from({ length: N }, (_, i) => (
        <GalleryNPC key={i} index={i} collider={collider} />
      ))}
      <ChatDirector collider={collider} />
    </group>
  )
}

useGLTF.preload('/models/stickman.glb')
