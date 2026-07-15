import { useGLTF } from '@react-three/drei'

// The VR modern gallery room (Sketchfab GLB). The Scene normalises its scale
// and builds a BVH collider from it.
export default function Apartment(props) {
  const { scene } = useGLTF('/models/gallery4k.glb')

  scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true
      o.receiveShadow = true
      // Let the HDRI reflect in the surfaces so materials read richer.
      const mats = Array.isArray(o.material) ? o.material : [o.material]
      mats.forEach((m) => {
        if (m && 'envMapIntensity' in m) m.envMapIntensity = 1.25
      })
    }
  })

  return <primitive object={scene} {...props} />
}

useGLTF.preload('/models/gallery4k.glb')
