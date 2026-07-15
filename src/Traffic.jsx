import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { crosserZ } from './trafficState.js'

// ---- Layout -------------------------------------------------------------
export const RX = 22 // ring-road half-width (x)
export const RZ = 16 // ring-road half-depth (z)
const LANE = 1.9 // lane offset from the centerline
const ROAD_W = 6.5
const STOPZONE = 7 // how far before the crosswalk a car reacts to the light
const GAP = 4.6 // min distance to the car ahead
const CYCLE = 18

// Traffic-light phase, shared (deterministic from the clock).
export function lightPhase(t) {
  const p = ((t % CYCLE) + CYCLE) % CYCLE
  if (p < 9) return { car: 'green', ped: 'wait' }
  if (p < 11) return { car: 'yellow', ped: 'wait' }
  return { car: 'red', ped: p < 17 ? 'walk' : 'wait' } // peds cross while cars are red
}

// Rectangle perimeter path (clockwise). Returns centerline point + heading.
const W = 2 * RX
const H = 2 * RZ
export const PERIMETER = 2 * W + 2 * H
function pathAt(s) {
  s = ((s % PERIMETER) + PERIMETER) % PERIMETER
  if (s < W) return { x: -RX + s, z: RZ, hx: 1, hz: 0 } // front (+X)
  s -= W
  if (s < H) return { x: RX, z: RZ - s, hx: 0, hz: -1 } // right (-Z)
  s -= H
  if (s < W) return { x: RX - s, z: -RZ, hx: -1, hz: 0 } // back (-X)
  s -= H
  return { x: -RX, z: -RZ + s, hx: 0, hz: 1 } // left (+Z)
}

// Car world position for a given progress + direction (with lane offset).
function carPose(s, dir, out) {
  const p = pathAt(s)
  const hx = p.hx * dir
  const hz = p.hz * dir
  // "right" of travel
  const rx = hz
  const rz = -hx
  out.x = p.x + rx * LANE
  out.z = p.z + rz * LANE
  out.hx = hx
  out.hz = hz
  return out
}

function CarMesh({ color }) {
  return (
    <>
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.8, 0.6, 4]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh castShadow position={[0, 0.85, -0.1]}>
        <boxGeometry args={[1.5, 0.55, 2]} />
        <meshStandardMaterial color="#2a2f38" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.12, -0.1]}>
        <boxGeometry args={[1.52, 0.06, 2.02]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {[
        [-0.95, 1.3],
        [0.95, 1.3],
        [-0.95, -1.3],
        [0.95, -1.3],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.3, 12]} />
          <meshStandardMaterial color="#1a1d22" roughness={0.8} />
        </mesh>
      ))}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.35, 2.02]}>
          <boxGeometry args={[0.35, 0.2, 0.05]} />
          <meshStandardMaterial color="#fffbe0" emissive="#fff6c0" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </>
  )
}

