import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { fitToHeight } from './utils/fit.js'

// Decorative props (cardboard boxes, etc.). Each: url + floor position + y
// rotation + size (heightM in real metres, or height in world units).
const UNITS_PER_M = 1.7 / 1.6
const propHeight = (p) => (p.heightM != null ? p.heightM * UNITS_PER_M : (p.height ?? 0.5))

export const PROPS = [
  { url: '/models/box_set.glb', position: [-2.8, 0, 7], rotation: 2.4, heightM: 1.8 }, //ya
  { url: '/models/psx_boxes.glb', position: [2.4, 1, -7], rotation: -0.5, heightM: 0.7 }, //ya
  { url: '/models/carton_box.glb', position: [-3.3, 0, -5.5], rotation: 0.8, heightM: 0.4 }, //ya
    { url: '/models/carton_box.glb', position: [0, 0.3, 0.3], rotation: 0.8, heightM: 0.2 }, //ya
  { url: '/models/carton_closed.glb', position: [-2.5, 0, -6.5], rotation: -0.3, heightM: 0.55 },
  // Nilo, the pug — hangs out near his watermelon box
  { url: '/models/pug.glb', position: [1.7, 0, -2.7], rotation: 2.2, heightM: 0.4 },
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
        .multiply(new THREE.Matrix4().makeRotationY(p.rotation))
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

function Prop({ url, position, rotation, height, heightM }) {
  const { scene } = useGLTF(url)
  const { model, fitScale, yOffset } = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    const fit = fitToHeight(c, propHeight({ height, heightM }))
    return { model: c, fitScale: fit.scale, yOffset: fit.yOffset }
  }, [scene, height, heightM])
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group scale={fitScale} position={[0, yOffset, 0]}>
        <primitive object={model} />
      </group>
    </group>
  )
}

export default function Props() {
  return (
    <group>
      {PROPS.map((p, i) => (
        <Prop key={i} {...p} />
      ))}
    </group>
  )
}

PROPS.forEach((p) => useGLTF.preload(p.url))
