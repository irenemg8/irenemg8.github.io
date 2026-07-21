import * as THREE from 'three'

// Measure an object and return the uniform scale + y offset needed to make it
// `targetHeight` tall with its feet on y = 0.
//
// Handles skinned meshes: a plain Box3.setFromObject on a freshly-cloned rig
// can report a zero-size box (bones not posed yet), so we union per-mesh boxes,
// using SkinnedMesh.computeBoundingBox() which accounts for the skeleton.
export function fitToHeight(object, targetHeight) {
  object.updateWorldMatrix(true, true)

  const box = new THREE.Box3()
  const tmp = new THREE.Box3()
  object.traverse((o) => {
    if (o.isSkinnedMesh) {
      // The rig's visible size comes from the bones, so update the skeleton
      // before measuring (a fresh clone's boneMatrices are otherwise stale).
      o.skeleton?.update?.()
      o.computeBoundingBox?.()
      if (o.boundingBox) box.union(tmp.copy(o.boundingBox).applyMatrix4(o.matrixWorld))
    } else if (o.isMesh) {
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox()
      if (o.geometry.boundingBox) box.union(tmp.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld))
    }
  })
  if (box.isEmpty()) box.setFromObject(object)

  const size = new THREE.Vector3()
  box.getSize(size)
  const scale = targetHeight / (size.y || 1)
  const yOffset = -box.min.y * scale
  // Horizontal centre of the model (in fitted units) — used to spin a prop about
  // its own vertical axis instead of orbiting around an off-centre origin.
  const center = new THREE.Vector3()
  box.getCenter(center)
  const cx = center.x * scale
  const cz = center.z * scale
  return { scale, yOffset, cx, cz }
}
