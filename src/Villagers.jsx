import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { recolor } from './utils/recolor.js'

// Fixed coloured NPCs (no cap) that you can talk to. Each: position + facing +
// colour + a sound + dialogue lines (approach + F).
const VILLAGERS = [
  {
    position: [-1.6, 0, 6], // near the box_set prop at [-2.8, 0, 7]
    rotation: 1.3, // glancing toward the llama's corner
    color: '#3aa34a', // green (no red — that's the player)
    sound: 'audio/npc_llama.mp3',
    lines: [
      'I think there’s a llama over there… or am I dreaming? 🦙',
      'I could swear it just moved!',
    ],
  },
]

// Talkable entries (position + close-up height + sound + lines).
export const VILLAGER_SPEAKERS = VILLAGERS.map((v) => ({
  position: v.position,
  height: 1.45,
  sound: v.sound,
  soundVol: 1.6,
  lines: v.lines,
}))

function Villager({ position, rotation, color }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/stickman.glb')
  const model = useMemo(() => {
    const c = cloneSkeleton(scene)
    recolor(c, color)
    c.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true
        o.frustumCulled = false
      }
    })
    return c
  }, [scene, color])

  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    actions?.Idle?.reset().play()
  }, [actions])

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group ref={group} scale={0.85}>
        <primitive object={model} />
      </group>
    </group>
  )
}

export default function Villagers() {
  return (
    <group>
      {VILLAGERS.map((v, i) => (
        <Villager key={i} {...v} />
      ))}
    </group>
  )
}
