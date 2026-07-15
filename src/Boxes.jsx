import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { fitToHeight } from './utils/fit.js'
import { playerPos } from './playerState.js'
import { boxStore } from './boxStore.js'

// Diorama boxes — each loads its own model, fit to a uniform display size.
//  url      : the box/content model
//  position : floor position
//  rotation : y rotation
//  height   : display height in world units (default DISPLAY_H)
//  scale    : extra per-box multiplier (1 = default; 1.5 = 50% bigger)
//  dialog   : Pokémon-style dialogue pages shown while peeking (edit freely!)
const DISPLAY_H = 1
export const BOXES = [
 // { url: '/models/caja.glb', position: [3, 0, 3], rotation: -2.3 },
  {
    url: '/models/caja_terreno.glb',
    position: [-2.6, 0, 2],
    rotation: Math.PI / 2,
    dialog: [
      "Hi there! I'm Irene Medina García — welcome to my little 3D world.",
      "If there's one thing that makes my eyes light up, it's traveling.",
      'Every place I visit leaves a little mark on me. Want to hear about one?',
    ],
    // Branching menu (Pokémon-style). Pick a place → read its story → choose
    // again or bow out. Edit any of these texts freely!
    menu: {
      prompt: 'Where should I take you?',
      again: 'Anywhere else you want to hear about?',
      options: [
        {
          label: 'London',
          text: [
            'London stole a piece of my heart — red buses, rainy afternoons and that electric big-city buzz.',
            'I could happily get lost in its museums for days.',
          ],
        },
        {
          label: 'Broadstairs',
          text: [
            'Broadstairs is my little English secret: a tiny seaside town in Kent with pastel houses and a cosy bay.',
            "It's where I polished my English and fell for the British coast.",
          ],
        },
        {
          label: 'Warsaw',
          text: [
            'Warsaw is where I lived my Erasmus+ adventure at the Warsaw University of Technology.',
            'Freezing winters, the warmest people... and my very first pierogi. 🥟',
          ],
        },
        {
          label: 'Paris',
          text: [
            "Paris — because who doesn't dream of it?",
            'Croissants at dawn, the Seine at night and art on every corner. A cliché, maybe. Magical, absolutely.',
          ],
        },
        {
          label: 'Valencia',
          text: [
            "Valencia is home base. It's where I study at the UPV and where the paella is basically sacred.",
            'The Mediterranean light makes everything feel alive.',
          ],
        },
        {
          label: 'Gandía',
          text: [
            'Gandía is my peaceful corner: golden sand, calm sea and long, slow summers.',
            "It's also the city behind my URBANVIVE project — so it's close to my heart twice over.",
          ],
        },
        {
          label: 'Rome',
          text: [
            'Rome never stops surprising me — every street corner hides two thousand years of history.',
            '(And the best gelato I have ever had, no contest.)',
          ],
        },
        {
          label: 'Milan',
          text: [
            'Milan showed me its stylish side: design, fashion and a cathedral that left me speechless.',
            'The perfect mix of old grandeur and modern energy.',
          ],
        },
        {
          label: 'Porto',
          text: [
            'Porto won me over with its riverside, its blue tiles and its warmth.',
            'A glass of port watching the Douro at sunset — pure magic.',
          ],
        },
      ],
    },
  },
  {
    url: '/models/caja_watermelon.glb',
    position: [2.6, 0, -2],
    rotation: -Math.PI / 2,
    dialog: [
      'Fun fact: I could happily eat watermelon all summer long.',
      'I like keeping life colorful and playful — and my projects too.',
    ],
  },
  {
    url: '/models/caja_house.glb',
    position: [-2.6, 0, -2],
    rotation: Math.PI / 2,
    dialog: [
      'This one is home.',
      'I fell in love with 3D and VR, turning the web into places you can actually walk into.',
    ],
  },
  {
    url: '/models/caja_beach.glb',
    position: [2.2, 0, -6.8],
    rotation: -0.5,
    dialog: [
      'The beach is where I recharge.',
      "When I'm not coding, I'm chasing sunsets, good music and new adventures.",
    ],
  },
  {
    url: '/models/caja_study.glb',
    position: [2.6, 0, 2],
    rotation: -Math.PI / 2,
    animated: true,
    dialog: [
      'And this is where the magic happens — my study.',
      'I build immersive experiences, from Meta Quest worlds to cozy 3D portfolios like this one.',
      'Thanks for stopping by! Press F whenever you want to step back out.',
    ],
  },
]

const NEAR_R = 2 // how close you must be to peek
const UP = new THREE.Vector3(0, 1, 0)
// Straight-on front view, level with the box centre. Tweak to frame content.
const PEEK_OFFSET = new THREE.Vector3(0, 0.6, 2.0)
const PEEK_TARGET_Y = 0.6

