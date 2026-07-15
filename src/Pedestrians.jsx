import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { recolor } from './utils/recolor.js'
import { RX, RZ, lightPhase } from './Traffic.jsx'
import { crosserZ } from './trafficState.js'

const SW = 2.7 // sidewalk offset outside the ring road
const WALK = 1.5 // sidewalk speed
const CROSS = 1.7 // crossing speed

// Rectangle perimeter path of half-extents (ex, ez).
function rectAt(s, ex, ez) {
  const W = 2 * ex
  const H = 2 * ez
  const P = 2 * W + 2 * H
  s = ((s % P) + P) % P
  if (s < W) return { x: -ex + s, z: ez, hx: 1, hz: 0 }
  s -= W
  if (s < H) return { x: ex, z: ez - s, hx: 0, hz: -1 }
  s -= H
  if (s < W) return { x: ex - s, z: -ez, hx: -1, hz: 0 }
  s -= H
  return { x: -ex, z: -ez + s, hx: 0, hz: 1 }
}

function Ped({ color, kind, offset = 0, crossIndex = -1 }) {
  const { scene, animations } = useGLTF('/models/stickman.glb')
  const group = useRef()
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
    nx.reset().fadeIn(0.2).play()
    actions[cur.current]?.fadeOut(0.2)
    cur.current = n
  }
  useEffect(() => {
    if (actions?.Run) actions.Run.timeScale = 0.8 // Run clip read as a brisk walk
    actions?.Idle?.reset().play()
  }, [actions])

  // crossing state
  const z = useRef(RZ + SW)
  const dirZ = useRef(-1)

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    if (!group.current) return

    if (kind === 'sidewalk') {
      const s = offset + state.clock.elapsedTime * WALK
      const p = rectAt(s, RX + SW, RZ + SW)
      group.current.position.set(p.x, 0, p.z)
      group.current.rotation.y = Math.atan2(p.hx, p.hz)
      play('Run')
    } else {
      const ped = lightPhase(state.clock.elapsedTime).ped
      const atOuter = z.current >= RZ + SW - 0.05
      const atInner = z.current <= RZ - SW + 0.05
      const atCurb = atOuter || atInner
      // Wait at the curb until the walk signal; once in the road, finish crossing.
      const moving = atCurb ? ped === 'walk' : true
      if (moving) {
        z.current += dirZ.current * CROSS * dt
        if (z.current <= RZ - SW) {
          z.current = RZ - SW
          dirZ.current = 1
        } else if (z.current >= RZ + SW) {
          z.current = RZ + SW
          dirZ.current = -1
        }
      }
      group.current.position.set(offset, 0, z.current)
      group.current.rotation.y = dirZ.current > 0 ? 0 : Math.PI
      play(moving ? 'Run' : 'Idle')
      if (crossIndex >= 0) crosserZ[crossIndex] = z.current
    }
  })

  return (
    <group ref={group} scale={1.45}>
      <primitive object={model} />
    </group>
  )
}

export default function Pedestrians() {
  return (
    <group>
      {/* ~7 sidewalk strollers spread around the block (these never enter) */}
      <Ped kind="sidewalk" color="#f2c531" offset={0} />
      <Ped kind="sidewalk" color="#33c06a" offset={16} />
      <Ped kind="sidewalk" color="#f2c531" offset={34} />
      <Ped kind="sidewalk" color="#33c06a" offset={52} />
      <Ped kind="sidewalk" color="#f2c531" offset={70} />
      <Ped kind="sidewalk" color="#33c06a" offset={90} />
      <Ped kind="sidewalk" color="#f2c531" offset={110} />
      {/* 3 crossers at the crosswalk */}
      <Ped kind="cross" color="#33c06a" offset={-1.2} crossIndex={0} />
      <Ped kind="cross" color="#f2c531" offset={0} crossIndex={1} />
      <Ped kind="cross" color="#33c06a" offset={1.2} crossIndex={2} />
    </group>
  )
}

useGLTF.preload('/models/stickman.glb')
