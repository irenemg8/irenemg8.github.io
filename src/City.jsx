import { useMemo } from 'react'
import * as THREE from 'three'

// Seeded RNG so the skyline is identical every load.
function makeRng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff)
}

const COUNT = 160
const INNER = 30 // keep buildings clear of the gallery + the ring road
const OUTER = 190

// A ground plane + a ring of procedural buildings so the gallery sits inside a
// city instead of floating. Reads as a distant skyline through the windows.
export default function City() {
  const mesh = useMemo(() => {
    const rng = makeRng(0xc17a5)
    const geo = new THREE.BoxGeometry(1, 1, 1)
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0.0 })
    const inst = new THREE.InstancedMesh(geo, mat, COUNT)

    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const pos = new THREE.Vector3()
    const scl = new THREE.Vector3()
    const col = new THREE.Color()
    // Half the buildings red (to pop against the blue gallery), half white/light.
    const reds = ['#e24a3b', '#d6382e', '#c0392b', '#ec5a44']
    const lights = ['#f4f5f7', '#e8ebf0', '#dfe4ec']

    for (let i = 0; i < COUNT; i++) {
      const a = rng() * Math.PI * 2
      const r = INNER + Math.sqrt(rng()) * (OUTER - INNER)
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const w = 5 + rng() * 12
      const d = 5 + rng() * 12
      const h = 8 + rng() * 62 * (r / OUTER + 0.3) // taller further out -> skyline depth
      pos.set(x, h / 2, z)
      scl.set(w, h, d)
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rng() * Math.PI)
      m.compose(pos, q, scl)
      inst.setMatrixAt(i, m)
      const group = i % 2 === 0 ? reds : lights
      col.set(group[Math.floor(rng() * group.length)])
      inst.setColorAt(i, col)
    }
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
    return inst
  }, [])

  return (
    <group>
      {/* Ground the whole scene sits on */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[OUTER + 120, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <primitive object={mesh} />
    </group>
  )
}
