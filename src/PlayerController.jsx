import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { recolor } from './utils/recolor.js'
import { playerPos } from './playerState.js'
import { boxStore } from './boxStore.js'
import { talkStore } from './talkStore.js'
import { metaStore } from './metaStore.js'
import { cvStore } from './cvStore.js'
import { cvView } from './Hologram.jsx'
import { chat, chatStore, chatPair } from './npcChat.js'
import { ui } from './uiState.js'
import { touch } from './touchState.js'
import { peekView } from './Boxes.jsx'
import { TALKERS } from './talkers.js'
import { playFootstep } from './audio.js'

const EYE = 0.7
const RADIUS = 0.35
const WALK = 1.2
const RUN = 2.4
// Where you start on first load, and which way you face. Kept clear of the
// doorways (where the visitors spawn) and looking down the room so the gallery
// reveals on load.
const SPAWN = new THREE.Vector3(0.7, 0, 4)
const SPAWN_HEADING = Math.PI // face -Z, straight across the gallery
const PROBE = [0.35, 1.0, 1.55]
const CAM_DIST = 3.2
const CAM_UP = 1.9
const TOP_HEIGHT = 16 // top-down camera height (see the whole floor to place boxes)
const STEP_DIST = 0.32 // walk: a footstep every this many world units travelled
const STEP_DIST_RUN = 0.6 // run (Shift): stride length while sprinting
// Eavesdropping two-shot. A stickman stands about 0.9 units tall (its head-top
// bone sits at ~0.89), so the camera is roughly at their head height, looking
// slightly down at chest level — that puts both of them above the dialogue box.
const CHAT_CAM_MIN = 1.7
const CHAT_CAM_Y = 0.95
const CHAT_LOOK_Y = 0.6

