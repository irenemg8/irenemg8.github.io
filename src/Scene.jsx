import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, PointerLockControls } from '@react-three/drei'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import * as THREE from 'three'
import './bvh.js' // side-effect: patch BVH onto three
import { playerPos } from './playerState.js'
import { metaStore } from './metaStore.js'
import { talkStore } from './talkStore.js'
import { chatStore } from './npcChat.js'
import Apartment from './Apartment.jsx'
import GradientBackground from './GradientBackground.jsx'
import City from './City.jsx'
import Traffic from './Traffic.jsx'
import Pedestrians from './Pedestrians.jsx'
import GalleryNPCs from './GalleryNPCs.jsx'
import Markers from './Markers.jsx'
import Artworks, { ITEMS as ARTWORK_ITEMS, artworkColliderGeometries } from './Artworks.jsx'
import { benchColliderGeometries } from './data/galleryLayout.js'
import Boxes, { boxColliderGeometries, BOXES } from './Boxes.jsx'
import Props, { propColliderGeometries, PROPS } from './Props.jsx'
import Guides from './Guides.jsx'
import Villagers from './Villagers.jsx'
import { TALKERS } from './talkers.js'
import PlayerController from './PlayerController.jsx'

const CEILING = 5.5 // normalise the room so its height ≈ 4 metres (bigger gallery)

// Trigger the Meta "passthrough" overlay when the player gets near the glasses.
const META_ITEM = ARTWORK_ITEMS.find((i) => i.key === 'metaQuest3')
const META_XZ = META_ITEM ? [META_ITEM.position[0], META_ITEM.position[2]] : [0, 0]
const META_R = 1.8
function MetaProximity() {
  useFrame(() => {
    const d = Math.hypot(playerPos.x - META_XZ[0], playerPos.z - META_XZ[1])
    // a nearby / active talker (a door guide) wins, so prompts don't overlap
    const t = talkStore.get()
    const c = chatStore.get()
    const busy = t.near != null || t.open != null || c.near || c.open
    metaStore.set({ near: d < META_R && !busy })
  })
  return null
}

// Nearest talkable prop (e.g. the sneaky llama) within range -> talkStore.near.
// Tune this to change how close you must get to the llama, Nilo, the door
// guides and the villagers before their F prompt appears.
const TALK_R = 1.2
function TalkProximity() {
  useFrame(() => {
    if (talkStore.get().open != null) return // don't switch while chatting
    // Two visitors nattering nearby win: their conversation is over in seconds,
    // whereas the llama will happily wait for you.
    const c = chatStore.get()
    if (c.near || c.open) {
      talkStore.set({ near: null })
      return
    }
    // Nearest talker that's inside ITS OWN range — a speaker can set `radius`
    // to keep quiet until you're right on top of it (see the guitar).
    let near = null
    let best = Infinity
    for (let i = 0; i < TALKERS.length; i++) {
      const p = TALKERS[i].position
      const d = Math.hypot(playerPos.x - p[0], playerPos.z - p[2])
      if (d < (TALKERS[i].radius ?? TALK_R) && d < best) {
        best = d
        near = i
      }
    }
    talkStore.set({ near })
  })
  return null
}

// Tells the HUD the room is actually on screen. The loading bar tracks
// downloads, which finish well before the collider is built and the first frame
// is drawn — hiding it then just leaves you staring at a black screen.
function ReadySignal({ onReady }) {
  const frames = useRef(0)
  useFrame(() => {
    if (frames.current > 1) return
    if (++frames.current > 1) onReady?.()
  })
  return null
}

