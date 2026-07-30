import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { fitToHeight } from './utils/fit.js'
import { playerPos } from './playerState.js'
import { boxStore } from './boxStore.js'
import { talkStore } from './talkStore.js'
import { chatStore } from './npcChat.js'

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
      "If there's one thing that makes my eyes light up, it's travelling.",
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
            'Broadstairs is my little English secret: a tiny seaside town in Kent with pastel houses and a cozy bay.',
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
      'Say hi to Nilo — my pug, and the tiny king of this house. 🐶',
      'His one true love? Watermelon. He’d trade any toy for a juicy slice on a hot day.',
    ],
  },
  {
    url: '/models/caja_house.glb',
    position: [-2.6, 0, -2],
    rotation: Math.PI / 2,
    dialog: [
      'Step inside — this pixel house is a love letter to my childhood. 🏠',
      'It’s styled after the cozy interiors of Pokémon Diamond on the Nintendo DS — one of my all-time favourite games.',
      'I grew up on Nintendo: Wii Sports Resort (yes, the little aeroplane island flights!) and endless afternoons with Nintendogs.',
      'Those worlds are a big reason I love making playful, explorable spaces like this one today.',
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
      'Welcome to my study — the engine room of everything I do.',
      'Grab a seat! What corner of my academic life do you want to peek into?',
    ],
    // Branching menu about Irene's academic life (all grounded in real data).
    // TODO: add the title of the 2nd paper once confirmed (heading to IEEE Access).
    menu: {
      prompt: 'Pick a chapter:',
      again: 'Anything else from my academic life?',
      options: [
        {
          label: 'Degree',
          text: [
            "I studied the Interactive Technologies degree at the Polytechnic University of Valencia (UPV), from 2022 to 2026.",
            'It’s the sweet spot where code, design, 3D and human–computer interaction all meet — basically my dream mix.',
            'My bachelor’s thesis (written in English) built an Agentic-RAG Socratic tutor for Ohm’s law — and earned a perfect 10 with Honours (Matrícula de Honor)!',
          ],
        },
        {
          label: 'Master’s',
          text: [
            'In 2026 I’m starting the Master’s in Audiovisual Technologies at the UPV — and I’m part of its very first cohort (2026–2027)!',
            'Being in the founding promotion means helping shape the programme as we go. Exciting and a little wild.',
          ],
        },
        {
          label: 'Erasmus',
          text: [
            'In 2025 I packed my bags for an Erasmus+ BIP at the Warsaw University of Technology.',
            'Studying abroad stretched me in the best way — new methods, new friends and, yes, plenty of pierogi.',
          ],
        },
        {
          label: 'PhD',
          text: [
            'After the master’s, I’m set on a PhD at the UPV’s School of Telecommunications.',
            'Research is where I want to plant my flag — turning ideas into real, tested knowledge.',
          ],
        },
        {
          label: 'Projects',
          text: [
            'I learn by building, so my project list is long! A few favourites:',
            'Aura & AidGuide — accessibility tools for blind and visually impaired users.',
            'NeuroSpot — playful ADHD screening on AWS. Plus VIMYP, EcoCity and even Talpa, a real tunnel-boring machine!',
          ],
        },
        {
          label: 'Awards',
          text: [
            'I earned the UPV High Academic Performance distinction (Mención ARA) — it’s even noted on my European Diploma Supplement.',
            'At TAEE 2026, our team also won the Best Poster award.',
            'And I love a good hackathon — projects like Aura, UrbanVive and OnKlub are some of the ones I’m proudest of.',
          ],
        },
        {
          label: 'Papers',
          text: [
            'Yes — my first research papers are already out in the world! 🎉',
            'At TAEE 2026, our study on LLM-based Socratic tutors for understanding Ohm’s law won the Best Poster award.',
            'The Spanish version is in the conference proceedings; the English one — “Agentic RAG for Pedagogically Safe Socratic Tutoring” — is headed to IEEE Access.',
            'A second paper is also on its way to IEEE Access. Watch this space!',
          ],
        },
      ],
    },
  },
]

const NEAR_R = 1.6 // how close you must be to peek
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
      if (talkStore.get().near != null) return // a prop (llama/pug) has priority
      if (chatStore.get().near) return // …and so does a conversation to eavesdrop on
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
    // a nearby talkable prop (llama/pug) or an overheard conversation wins, so
    // their prompts don't overlap
    if (talkStore.get().near != null || chatStore.get().near) near = null
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
