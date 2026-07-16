import * as THREE from 'three'

// Gallery interior layout, in WORLD space (centre 0, floor y = 0).
// These are GUESSED positions — turn on the markers (button in the HUD) and
// tell me what to move; then we hide the markers.

// Door(s) NPCs use to enter/leave the gallery (the open front).
export const DOORS = [
  { position: [3.5, 0, 4.7] },
  { position: [-3.5, 0, -4.6] }
]

// Spots where a gallery NPC stands to look at a wall piece.
export const ARTWORKS = [
  { position: [-2.6, 0, 2] },
  { position: [2.6, 0, -2]},
  { position: [-2.6, 0, -2]}, //ya
  { position: [2.2, 0, -6.8] },
  { position: [2.6, 0, 2] },
  { position: [-1.8, 0, -6.5] }, //ya  
  { position: [1.1, 0, 7.20]  }, //ya

]

// Rectangular benches: [w, h, d] size, y rotation. Also used as colliders and
// as sitting spots (two seats each, along local X).
export const BENCHES = [
  { position: [-0.1, 0, 0], size: [1, 0, 1], rotation: 1.6 },
  { position: [-0.1, 0, -4.05], size: [1, 0, 1], rotation: 1.6 },
  { position: [-0.1, 0, 4.05], size: [1, 0, 1], rotation: 1.6 },
]

// Where gallery NPCs first appear (near the door).
export const NPC_SPAWNS = [
  { position: [3.5, 0, 4.7] },
  { position: [-3.5, 0, -4.6] }
]

// Box colliders for the benches so they can't be walked through. Uses each
// bench's [w, d] footprint (from size) and a fixed height. Returns position-only
// geometries in world space to merge into the BVH collider.
const BENCH_COLLIDER_H = 0.5
export function benchColliderGeometries() {
  return BENCHES.map((b) => {
    const w = b.size[0] || 1
    const d = b.size[2] || 1
    const g = new THREE.BoxGeometry(w, BENCH_COLLIDER_H, d)
    g.translate(0, BENCH_COLLIDER_H / 2, 0)
    const M = new THREE.Matrix4().compose(
      new THREE.Vector3(b.position[0], b.position[1], b.position[2]),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), b.rotation),
      new THREE.Vector3(1, 1, 1),
    )
    g.applyMatrix4(M)
    const clean = new THREE.BufferGeometry()
    clean.setAttribute('position', g.attributes.position.clone())
    if (g.index) clean.setIndex(g.index.clone())
    return clean
  })
}

// A seat point (world pos + facing) for each bench seat.
export function benchSeats() {
  const seats = []
  for (const b of BENCHES) {
    const [cx, cy, cz] = b.position
    const half = b.size[0] * 0.28
    const cos = Math.cos(b.rotation)
    const sin = Math.sin(b.rotation)
    for (const sx of [-half, half]) {
      seats.push({
        // The bench's Y (position[1]) is the seat height — tweak it to raise or
        // lower where NPCs sit.
        position: [cx + sx * cos, cy, cz + sx * sin],
        face: b.rotation,
      })
    }
  }
  return seats
}
