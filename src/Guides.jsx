import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { recolor } from './utils/recolor.js'

// Two fixed yellow guides — one by each door — wearing the same cap. They greet
// you and answer a few questions (approach + F). Both share the same dialogue.
const YELLOW = '#f4c518'
const CAP_H = 0.2 // cap height in local units (before the 0.85 group scale)
const HEAD_UP = 0.38 // raise the cap above the head bone (bigger = higher)
const HEAD_FWD = 0.05 // push the cap forward so the visor sticks out (± to flip)
// Tie: worn on the chest, hanging down the front. It's parented to the chest
// bone so it rides the body animation just like the cap rides the head.
const TIE_H = 0.26 // tie length in local units (± to resize)
const TIE_UP = -0.02 // raise/lower on the chest (± to nudge up/down)
const TIE_FWD = 0.11 // push forward so it sits on the front of the body

// Door positions live in galleryLayout.js: [3.5,0,4.7] and [-3.5,0,-4.6].
const GUIDES = [
  { position: [3.2, 0, 5.3], rotation: -2.5 }, // by the +X door, facing the room
  { position: [-3.2, 0, -5.3], rotation: 0.6 }, // by the -X door, facing the room
]

const GUIDE_INTRO = [
  'Welcome to Irene’s world! 🎩',
  'She’s still unpacking her boxes, so I’m just keeping an eye out that nothing goes wild. 😅',
]
const GUIDE_MENU = {
  prompt: 'What can I help you with?',
  again: 'Anything else?',
  options: [
    {
      label: 'What is this?',
      text: [
        'This is Irene’s 3D portfolio — a cozy little gallery you can wander around.',
        'Peek into the boxes with F, chat with the pug and the llama, and try the Meta glasses for her photos!',
      ],
    },
    {
      label: 'Contact Irene',
      link: 'https://www.linkedin.com/in/irene-medina-garcia/',
      text: [
        'The best way to reach Irene is on LinkedIn — she’d love to hear from you!',
        'Her profile is right here:',
      ],
    },
    {
      label: 'Tips to explore',
      text: [
        'WASD or the arrows to walk, Shift to run.',
        'Get close to a box, the glasses or a character and press F. Enjoy the visit!',
      ],
    },
  ],
}

// Talkable entries for these guides (position + close-up height + sound + menu).
export const GUIDE_SPEAKERS = GUIDES.map((g) => ({
  position: g.position,
  height: 1.45,
  sound: 'audio/npc_guia.mp3',
  soundVol: 2.2, // louder greeting than the default
  intro: GUIDE_INTRO,
  menu: GUIDE_MENU,
}))

