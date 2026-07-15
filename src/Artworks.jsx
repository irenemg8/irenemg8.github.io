import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { fitToHeight } from './utils/fit.js'

// The gallery pieces. Add one entry per artwork.
//  position   : where it sits (world space; matches an ARTWORKS spot)
//  rotation   : y-facing (radians) — turn it toward the viewers
//  height     : sculpture height in metres
//  pedestal   : plinth height (0 = none)
//  texture    : optional colour map to apply (model came untextured)
//  color      : optional solid colour (for untextured models)
//  boxCollider: use a cheap box collider instead of the real (heavy) geometry
export const ITEMS = [
    { key: 'metaQuest3', url: '/models/meta_quest_3.glb', position: [-2.5, 0.6, -6.5], rotation: 0.9 ,     height: 0.5,    pedestal: 0},
  /*{
    key: 'moai',
    url: '/models/moai.glb',
    texture: '/textures/seaside_rock_diff.jpg',
    position: [-0.5, 0, -5.5],
    rotation: 0,
    height: 1.5,
    pedestal: 0,
  },*/

  // --- new floor sculptures (position/rotation to place) ---
  //{ key: 'meadmore', url: '/models/meadmore.glb', color: '#2b2b2b', rotX: 0, position: [2, 0, -5], rotation: 0, heightM: 2, pedestal: 0 }, //ya cosa negra
 // { key: 'organic', url: '/models/organic.glb', position: [0, 0, -2], rotation: 0, heightM: 1.5, pedestal: 0, boxCollider: true },
 // { key: 'catChair', url: '/models/cat_chair.glb', position: [1.8, 0, 5.2], rotation: -2.4, heightM: 1, pedestal: 0, boxCollider: true }, //ya silla gato
 // { key: 'stillLife', url: '/models/still_life.glb', position: [0, 1, -6], rotation: 0, heightM: 1, pedestal: 0 }, //ya cuadro frutero
 // { key: 'poolStatue', url: '/models/pool_statue.glb', position: [-4, 0, -3], rotation: 0, heightM: 1.8, pedestal: 0 },

  // --- new wall pieces ---
  //{ key: 'abstractCanvas', url: '/models/abstract_canvas.glb', wall: true, rotX: 0, position: [-0.5, 1.5, 6], rotation: 1.6, heightM: 1.5 }, //dos cuadros iguales
 // { key: 'modernPainting', url: '/models/modern_painting.glb', wall: true, position: [0, 0.5, 3], rotation: -1.6, heightM: 6 },
 // { key: 'bohoFrame', url: '/models/boho_frame.glb', wall: true, position: [-2.63, 1.5, 0], rotation: 1.60, heightM: 0.8 }, //ya
 // { key: 'wallArtSet', url: '/models/wall_art_set.glb', wall: true, position: [3.7, 1.5, 0], rotation: Math.PI, heightM: 1 }, // tres naranjas ya
]

// World scale: the player renders ~1.7 units tall and is 1.6 m in real life,
// so an item can give `heightM` (real metres) and we convert to world units.
const UNITS_PER_M = 1.7 / 1.6
function itemHeight(it) {
  return it.heightM != null ? it.heightM * UNITS_PER_M : (it.height ?? 1.3)
}

// Full transform an artwork's model gets in the scene (matches the JSX below).
function itemMatrix(it, yOffset) {
  const ped = it.pedestal ?? 0
  return new THREE.Matrix4()
    .makeTranslation(it.position[0], it.position[1], it.position[2])
    .multiply(new THREE.Matrix4().makeRotationY(it.rotation ?? 0))
    .multiply(new THREE.Matrix4().makeTranslation(0, ped + yOffset, 0))
}

function tuneTextured(o, tex) {
  const src = Array.isArray(o.material) ? o.material[0] : o.material
  const m = src ? src.clone() : new THREE.MeshStandardMaterial()
  m.map = tex
  m.color.set('#ffffff')
  m.roughness = 0.95
  m.metalness = 0
  m.emissiveMap = tex
  m.emissive.set('#ffffff')
  m.emissiveIntensity = 0.4
  o.material = m
}

function tuneColor(o, color) {
  const src = Array.isArray(o.material) ? o.material[0] : o.material
  const m = src ? src.clone() : new THREE.MeshStandardMaterial()
  m.map = null
  m.color.set(color)
  m.roughness = 0.85
  m.metalness = 0
  if (m.emissive) {
    m.emissive.set('#000000')
    m.emissiveIntensity = 0
  }
  o.material = m
}

function buildFitted(scene, height, tune, rotX = 0) {
  const c = scene.clone(true)
  if (rotX) c.rotation.x = rotX // bake an upright rotation before measuring
  c.traverse((o) => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    tune?.(o)
  })
  const fit = fitToHeight(c, height)
  const box = new THREE.Box3().setFromObject(c)
  const centerYOffset = -((box.min.y + box.max.y) / 2) * fit.scale // to hang centred
  return { model: c, scale: fit.scale, yOffset: fit.yOffset, centerYOffset }
}