export default function Scene({ mode = 'third', showMarkers = false, onReady }) {
  const { scene } = useGLTF('/models/gallery4k.glb')
  const artGltf = useGLTF(ARTWORK_ITEMS.map((i) => i.url))
  const boxGltfs = useGLTF(BOXES.map((b) => b.url))
  const propGltfs = useGLTF(PROPS.map((p) => p.url))

  // Normalise (scale + centre + floor on y=0) via a WRAPPER transform so we
  // never mutate the cached scene (StrictMode-safe), then bake the same
  // transform into a merged BVH collider.
  const { transform, collider } = useMemo(() => {
    // Measure the room in ITS OWN space, never in world space. `scene` is the
    // shared cached object that <Apartment /> mounts inside the scaled group
    // below, so its matrixWorld already carries that scale — measuring it would
    // fold the scale back into itself and the room would grow every time this
    // re-ran. Cancelling the room's own world matrix makes this idempotent.
    scene.updateMatrixWorld(true)
    const toRoom = new THREE.Matrix4().copy(scene.matrixWorld).invert()
    const local = new THREE.Matrix4()

    const raw = new THREE.Box3()
    const parts = []
    scene.traverse((o) => {
      if (!o.isMesh) return
      const g = o.geometry.clone()
      g.applyMatrix4(local.multiplyMatrices(toRoom, o.matrixWorld)) // -> room space
      g.computeBoundingBox()
      raw.union(g.boundingBox)
      parts.push(g)
    })

    const size = raw.getSize(new THREE.Vector3())
    const S = CEILING / (size.y || 1)
    const offset = new THREE.Vector3(
      -((raw.min.x + raw.max.x) / 2) * S,
      -raw.min.y * S,
      -((raw.min.z + raw.max.z) / 2) * S,
    )
    const world = new THREE.Matrix4().compose(
      offset,
      new THREE.Quaternion(),
      new THREE.Vector3(S, S, S),
    )

    // Build a position-only merged geometry for collision.
    const geoms = []
    for (const g of parts) {
      g.applyMatrix4(world) // room space -> normalised world
      const clean = new THREE.BufferGeometry()
      clean.setAttribute('position', g.attributes.position.clone())
      if (g.index) clean.setIndex(g.index.clone())
      geoms.push(clean)
    }
    // bench box colliders (can't walk through them)
    geoms.push(...benchColliderGeometries())
    // artworks: bake their real geometry in so you can't walk through them
    const artScenes = Array.isArray(artGltf) ? artGltf.map((g) => g.scene) : [artGltf.scene]
    geoms.push(...artworkColliderGeometries(artScenes))
    // diorama boxes are solid too
    geoms.push(...boxColliderGeometries(boxGltfs))
    geoms.push(...propColliderGeometries(propGltfs))
    const merged = mergeGeometries(geoms.map((g) => (g.index ? g.toNonIndexed() : g)), false)
    merged.computeBoundsTree()
    const colliderMesh = new THREE.Mesh(merged)
    colliderMesh.updateMatrixWorld()

    if (import.meta.env.DEV && typeof window !== 'undefined') {
      window.__tris = (merged.index ? merged.index.count : merged.attributes.position.count) / 3
      window.__gal = { scene, world } // dev: measure the room's own geometry
      window.__col = colliderMesh // dev: probe what actually blocks you
    }

    return {
      transform: { scale: S, position: offset.toArray() },
      collider: colliderMesh,
    }
  }, [scene, artGltf, boxGltfs, propGltfs])

  return (
    <>
      {/* Clean white↔blue gradient sky (also visible in VR) */}
      <GradientBackground top="#8fb7e6" bottom="#ffffff" />

      {/* Ground + a distant city of buildings so the gallery doesn't float */}
      <City />

      {/* Rectangular streets: green & yellow cars, traffic light, stop & go */}
      <Traffic />

      {/* Street pedestrians (never enter the gallery) */}
      <Pedestrians />

      {/* Gallery interior: wandering NPCs + placement markers (benches already
          live in the gallery model, so they collide via the BVH) */}
      <GalleryNPCs collider={collider} />
      <Artworks />
      {/* Order matters: useFrame runs in mount order, and each of these reads
          what the one above it wrote. GalleryNPCs (a conversation) beats the
          talkers, which beat the boxes, which all beat the Meta glasses — so
          the F prompts never pile up on top of each other. */}
      <TalkProximity />
      <Boxes />
      <MetaProximity />
      <Props />
      <Guides />
      <Villagers />
      <Markers show={showMarkers} />

      {/* Lighting (no HDRI): bright but not blown out, so colours read */}
      <hemisphereLight args={['#ffffff', '#eef1f6', 0.95]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[12, 22, 8]} intensity={2.6} />
      <directionalLight position={[-8, 10, -6]} intensity={0.5} />

      {/* Visible apartment (normalised via wrapper, cached scene untouched) */}
      <group scale={transform.scale} position={transform.position}>
        <Apartment />
      </group>

      <PlayerController collider={collider} mode={mode} />
      <ReadySignal onReady={onReady} />
      {mode === 'first' && <PointerLockControls makeDefault selector="#lookbtn" />}
    </>
  )
}