function Guide({ position, rotation }) {
  const group = useRef() // the animated (scaled) character group
  const { scene, animations } = useGLTF('/models/stickman.glb')
  const { scene: capScene } = useGLTF('/models/gorra.glb')
  const { scene: tieScene } = useGLTF('/models/black_tie.glb')

  // Clone + recolour the character, and find its head + chest bones.
  const { model, headBone, chestBone } = useMemo(() => {
    const c = cloneSkeleton(scene)
    recolor(c, YELLOW)
    c.updateMatrixWorld(true)
    const bones = []
    c.traverse((o) => {
      if (o.isBone) bones.push(o)
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true
        o.frustumCulled = false
      }
    })
    const tmp = new THREE.Vector3()
    let head = bones.find((b) => /head/i.test(b.name))
    if (!head && bones.length) {
      head = bones.reduce((best, b) =>
        b.getWorldPosition(tmp).y > best.getWorldPosition(new THREE.Vector3()).y ? b : best,
      )
    }
    // Chest for the tie: prefer an upper-spine / chest bone, else the neck's
    // parent, else the bone just below the head.
    let chest =
      bones.find((b) => /spine2|upperchest|chest/i.test(b.name)) ||
      bones.find((b) => /spine1/i.test(b.name)) ||
      bones.find((b) => /spine/i.test(b.name))
    if (!chest && head?.parent?.isBone) chest = head.parent
    return { model: c, headBone: head, chestBone: chest }
  }, [scene])

  // Scale + centre the cap so its middle sits at the cap-group origin.
  const cap = useMemo(() => {
    const c = capScene.clone(true)
    c.traverse((o) => {
      if (o.isMesh) o.castShadow = true
    })
    const bb = new THREE.Box3().setFromObject(c)
    const size = bb.getSize(new THREE.Vector3())
    const ctr = bb.getCenter(new THREE.Vector3())
    const s = CAP_H / (size.y || 1)
    return { model: c, scale: s, offset: [-ctr.x * s, -ctr.y * s, -ctr.z * s] }
  }, [capScene, CAP_H])

  // Scale + centre the tie the same way as the cap.
  const tie = useMemo(() => {
    const c = tieScene.clone(true)
    c.traverse((o) => {
      if (o.isMesh) o.castShadow = true
    })
    const bb = new THREE.Box3().setFromObject(c)
    const size = bb.getSize(new THREE.Vector3())
    const ctr = bb.getCenter(new THREE.Vector3())
    const s = TIE_H / (size.y || 1)
    return { model: c, scale: s, offset: [-ctr.x * s, -ctr.y * s, -ctr.z * s] }
  }, [tieScene, TIE_H])

  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    actions?.Idle?.reset().play()
  }, [actions])

  // Parent the cap directly to the head bone so it's rigidly glued to the head
  // from frame 0 and rides the animation exactly (a real magnet). We bake a
  // fixed local matrix so it sits upright on top of the head at the right size.
  useEffect(() => {
    if (!headBone || !group.current) return
    group.current.updateWorldMatrix(true, false)
    headBone.updateWorldMatrix(true, false)

    const gPos = new THREE.Vector3()
    const gQuat = new THREE.Quaternion()
    const gScale = new THREE.Vector3()
    group.current.matrixWorld.decompose(gPos, gQuat, gScale)

    // desired world transform: on top of the head, facing like the guide, and
    // nudged forward so the visor sticks out a bit
    const headPos = new THREE.Vector3().setFromMatrixPosition(headBone.matrixWorld)
    headPos.y += HEAD_UP * gScale.y
    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(gQuat) // guide's facing
    headPos.addScaledVector(fwd, HEAD_FWD * gScale.y)
    const desired = new THREE.Matrix4().compose(headPos, gQuat, gScale)
    // local matrix under the bone so its world transform equals `desired`
    const local = new THREE.Matrix4().copy(headBone.matrixWorld).invert().multiply(desired)

    const container = new THREE.Group()
    container.matrixAutoUpdate = false
    container.matrix.copy(local)
    const inner = new THREE.Group()
    inner.scale.setScalar(cap.scale)
    inner.position.set(cap.offset[0], cap.offset[1], cap.offset[2])
    inner.add(cap.model)
    container.add(inner)
    headBone.add(container)
    return () => headBone.remove(container)
  }, [headBone, cap, HEAD_UP, HEAD_FWD])

  // Parent the tie to the chest bone, same idea as the cap: baked local matrix
  // so it hangs on the front of the body and rides the animation exactly.
  useEffect(() => {
    if (!chestBone || !group.current) return
    group.current.updateWorldMatrix(true, false)
    chestBone.updateWorldMatrix(true, false)

    const gPos = new THREE.Vector3()
    const gQuat = new THREE.Quaternion()
    const gScale = new THREE.Vector3()
    group.current.matrixWorld.decompose(gPos, gQuat, gScale)

    const pos = new THREE.Vector3().setFromMatrixPosition(chestBone.matrixWorld)
    pos.y += TIE_UP * gScale.y
    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(gQuat) // guide's facing
    pos.addScaledVector(fwd, TIE_FWD * gScale.y) // onto the front of the chest
    const desired = new THREE.Matrix4().compose(pos, gQuat, gScale)
    const local = new THREE.Matrix4().copy(chestBone.matrixWorld).invert().multiply(desired)

    const container = new THREE.Group()
    container.matrixAutoUpdate = false
    container.matrix.copy(local)
    const inner = new THREE.Group()
    inner.scale.setScalar(tie.scale)
    inner.position.set(tie.offset[0], tie.offset[1], tie.offset[2])
    inner.add(tie.model)
    container.add(inner)
    chestBone.add(container)
    return () => chestBone.remove(container)
  }, [chestBone, tie, TIE_UP, TIE_FWD])

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group ref={group} scale={0.85}>
        <primitive object={model} />
      </group>
    </group>
  )
}

export default function Guides() {
  return (
    <group>
      {GUIDES.map((g, i) => (
        <Guide key={i} {...g} />
      ))}
    </group>
  )
}

useGLTF.preload('/models/gorra.glb')
useGLTF.preload('/models/black_tie.glb')