export function peekView(i) {
  const b = BOXES[i]
  const off = PEEK_OFFSET.clone().applyAxisAngle(UP, b.rotation)
  return {
    pos: [b.position[0] + off.x, off.y, b.position[2] + off.z],
    target: [b.position[0], PEEK_TARGET_Y, b.position[2]],
  }
}

// Advance a clone's animation to its final frame so we measure/fit the model in
// its assembled pose (some box animations start disassembled).
function settleAnimation(clone, animations) {
  const clip = animations && animations[0]
  if (!clip) return
  const mixer = new THREE.AnimationMixer(clone)
  mixer.clipAction(clip).play()
  mixer.setTime(clip.duration)
  clone.updateMatrixWorld(true)
}

// Per-box box colliders (position-only, world space) so you can't walk through
// them. `gltfs` are the loaded models (with .scene and .animations), per BOXES.
export function boxColliderGeometries(gltfs) {
  const out = []
  BOXES.forEach((b, i) => {
    const g0 = gltfs[i]
    if (!g0) return
    const c = b.animated ? cloneSkeleton(g0.scene) : g0.scene.clone(true)
    if (b.animated) settleAnimation(c, g0.animations)
    c.updateMatrixWorld(true)
    const fit = fitToHeight(c, b.height ?? DISPLAY_H)
    const s = b.scale ?? 1
    const bb = new THREE.Box3().setFromObject(c)
    const size = bb.getSize(new THREE.Vector3())
    const ctr = bb.getCenter(new THREE.Vector3())
    const k = fit.scale * s
    const g = new THREE.BoxGeometry(size.x * k, size.y * k, size.z * k)
    g.applyMatrix4(
      new THREE.Matrix4()
        .makeTranslation(b.position[0], b.position[1], b.position[2])
        .multiply(new THREE.Matrix4().makeRotationY(b.rotation))
        .multiply(
          new THREE.Matrix4().makeTranslation(
            ctr.x * k,
            (ctr.y * fit.scale + fit.yOffset) * s,
            ctr.z * k,
          ),
        ),
    )
    const clean = new THREE.BufferGeometry()
    clean.setAttribute('position', g.attributes.position.clone())
    if (g.index) clean.setIndex(g.index.clone())
    out.push(clean)
  })
  return out
}

function shadeMeshes(root) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
}

function Box({ url, position, rotation, height, scale = 1 }) {
  const { scene } = useGLTF(url)
  const { model, fitScale, yOffset } = useMemo(() => {
    const c = scene.clone(true)
    shadeMeshes(c)
    const fit = fitToHeight(c, height ?? DISPLAY_H)
    return { model: c, fitScale: fit.scale, yOffset: fit.yOffset }
  }, [scene, height])
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group scale={fitScale} position={[0, yOffset, 0]}>
        <primitive object={model} />
      </group>
    </group>
  )
}

// A box whose model has an animation (measure fit in the assembled pose, then
// play the animation once and hold on the final frame).
function AnimatedBox({ url, position, rotation, height, scale = 1 }) {
  const { scene, animations } = useGLTF(url)
  const group = useRef()
  const { model, fitScale, yOffset } = useMemo(() => {
    const c = cloneSkeleton(scene) // skinned rig -> proper skeleton clone
    shadeMeshes(c)
    c.traverse((o) => {
      if (o.isSkinnedMesh) o.frustumCulled = false
    })
    settleAnimation(c, animations) // pose to the end frame before measuring
    const fit = fitToHeight(c, height ?? DISPLAY_H)
    return { model: c, fitScale: fit.scale, yOffset: fit.yOffset }
  }, [scene, animations, height])
  const { actions, names } = useAnimations(animations, group)
  useEffect(() => {
    const a = names[0] && actions[names[0]]
    if (!a) return
    a.reset()
    a.setLoop(THREE.LoopRepeat, Infinity) // keep it moving
    a.play()
    if (import.meta.env.DEV) window.__studyAction = a
  }, [actions, names])
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group ref={group} scale={fitScale} position={[0, yOffset, 0]}>
        <primitive object={model} />
      </group>
    </group>
  )
}

export default function Boxes() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'KeyF') return
      const s = boxStore.get()
      // F only opens a box; leaving happens when the dialogue finishes.
      if (s.peek == null && s.near != null) boxStore.set({ peek: s.near })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useFrame(() => {
    if (boxStore.get().peek != null) return
    let near = null
    let best = NEAR_R
    for (let i = 0; i < BOXES.length; i++) {
      const b = BOXES[i]
      const d = Math.hypot(playerPos.x - b.position[0], playerPos.z - b.position[2])
      if (d < best) {
        best = d
        near = i
      }
    }
    boxStore.set({ near })
  })

  return (
    <group>
      {BOXES.map((b, i) =>
        b.animated ? <AnimatedBox key={i} {...b} /> : <Box key={i} {...b} />,
      )}
    </group>
  )
}

BOXES.forEach((b) => useGLTF.preload(b.url))