function ArtBody({ fitted, position, rotation = 0, pedestal = 0, wall = false }) {
  // wall pieces hang centred at their Y; floor pieces rest their feet on y=0
  const yShift = wall ? fitted.centerYOffset : fitted.yOffset
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {pedestal > 0 && !wall && (
        <mesh castShadow receiveShadow position={[0, pedestal / 2, 0]}>
          <boxGeometry args={[0.9, pedestal, 0.9]} />
          <meshStandardMaterial color="#eceae4" roughness={0.9} />
        </mesh>
      )}
      <group position={[0, wall ? 0 : pedestal, 0]}>
        <group scale={fitted.scale} position={[0, yShift, 0]}>
          <primitive object={fitted.model} />
        </group>
      </group>
    </group>
  )
}

function TexturedArt({ url, texture, height, heightM, rotX = 0, ...rest }) {
  const { scene } = useGLTF(url)
  const tex = useTexture(texture)
  const h = itemHeight({ height, heightM })
  const fitted = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    return buildFitted(scene, h, (o) => tuneTextured(o, tex), rotX)
  }, [scene, tex, h, rotX])
  return <ArtBody fitted={fitted} {...rest} />
}

function NativeArt({ url, color, height, heightM, rotX = 0, ...rest }) {
  const { scene } = useGLTF(url)
  const h = itemHeight({ height, heightM })
  const fitted = useMemo(
    () => buildFitted(scene, h, color ? (o) => tuneColor(o, color) : null, rotX),
    [scene, h, color, rotX],
  )
  return <ArtBody fitted={fitted} {...rest} />
}

// Same as NativeArt but plays the FIRST HALF of the model's animation once,
// then holds that pose (e.g. the Bosch triptych half-opening).
function AnimatedArt({ url, height, heightM, rotX = 0, ...rest }) {
  const { scene, animations } = useGLTF(url)
  const group = useRef()
  const action = useRef(null)
  const h = itemHeight({ height, heightM })
  const fitted = useMemo(() => buildFitted(scene, h, null, rotX), [scene, h, rotX])
  const { actions, names } = useAnimations(animations, group)
  useEffect(() => {
    const a = names[0] && actions[names[0]]
    if (!a) return
    a.reset()
    a.setLoop(THREE.LoopOnce, 1)
    a.clampWhenFinished = true
    a.paused = false
    a.play()
    action.current = a
  }, [actions, names])
  useFrame(() => {
    const a = action.current
    if (!a || a.paused) return
    const half = a.getClip().duration / 2
    if (a.time >= half) {
      a.time = half // stop exactly at the halfway pose
      a.paused = true
    }
  })
  return (
    <group ref={group}>
      <ArtBody fitted={fitted} {...rest} />
    </group>
  )
}

// Colliders (baked to world space) so you can't walk through the pieces.
export function artworkColliderGeometries(scenes) {
  const out = []
  ITEMS.forEach((it, i) => {
    if (it.wall) return // wall pieces are flush with a wall — no collider needed
    const gs = scenes[i]
    if (!gs) return
    const c = gs.clone(true)
    if (it.rotX) c.rotation.x = it.rotX // match the upright rotation
    c.updateMatrixWorld(true)
    const fit = fitToHeight(c, itemHeight(it))

    if (it.boxCollider) {
      // cheap box (for heavy / high-poly models like the pyramid)
      const size = new THREE.Box3().setFromObject(c).getSize(new THREE.Vector3())
      const wx = Math.max(0.3, size.x * fit.scale)
      const wy = Math.max(0.3, size.y * fit.scale)
      const wz = Math.max(0.3, size.z * fit.scale)
      const g = new THREE.BoxGeometry(wx, wy, wz)
      g.translate(0, wy / 2, 0)
      g.applyMatrix4(
        new THREE.Matrix4()
          .makeTranslation(it.position[0], it.position[1] + (it.pedestal ?? 0), it.position[2])
          .multiply(new THREE.Matrix4().makeRotationY(it.rotation ?? 0)),
      )
      const clean = new THREE.BufferGeometry()
      clean.setAttribute('position', g.attributes.position.clone())
      if (g.index) clean.setIndex(g.index.clone())
      out.push(clean)
      return
    }

    const M = itemMatrix(it, fit.yOffset).multiply(
      new THREE.Matrix4().makeScale(fit.scale, fit.scale, fit.scale),
    )
    c.traverse((o) => {
      if (!o.isMesh) return
      const g = o.geometry.clone()
      g.applyMatrix4(o.matrixWorld)
      g.applyMatrix4(M)
      const clean = new THREE.BufferGeometry()
      clean.setAttribute('position', g.attributes.position.clone())
      if (g.index) clean.setIndex(g.index.clone())
      out.push(clean)
    })
  })
  return out
}

export default function Artworks() {
  return (
    <group>
      {ITEMS.map(({ key, ...it }) =>
        it.animated ? (
          <AnimatedArt key={key} {...it} />
        ) : it.texture ? (
          <TexturedArt key={key} {...it} />
        ) : (
          <NativeArt key={key} {...it} />
        ),
      )}
    </group>
  )
}

ITEMS.forEach((it) => useGLTF.preload(it.url))