export default function PlayerController({ collider, mode }) {
  const camera = useThree((s) => s.camera)
  const group = useRef()
  const pos = useRef(SPAWN.clone())
  const heading = useRef(SPAWN_HEADING)
  const camYaw = useRef(SPAWN_HEADING)
  const keys = useRef({ f: false, b: false, l: false, r: false, run: false })

  const ray = useRef(new THREE.Raycaster())
  const fwd = useRef(new THREE.Vector3())
  const right = useRef(new THREE.Vector3())
  const move = useRef(new THREE.Vector3())
  const dir = useRef(new THREE.Vector3())
  const camPos = useRef(new THREE.Vector3())
  const stepAcc = useRef(0) // distance travelled since the last footstep

  const { scene, animations } = useGLTF('/models/stickman.glb')
  const model = useMemo(() => {
    const c = cloneSkeleton(scene)
    // The stickman is authored at real-world size via its skeleton, so it's
    // used at native scale (scaling the mesh transform doesn't affect a skinned
    // render anyway).
    recolor(c, '#e23b2e') // the player is red
    c.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true
        o.frustumCulled = false
      }
    })
    return c
  }, [scene])

  const { actions } = useAnimations(animations, group)
  const currentAnim = useRef('Idle')
  const play = (name) => {
    if (currentAnim.current === name) return
    const next = actions[name]
    if (!next) return
    next.reset().fadeIn(0.2).play()
    actions[currentAnim.current]?.fadeOut(0.2)
    currentAnim.current = name
    if (import.meta.env.DEV) window.__anim = name
  }

  useEffect(() => {
    actions?.Idle?.reset().play()
    currentAnim.current = 'Idle'
  }, [actions])

  // Keyboard
  useEffect(() => {
    const map = { KeyW: 'f', ArrowUp: 'f', KeyS: 'b', ArrowDown: 'b', KeyA: 'l', ArrowLeft: 'l', KeyD: 'r', ArrowRight: 'r' }
    const down = (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.run = true
      else if (map[e.code]) keys.current[map[e.code]] = true
    }
    const up = (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.run = false
      else if (map[e.code]) keys.current[map[e.code]] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    ray.current.firstHitOnly = true
    if (import.meta.env.DEV) {
      window.__cam = camera
      window.__pg = group.current
      window.__tp = (x, z) => pos.current.set(x, 0, z) // dev: jump the player about
      window.__ui = ui // dev: read the real flag instance the loop uses
    }
  }, [camera])

  // Distance to the nearest wall along (dx, dz), or Infinity if it's all clear.
  const gapTo = (x, y, z, dx, dz, far) => {
    if (!collider) return Infinity
    dir.current.set(dx, 0, dz).normalize()
    ray.current.far = far
    ray.current.near = 0
    ray.current.set(new THREE.Vector3(x, y, z), dir.current)
    const hits = ray.current.intersectObject(collider)
    return hits.length ? hits[0].distance : Infinity
  }

  const clear = (x, z, dx, dz, dist) => {
    if (!collider) return true
    dir.current.set(dx, 0, dz).normalize()
    ray.current.far = dist + RADIUS
    ray.current.near = 0
    for (const h of PROBE) {
      ray.current.set(new THREE.Vector3(x, h, z), dir.current)
      if (ray.current.intersectObject(collider).length) return false
    }
    return true
  }

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const k = keys.current
    const peeking = boxStore.get().peek != null
    const talking = talkStore.get().open != null
    const listening = chatStore.get().open // eavesdropping on two visitors
    const reading = cvStore.get().open // nose-deep in the CV hologram
    const frozen = peeking || talking || listening || reading // camera locked, avatar hidden
    // Wearing the glasses: the arrows drive the menu, so stand still — but stay
    // visible, since you can still see the room through the lenses. Same while
    // the welcome dialogue is up.
    const held = frozen || metaStore.get().mode !== 'off' || ui.welcomeOpen // movement paused

    // Basis: in 3rd person the camera orbit yaw drives it; in 1st person the
    // (pointer-lock) camera direction drives it.
    if (mode === 'third') {
      fwd.current.set(Math.sin(camYaw.current), 0, Math.cos(camYaw.current))
      right.current.crossVectors(fwd.current, camera.up).normalize()
    } else if (mode === 'top') {
      // top-down: screen-up = world -Z, screen-right = world +X
      fwd.current.set(0, 0, -1)
      right.current.set(1, 0, 0)
    } else {
      camera.getWorldDirection(fwd.current)
      fwd.current.y = 0
      fwd.current.normalize()
      right.current.crossVectors(fwd.current, camera.up).normalize()
    }

    move.current.set(0, 0, 0)
    if (!held) {
      if (k.f) move.current.add(fwd.current)
      if (k.b) move.current.sub(fwd.current)
      if (k.r) move.current.add(right.current)
      if (k.l) move.current.sub(right.current)
      // On-screen joystick (touch): screen-up = forward, screen-down = back.
      if (touch.active) {
        move.current.addScaledVector(fwd.current, -touch.y)
        move.current.addScaledVector(right.current, touch.x)
      }
    }

    const len = move.current.length()
    const moving = len > 0.001
    if (moving) {
      // Keys are full-speed; the joystick is analog, so a gentle push walks
      // slowly and a full push walks flat out. `len` is the joystick magnitude
      // (already 0..1) when touch drives it, or ≥1 when keys do.
      const analog = touch.active && !(k.f || k.b || k.l || k.r) ? Math.min(1, len) : 1
      move.current.multiplyScalar(((k.run ? RUN : WALK) * analog * dt) / len)
      const p = pos.current
      if (move.current.x !== 0 && clear(p.x, p.z, Math.sign(move.current.x), 0, Math.abs(move.current.x))) p.x += move.current.x
      if (move.current.z !== 0 && clear(p.x, p.z, 0, Math.sign(move.current.z), Math.abs(move.current.z))) p.z += move.current.z

      // Face travel direction (smoothly).
      const target = Math.atan2(move.current.x, move.current.z)
      let d = target - heading.current
      d = Math.atan2(Math.sin(d), Math.cos(d))
      heading.current += d * Math.min(1, dt * 12)
      if (mode === 'third') {
        let cd = heading.current - camYaw.current
        cd = Math.atan2(Math.sin(cd), Math.cos(cd))
        camYaw.current += cd * Math.min(1, dt * 3)
      }
      const desired = k.run ? 'Run' : 'Walk'
      play(actions[desired] ? desired : 'Run') // stickman has no Walk clip

      // Footsteps paced by distance travelled -> faster movement = closer steps.
      // Running uses a longer stride (STEP_DIST_RUN) so you can tune it apart.
      const stride = k.run ? STEP_DIST_RUN : STEP_DIST
      stepAcc.current += (k.run ? RUN : WALK) * dt
      while (stepAcc.current >= stride) {
        playFootstep(k.run)
        stepAcc.current -= stride
      }
    } else {
      play('Idle')
      stepAcc.current = STEP_DIST // so the next move steps immediately
    }

    // Avatar transform + visibility
    if (group.current) {
      group.current.position.copy(pos.current)
      group.current.rotation.y = heading.current
      group.current.visible = (mode === 'third' || mode === 'top') && !frozen // hide avatar while peeking/talking
    }
    playerPos.copy(pos.current) // share position with the world (box proximity)

    // Camera (dev: __freecam freezes it so we can inspect from outside)
    if (import.meta.env.DEV && window.__freecam) return
    const pair = listening ? chatPair() : null
    if (pair) {
      // Two-shot: sit square-on to the pair so one reads on the left of frame
      // and the other on the right (chat.side picks the player's side, and
      // chat.left records who ended up where, for the name tag).
      const A = pair.a.pos
      const B = pair.b.pos
      const mx = (A.x + B.x) / 2
      const mz = (A.z + B.z) / 2
      let ux = B.x - A.x
      let uz = B.z - A.z
      const gap = Math.hypot(ux, uz) || 1
      ux /= gap
      uz /= gap
      // chat.side stays put (it's what decided who's on the left), so if the
      // pair are nattering against a wall we pull the camera in rather than
      // swing it round and swap them over.
      const nx = -uz * chat.side
      const nz = ux * chat.side
      const want = Math.max(CHAT_CAM_MIN, 1.2 + gap * 0.6)
      const room = gapTo(mx, CHAT_CAM_Y, mz, nx, nz, want + 0.4)
      const back = Math.max(0.9, Math.min(want, room - 0.3))
      camPos.current.set(mx + nx * back, CHAT_CAM_Y, mz + nz * back)
      camera.position.lerp(camPos.current, Math.min(1, dt * 5))
      camera.lookAt(mx, CHAT_LOOK_Y, mz)
    } else if (talking) {
      // close-up on the prop we're talking to (framed from the player's side)
      const sp = TALKERS[talkStore.get().open]
      const p = sp.position
      const h = sp.height
      let dx = pos.current.x - p[0]
      let dz = pos.current.z - p[2]
      const len = Math.hypot(dx, dz) || 1
      let vx = dx / len
      let vz = dz / len
      // A one-sided note only reads from the front, so it pins the camera to a
      // FIXED side (camAngle) rather than following the player round — otherwise
      // you'd approach from behind and stare at a blank back.
      if (sp.camAngle != null) {
        vx = Math.sin(sp.camAngle)
        vz = Math.cos(sp.camAngle)
      }
      // A speaker can override the framing for a tighter shot — a tiny note
      // wants the camera right up close, level with it, not a metre back.
      //
      // `fitH` goes further: a flat thing pinned to a wall wants to FILL the
      // frame rather than sit in the middle of it, so the distance is worked
      // out from the fov to make it that fraction of the viewport height, and
      // the aim lifted so the sheet clears the dialogue box. It's recomputed
      // every frame, so resizing the prop — or turning a phone — just works.
      let dist, camY, aimY
      if (sp.fitH) {
        const frame = h / sp.fitH
        const half = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
        // Fit the height, but back off further if the width would spill — a
        // portrait sheet on a portrait phone is limited by its sides, not its
        // top and bottom.
        const wide = (h * (sp.aspect ?? 1)) / sp.fitH / (half * (camera.aspect || 1))
        dist = Math.max(frame / half, wide)
        aimY = p[1] + h / 2 - frame * 0.1
        camY = aimY
      } else {
        dist = sp.camDist ?? 0.8 + h * 0.9
        camY = p[1] + (sp.camY ?? h * 0.75 + 0.25)
        aimY = p[1] + (sp.aimY ?? h * 0.55)
      }
      camPos.current.set(p[0] + vx * dist, camY, p[2] + vz * dist)
      camera.position.lerp(camPos.current, Math.min(1, dt * 5))
      camera.lookAt(p[0], aimY, p[2])
    } else if (reading) {
      // square-on to the hologram, backed off just far enough that the whole
      // page fits the viewport (recomputed each frame, so rotating a phone works)
      const v = cvView(camera)
      camPos.current.set(v.pos[0], v.pos[1], v.pos[2])
      camera.position.lerp(camPos.current, Math.min(1, dt * 5))
      camera.lookAt(v.target[0], v.target[1], v.target[2])
    } else if (peeking) {
      // look inside the diorama box
      const v = peekView(boxStore.get().peek)
      camPos.current.set(v.pos[0], v.pos[1], v.pos[2])
      camera.position.lerp(camPos.current, Math.min(1, dt * 5))
      camera.lookAt(v.target[0], v.target[1], v.target[2])
    } else if (mode === 'third') {
      fwd.current.set(Math.sin(camYaw.current), 0, Math.cos(camYaw.current))
      camPos.current.copy(pos.current).addScaledVector(fwd.current, -CAM_DIST)
      camPos.current.y = pos.current.y + CAM_UP
      camera.position.lerp(camPos.current, Math.min(1, dt * 8))
      camera.lookAt(pos.current.x, pos.current.y + 1.4, pos.current.z)
    } else if (mode === 'top') {
      // straight-down overview (tiny z nudge keeps lookAt stable with up=+Y)
      camPos.current.set(pos.current.x, pos.current.y + TOP_HEIGHT, pos.current.z + 0.01)
      camera.position.lerp(camPos.current, Math.min(1, dt * 6))
      camera.lookAt(pos.current.x, pos.current.y, pos.current.z)
    } else {
      camera.position.set(pos.current.x, EYE, pos.current.z)
    }
  })

  return (
    <group ref={group} scale={0.85}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload('/models/stickman.glb')
