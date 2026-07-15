// Give a cloned model a solid colour. Clones each material first so tinting one
// instance never affects the shared source material (used by other clones).
export function recolor(root, color) {
  root.traverse((o) => {
    if (!o.isMesh && !o.isSkinnedMesh) return
    const src = Array.isArray(o.material) ? o.material[0] : o.material
    if (!src) return
    const m = src.clone()
    m.map = null
    m.vertexColors = false
    m.color.set(color)
    // Force a clean matte surface: the stickman material ships with a blue
    // emissive (#0004d7) that tints everything (red -> magenta), plus metalness
    // that reflects the sky. Clear both so the solid colour reads true.
    if (m.emissive) {
      m.emissive.set('#000000')
      m.emissiveIntensity = 0
    }
    if ('metalness' in m) m.metalness = 0
    if ('roughness' in m) m.roughness = 0.75
    m.needsUpdate = true
    o.material = m
  })
}
