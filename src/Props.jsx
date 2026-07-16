import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { fitToHeight } from './utils/fit.js'

// Decorative props (cardboard boxes, etc.). Each:
//  url        : model
//  position   : floor position [x, y, z]
//  rotation   : Y-axis spin / yaw (radians) — which way it faces
//  rotationY  : extra yaw, added to `rotation` (radians, optional)
//  rotationX  : pitch / tilt — nose up-down (radians, optional)
//  rotationZ  : roll — lean sideways (radians, optional)
//  heightM    : real height in metres (or `height` in world units)
//
// Yaw (Y) is applied FIRST, then pitch/roll around the model's OWN centre, so
// the three axes stay decoupled: set the facing with `rotation`, then tilt with
// rotationX/rotationZ and the prop tips in place instead of the axes fighting.
const UNITS_PER_M = 1.7 / 1.6
const propHeight = (p) => (p.heightM != null ? p.heightM * UNITS_PER_M : (p.height ?? 0.5))
const propYaw = (p) => (p.rotation ?? 0) + (p.rotationY ?? 0)

export const PROPS = [
  { url: '/models/box_set.glb', position: [-2.8, 0, 7], rotation: 2.4, heightM: 1.8 }, //ya
  { url: '/models/psx_boxes.glb', position: [2.4, 1, -7], rotation: -0.5, heightM: 0.7 }, //ya
    { url: '/models/carton_box.glb', position: [0, 0.3, 0.3], rotation: 0.8, heightM: 0.2 }, //ya
  { url: '/models/carton_closed.glb', position: [-1.8, 0, -6.5], rotation: -0.3, heightM: 0.55 },
  // Nilo, the pug — hangs out near his watermelon box
  {
    url: '/models/pug.glb',
    position: [3.25, 0.65, -0.8],
    rotationY: 0,
    rotationX: 0.8,
    rotationZ: 0,
    heightM: 0.3,
    sound: 'audio/pug_bark.mp3',
    say: [
      'My owner said if I hold still like a statue for five minutes, she’ll refill my green treat bowl. 🐶',
      'I can already imagine how juicy that watermelon must be…',
    ],
  },

  { url: '/models/cardboard_staircase.glb', position: [3.4, 0, -0.2], rotation: -1.6, heightM: 1.1 },
  // Nilo's dog bowl + bed
  { url: '/models/dog_bowl.glb', position: [2.6, 0, -0.9], rotation: 0, heightM: 0.07, color: '#3aa34a' },
  { url: '/models/dog_bed.glb', position: [2.9, 1, -2.3], rotation: 0.4, heightM: 0.18 },
  // Beach vibes near the beach box [2.2, 0, -6.8]
  { url: '/models/palm_tree.glb', position: [0.7, 0, -6.8], rotation: 0.4, heightM: 2.8 },
  { url: '/models/coconut.glb', position: [0.8, -0.03, -6.3], rotation: 0, heightM: 0.2 },
  { url: '/models/beer_bottle.glb', position: [2.3, -0.17, -5.4], rotationZ: 1.6, heightM: 0.4 },
  // More cardboard decor + a little frog
  { url: '/models/cardboard_guitar.glb', position: [-3, 0, -3.4], rotation: 2.3, heightM: 0.9 },
  { url: '/models/cardboard_decorations.glb', position: [-2.8, 0, -0.15], rotation: 0, heightM: 2 },
  { url: '/models/frog.glb', position: [-2.5, 1, 2], rotation: -1.6, heightM: 0.8 },

    { url: '/models/cardboard_cloud.glb', position: [2, 3.5, 5.5], rotation: -0.4, heightM: 0.4 },
        { url: '/models/cardboard_cloud.glb', position: [-1, 3.5, 3], rotation: 0.2, heightM: 0.3 },

          { url: '/models/cardboard_cloud.glb', position: [1.8, 3.7, 0], rotation: -0.2, heightM: 0.3 },
        { url: '/models/cardboard_cloud.glb', position: [-1.7, 3.2, -4.5], rotation: -0.3, heightM: 0.35 },

  { url: '/models/lemonade.glb', position: [-1.9, 0.925, -2.55],rotation: -1.6, heightM: 0.35 },
  // on the +X wall behind the study box [2.6, 0, 2]
  { url: '/models/sticky_note.glb', position: [3.35, 0.7, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.035 },
    { url: '/models/sticky_note.glb', position: [3.5, 0.7, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.03 },
        { url: '/models/sticky_note.glb', position: [3.7, 0.5, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
                { url: '/models/sticky_note.glb', position: [3.15, 0.4, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.025 },
                        { url: '/models/sticky_note.glb', position: [3.5, 0.3, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
                                                { url: '/models/sticky_note.glb', position: [4, 0.2, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.025 },
                                                                        { url: '/models/sticky_note.glb', position: [3.85, 0.8, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
                                                                        { url: '/models/sticky_note.glb', position: [4, 0.6, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
  { url: '/models/cardboard_cactus.glb', position: [2.5, 0, 7], rotation: -2.7, heightM: 1.5 },
    { url: '/models/cardboard_cactus.glb', position: [0, 0, 7.25], rotation: 2.8, heightM: 1.25 },

  { url: '/models/pile_of_books.glb', position: [2.1, 1, 1.6], rotation: 2.2, heightM: 0.3 },
  // Animated llama playing its "lookaround" clip on loop
  {
    url: '/models/llama.glb',
    position: [1.1, 0, 7.2],
    rotation: -2.3,
    heightM: 1.2,
    anim: 'lookaround',
    sound: 'audio/llama.mp3',
    say: [
      'Psst… I snuck in here when nobody was looking. 🦙',
      "Now I'm playing statue — let's see how long it takes them to notice!",
    ],
  },
  { url: '/models/cardboard_cloud_b.glb', position: [1.5, 2, 7.5], rotation: 0, heightM: 0.5 },
    { url: '/models/cardboard_cloud_b.glb', position: [0.6, 1.8, 7.4], rotation: 0, heightM: 0.3 },







]

// Box colliders (position-only, world space) so you can't walk through them.
export function propColliderGeometries(gltfs) {
  const out = []
  PROPS.forEach((p, i) => {
    const g0 = gltfs[i]
    if (!g0) return
    const c = g0.scene.clone(true)
    c.updateMatrixWorld(true)
    const fit = fitToHeight(c, propHeight(p))
    const bb = new THREE.Box3().setFromObject(c)
    const size = bb.getSize(new THREE.Vector3())
    const ctr = bb.getCenter(new THREE.Vector3())
    const g = new THREE.BoxGeometry(size.x * fit.scale, size.y * fit.scale, size.z * fit.scale)
    g.applyMatrix4(
      new THREE.Matrix4()
        .makeTranslation(p.position[0], p.position[1], p.position[2])
        .multiply(new THREE.Matrix4().makeRotationY(propYaw(p)))
        .multiply(
          new THREE.Matrix4().makeTranslation(
            ctr.x * fit.scale,
            ctr.y * fit.scale + fit.yOffset,
            ctr.z * fit.scale,
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

function Prop(p) {
  const { url, position, height, heightM, color } = p
  const outer = useRef()
  const floats = p.float ?? url.includes('cloud') // clouds bob gently
  // deterministic per-prop phase so they drift out of sync (no randomness)
  const phase = position[0] * 1.7 + position[2] * 0.9
  useFrame((state) => {
    if (!floats || !outer.current) return
    const t = state.clock.elapsedTime
    outer.current.position.y = position[1] + Math.sin(t * 0.8 + phase) * 0.12
    outer.current.rotation.y = propYaw(p) + Math.sin(t * 0.5 + phase) * 0.05
  })
  const { scene } = useGLTF(url)
  const { model, fitScale, yOffset } = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        if (color) {
          // clone the material so we don't tint other instances of this model
          o.material = o.material.clone()
          o.material.color = new THREE.Color(color)
          if ('map' in o.material) o.material.map = null // solid colour, drop texture
          if ('metalness' in o.material) o.material.metalness = 0 // matte, not metal
          if ('roughness' in o.material) o.material.roughness = 0.85
          if ('metalnessMap' in o.material) o.material.metalnessMap = null
          if ('roughnessMap' in o.material) o.material.roughnessMap = null
          o.material.needsUpdate = true
        }
      }
    })
    const fit = fitToHeight(c, propHeight({ height, heightM }))
    return { model: c, fitScale: fit.scale, yOffset: fit.yOffset }
  }, [scene, height, heightM, color])
  const midY = propHeight(p) / 2 // tilt pivots around the model's own centre
  return (
    // 1) yaw around the floor position (ref lets floating props bob in useFrame)
    <group ref={outer} position={position} rotation={[0, propYaw(p), 0]}>
      {/* 2) pitch/roll about the model centre (tips in place, no fly-off) */}
      <group position={[0, midY, 0]} rotation={[p.rotationX ?? 0, 0, p.rotationZ ?? 0]}>
        <group position={[0, -midY, 0]}>
          <group scale={fitScale} position={[0, yOffset, 0]}>
            <primitive object={model} />
          </group>
        </group>
      </group>
    </group>
  )
}

// A prop with a skinned animation: plays (on loop) the clip whose name contains
// `anim` (case-insensitive), e.g. anim: 'lookaround'.
function AnimatedProp(p) {
  const { url, position, height, heightM, anim } = p
  const group = useRef()
  const { scene, animations } = useGLTF(url)
  const { model, fitScale, yOffset } = useMemo(() => {
    const c = cloneSkeleton(scene) // proper skeleton clone for skinned meshes
    c.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
      if (o.isSkinnedMesh) o.frustumCulled = false
    })
    const fit = fitToHeight(c, propHeight({ height, heightM }))
    return { model: c, fitScale: fit.scale, yOffset: fit.yOffset }
  }, [scene, height, heightM])
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    const list = Object.values(actions).filter(Boolean)
    if (!list.length) return
    // pick the clip whose name contains `anim`; fall back to the first one
    const want = (anim || '').toLowerCase()
    const a =
      (want && list.find((ac) => ac.getClip().name.toLowerCase().includes(want))) || list[0]
    a.reset().setLoop(THREE.LoopRepeat, Infinity).play()
    if (import.meta.env.DEV) window.__llama = a
    return () => a.stop()
  }, [actions, anim])
  const midY = propHeight(p) / 2
  return (
    <group position={position} rotation={[0, propYaw(p), 0]}>
      <group position={[0, midY, 0]} rotation={[p.rotationX ?? 0, 0, p.rotationZ ?? 0]}>
        <group position={[0, -midY, 0]}>
          <group ref={group} scale={fitScale} position={[0, yOffset, 0]}>
            <primitive object={model} />
          </group>
        </group>
      </group>
    </group>
  )
}

export default function Props() {
  return (
    <group>
      {PROPS.map((p, i) =>
        p.anim ? <AnimatedProp key={i} {...p} /> : <Prop key={i} {...p} />,
      )}
    </group>
  )
}

PROPS.forEach((p) => useGLTF.preload(p.url))

// Props that can be talked to (approach + F): position + world height (for the
// close-up camera) + dialogue lines.
export const SPEAKERS = PROPS.filter((p) => p.say).map((p) => ({
  position: p.position,
  height: propHeight(p),
  sound: p.sound ?? null,
  lines: p.say,
}))