function TrafficLight() {
  const red = useRef()
  const yellow = useRef()
  const green = useRef()
  const set = (ref, on, col) => {
    if (ref.current) ref.current.material.emissiveIntensity = on ? 1.4 : 0.02
  }
  useFrame((state) => {
    const c = lightPhase(state.clock.elapsedTime).car
    set(red, c === 'red')
    set(yellow, c === 'yellow')
    set(green, c === 'green')
  })
  return (
    <group position={[3.4, 0, RZ + 1.6]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 3.2, 10]} />
        <meshStandardMaterial color="#3a3f47" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 3.4, 0]}>
        <boxGeometry args={[0.5, 1.4, 0.4]} />
        <meshStandardMaterial color="#23272e" roughness={0.6} />
      </mesh>
      <mesh ref={red} position={[0, 3.85, 0.22]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#e23b2e" emissive="#ff4436" emissiveIntensity={0.02} />
      </mesh>
      <mesh ref={yellow} position={[0, 3.4, 0.22]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#e8b53b" emissive="#ffcf4a" emissiveIntensity={0.02} />
      </mesh>
      <mesh ref={green} position={[0, 2.95, 0.22]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#33c06a" emissive="#3fe27f" emissiveIntensity={0.02} />
      </mesh>
    </group>
  )
}

function Roads() {
  const dashes = useMemo(() => {
    const arr = []
    for (let x = -RX + 2; x <= RX - 2; x += 4) arr.push([x, RZ])
    for (let x = -RX + 2; x <= RX - 2; x += 4) arr.push([x, -RZ])
    return arr
  }, [])
  return (
    <group>
      {/* asphalt ring: 4 edge strips */}
      {[
        [0, RZ, W + ROAD_W, ROAD_W],
        [0, -RZ, W + ROAD_W, ROAD_W],
        [RX, 0, ROAD_W, H],
        [-RX, 0, ROAD_W, H],
      ].map(([x, z, sx, sz], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
          <planeGeometry args={[sx, sz]} />
          <meshStandardMaterial color="#3a3e46" roughness={1} />
        </mesh>
      ))}
      {/* centerline dashes on the front/back roads */}
      {dashes.map(([x, z], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, z]}>
          <planeGeometry args={[1.6, 0.18]} />
          <meshStandardMaterial color="#e8e6da" roughness={1} />
        </mesh>
      ))}
      {/* crosswalk across the front road at x = 0 */}
      {[-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, RZ]}>
          <planeGeometry args={[0.45, ROAD_W - 0.6]} />
          <meshStandardMaterial color="#f2f0e6" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

const NUM_GREEN = 3
const NUM_YELLOW = 2

export default function Traffic() {
  const carsRef = useRef([])
  const cars = useMemo(() => {
    const list = []
    for (let i = 0; i < NUM_GREEN; i++)
      list.push({ s: (PERIMETER / NUM_GREEN) * i, dir: 1, speed: 7, color: '#33c06a' })
    for (let i = 0; i < NUM_YELLOW; i++)
      list.push({ s: (PERIMETER / NUM_YELLOW) * i + 12, dir: -1, speed: 6.5, color: '#f2c531' })
    return list
  }, [])

  const poses = useRef(cars.map(() => ({ x: 0, z: 0, hx: 0, hz: 1 })))

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    if (import.meta.env.DEV) window.__cars = cars

    // Is anyone actually on the crosswalk right now? (near z = RZ, between curbs)
    const pedOnCrosswalk = crosserZ.some((z) => z != null && Math.abs(z - RZ) < 2.3)

    // 1) current world poses
    cars.forEach((c, i) => carPose(c.s, c.dir, poses.current[i]))

    // 2) decide + move — cars roll continuously, but STOP at the crosswalk while
    // a pedestrian is crossing, then resume once it's clear.
    cars.forEach((c, i) => {
      const me = poses.current[i]
      let speed = c.speed

      if (pedOnCrosswalk) {
        const onFront = Math.abs(me.z - RZ) < ROAD_W
        if (onFront) {
          if (c.dir > 0 && me.x > -STOPZONE && me.x < 0.6) speed = 0
          else if (c.dir < 0 && me.x < STOPZONE && me.x > -0.6) speed = 0
        }
      }

      for (let j = 0; speed > 0 && j < cars.length; j++) {
        if (j === i || cars[j].dir !== c.dir) continue
        const o = poses.current[j]
        const tx = o.x - me.x
        const tz = o.z - me.z
        const d = Math.hypot(tx, tz)
        if (d < GAP && (tx * me.hx + tz * me.hz) / (d || 1) > 0.6) {
          speed = c.speed * 0.35 // slow down a touch, keep rolling
          break
        }
      }
      c.s += c.dir * speed * dt

      const p = poses.current[i]
      carPose(c.s, c.dir, p)
      const g = carsRef.current[i]
      if (g) {
        g.position.set(p.x, 0.34, p.z)
        g.rotation.y = Math.atan2(p.hx, p.hz)
      }
    })
  })

  return (
    <group>
      <Roads />
      <TrafficLight />
      {cars.map((c, i) => (
        <group key={i} ref={(el) => (carsRef.current[i] = el)}>
          <CarMesh color={c.color} />
        </group>
      ))}
    </group>
  )
}
