import * as THREE from 'three'

// Live player position, updated every frame by PlayerController and read by
// world objects (e.g. the diorama boxes' proximity check).
export const playerPos = new THREE.Vector3()
