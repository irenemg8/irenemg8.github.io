import { useMemo } from 'react'
import * as THREE from 'three'

// A large inward-facing sphere with a vertical white↔blue gradient. Because it
// is real geometry it also shows up in VR (unlike a CSS page background).
export default function GradientBackground({ top = '#8fb7e6', bottom = '#ffffff' }) {
  const uniforms = useMemo(
    () => ({
      top: { value: new THREE.Color(top) },
      bottom: { value: new THREE.Color(bottom) },
      offset: { value: 8 },
      exponent: { value: 0.9 },
    }),
    [top, bottom],
  )
  return (
    <mesh scale={[1, 1, 1]} frustumCulled={false}>
      <sphereGeometry args={[400, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vPos;
          void main() {
            vPos = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 top;
          uniform vec3 bottom;
          uniform float offset;
          uniform float exponent;
          varying vec3 vPos;
          void main() {
            float h = normalize(vPos + vec3(0.0, offset, 0.0)).y;
            float t = pow(clamp(h * 0.5 + 0.5, 0.0, 1.0), exponent);
            gl_FragColor = vec4(mix(bottom, top, t), 1.0);
          }
        `}
      />
    </mesh>
  )
}
