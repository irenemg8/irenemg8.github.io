import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { recolor } from './utils/recolor.js'
import { playerPos } from './playerState.js'
import { boxStore } from './boxStore.js'
import { peekView } from './Boxes.jsx'

const EYE = 0.7
const RADIUS = 0.35
const WALK = 1.2
const RUN = 2.4
const SPAWN = new THREE.Vector3(0, 0, 0)
const PROBE = [0.35, 1.0, 1.55]
const CAM_DIST = 3.2
const CAM_UP = 1.9
const TOP_HEIGHT = 16 // top-down camera height (see the whole floor to place boxes)

export default function PlayerController({ collider, mode }) {
  const camera = useThree((s) => s.camera)
  const group = useRef()
  const pos = useRef(SPAWN.clone())
  const heading = useRef(Math.PI)
  const camYaw = useRef(Math.PI)
  const keys = useRef({ f: false, b: false, l: false, r: false, run: false })

  const ray = useRef(new THREE.Raycaster())
  const fwd = useRef(new THREE.Vector3())
  const right = useRef(new THREE.Vector3())
  const move = useRef(new THREE.Vector3())
  const dir = useRef(new THREE.Vector3())
  const camPos = useRef(new THREE.Vector3())

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
    }
  }, [camera])

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
    if (!peeking) {
      if (k.f) move.current.add(fwd.current)
      if (k.b) move.current.sub(fwd.current)
      if (k.r) move.current.add(right.current)
      if (k.l) move.current.sub(right.current)
    }

    const moving = move.current.lengthSq() > 0
    if (moving) {
      move.current.normalize().multiplyScalar((k.run ? RUN : WALK) * dt)
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
    } else {
      play('Idle')
    }

    // Avatar transform + visibility
    if (group.current) {
      group.current.position.copy(pos.current)
      group.current.rotation.y = heading.current
      group.current.visible = (mode === 'third' || mode === 'top') && !peeking // hide avatar while peeking
    }
    playerPos.copy(pos.current) // share position with the world (box proximity)

    // Camera (dev: __freecam freezes it so we can inspect from outside)
    if (import.meta.env.DEV && window.__freecam) return
    if (peeking) {
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
