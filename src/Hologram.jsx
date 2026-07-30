import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CV_PAGES, CV_PHOTO } from './cvContent.js'
import { PAGE_W, PAGE_H, drawPage, loadPortrait } from './cvPage.js'
import { cvStore, useCvStore } from './cvStore.js'

// The CV hologram: a sheet of light floating in a cone above the projector.
//
// The projector MODEL itself is a normal prop (see PROPS in Props.jsx) so it
// gets its collider and placement for free — this file only draws the projected
// part. Both read CV_SPOT, so moving the hologram means editing one place.
export const CV_SPOT = {
  position: [2.9, 0, -4.2], // where the projector stands on the floor
  rotation: -Math.PI / 2, // which way the sheet faces (here: toward the room, -X)
  // The projector is a wide, flat ring, so fitting it by height (as every prop
  // is) blows its footprint up — 0.2 m tall works out at a ~0.9-unit-wide pad.
  projectorH: 0.2, // model height in metres (Props.jsx uses this)
  emitterY: 0.22, // world height the beam leaves the projector at
  sheetY: 1.25, // world height of the sheet's centre
  sheetH: 0.8, // sheet height in world units…
  sheetW: 0.8 / Math.SQRT2, // …and A4-ish width to match the canvas
}

// Room left around the sheet when reading. Wide screens are limited by the
// page's height, so they keep a margin for the title bar and the page dots;
// portrait phones are limited by its width, where a hair of gutter is plenty.
const MARGIN_V = 1.18
const MARGIN_H = 1.04

// Where the camera sits to read the sheet head-on, framed so the whole page
// fits whatever the viewport shape is (a portrait phone needs to back off more).
export function cvView(camera) {
  const { position, rotation, sheetY, sheetW, sheetH } = CV_SPOT
  const half = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
  const distV = (sheetH / 2 / half) * MARGIN_V
  const distH = (sheetW / 2 / (half * (camera.aspect || 1))) * MARGIN_H
  const dist = Math.max(distV, distH)
  const nx = Math.sin(rotation) // the sheet's facing normal
  const nz = Math.cos(rotation)
  return {
    pos: [position[0] + nx * dist, sheetY, position[2] + nz * dist],
    target: [position[0], sheetY, position[2]],
  }
}

// A canvas texture holding the current CV page, repainted whenever you turn one.
function useCvTexture(page) {
  const gl = useThree((s) => s.gl)
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = PAGE_W
    c.height = PAGE_H
    return c
  }, [])
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.anisotropy = gl.capabilities.getMaxAnisotropy()
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    return t
  }, [canvas, gl])

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    const paint = () => {
      drawPage(ctx, CV_PAGES, page)
      tex.needsUpdate = true
    }
    paint()
    // Inter comes from Google Fonts and the portrait is a separate request, so
    // the first paint lands without them — repaint as each one turns up.
    let live = true
    document.fonts?.ready?.then(() => live && paint())
    loadPortrait(import.meta.env.BASE_URL + CV_PHOTO).then(() => live && paint())
    return () => {
      live = false
    }
  }, [canvas, tex, page])

  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

// Scanlines, a rolling refresh bar, chromatic fringing and a glitch pulse when
// the page turns — the sheet is drawn flat, everything "holo" happens here.
const SHEET_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const SHEET_FRAG = `
  uniform sampler2D map;
  uniform float time;
  uniform float glitch;   // 0..1, pulses when the page changes
  uniform float opacity;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    vec2 uv = vUv;

    // horizontal tearing while glitching
    float band = hash(floor(uv.y * 44.0) + floor(time * 24.0));
    uv.x += glitch * (band - 0.5) * 0.05;

    // chromatic split (always a touch, more while glitching)
    float split = 0.0007 + glitch * 0.003;
    vec4 c = texture2D(map, uv);
    float r = texture2D(map, uv + vec2(split, 0.0)).r;
    float b = texture2D(map, uv - vec2(split, 0.0)).b;
    vec3 col = vec3(r, c.g, b);
    float a = c.a;

    // fine scanlines + a bright bar rolling up the sheet
    float scan = 0.88 + 0.12 * sin(uv.y * 880.0 - time * 7.0);
    float bar = 1.0 - smoothstep(0.0, 0.055, abs(fract(uv.y - time * 0.11) - 0.5));
    col = col * scan + bar * 0.14 * vec3(0.35, 0.9, 1.0);

    // mains-hum flicker
    float flicker = 0.95 + 0.05 * sin(time * 31.0) * sin(time * 9.7);

    // the very edge of a projection is never crisp
    vec2 d = abs(uv - 0.5) * 2.0;
    float edge = 1.0 - smoothstep(0.9, 1.0, max(d.x, d.y));

    gl_FragColor = vec4(col * flicker, a * opacity * edge);
  }
`

// The cone of light the sheet sits inside: brightest at the lens, gone by the
// top, with a slow ripple round it.
const BEAM_FRAG = `
  uniform float time;
  uniform vec3 colour;
  varying vec2 vUv;
  void main() {
    float up = 1.0 - smoothstep(0.0, 0.95, vUv.y);       // fade with height
    float ring = 0.75 + 0.25 * sin(vUv.x * 40.0 + time * 1.6);
    float band = 0.85 + 0.15 * sin(vUv.y * 30.0 - time * 2.4);
    gl_FragColor = vec4(colour, up * 0.16 * ring * band);
  }
`
const BEAM_VERT = SHEET_VERT

const MOTES = 46

export default function Hologram() {
  const { page, open } = useCvStore()
  const tex = useCvTexture(page)
  const sheet = useRef()
  const motes = useRef()
  const glitch = useRef(1) // fires on mount and on every page turn
  const settle = useRef(0) // 0 = idle drift, 1 = held still for reading

  // Built by hand rather than as <shaderMaterial uniforms={…} />: R3F hands the
  // element its own copy of the uniforms object, so writes to ours never reached
  // the GPU and the sheet came out blank.
  const sheetMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { map: { value: null }, time: { value: 0 }, glitch: { value: 0 }, opacity: { value: 1 } },
        vertexShader: SHEET_VERT,
        fragmentShader: SHEET_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  )
  const beamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, colour: { value: new THREE.Color('#6fe4ff') } },
        vertexShader: BEAM_VERT,
        fragmentShader: BEAM_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  useEffect(() => {
    sheetMat.uniforms.map.value = tex
  }, [tex, sheetMat])
  useEffect(
    () => () => {
      sheetMat.dispose()
      beamMat.dispose()
    },
    [sheetMat, beamMat],
  )
  useEffect(() => {
    glitch.current = 1 // the page just changed — flicker as it reforms
  }, [page])

  const { position, rotation, emitterY, sheetY, sheetH, sheetW } = CV_SPOT
  const beamTop = sheetY + sheetH / 2 + 0.06
  const beamH = beamTop - emitterY

  // Dust motes drifting up the beam. Seeded deterministically so they don't pop
  // to a new arrangement on every hot reload.
  const moteGeom = useMemo(() => {
    const pos = new Float32Array(MOTES * 3)
    for (let i = 0; i < MOTES; i++) {
      const a = i * 2.39996 // golden angle — an even spiral, no clumping
      const r = 0.06 + (i / MOTES) * 0.34
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = (i / MOTES) * beamH
      pos[i * 3 + 2] = Math.sin(a) * r
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [beamH])
  useEffect(() => () => moteGeom.dispose(), [moteGeom])

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const t = state.clock.elapsedTime
    sheetMat.uniforms.time.value = t
    beamMat.uniforms.time.value = t
    glitch.current = Math.max(0, glitch.current - dt * 2.6)
    sheetMat.uniforms.glitch.value = glitch.current

    // Reading holds the sheet perfectly still and square-on; otherwise it drifts.
    settle.current += ((open ? 1 : 0) - settle.current) * Math.min(1, dt * 6)
    const drift = 1 - settle.current
    if (sheet.current) {
      sheet.current.position.y = sheetY + Math.sin(t * 0.9) * 0.022 * drift
      sheet.current.rotation.y = rotation + Math.sin(t * 0.55) * 0.055 * drift
      sheet.current.rotation.x = Math.sin(t * 0.7 + 1.3) * 0.02 * drift
    }

    // motes rise through the beam and loop back to the lens
    const p = moteGeom.attributes.position
    for (let i = 0; i < MOTES; i++) {
      let y = p.array[i * 3 + 1] + dt * (0.05 + (i % 5) * 0.012)
      if (y > beamH) y -= beamH
      p.array[i * 3 + 1] = y
    }
    p.needsUpdate = true
  })

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* cone of light */}
      <mesh position={[0, emitterY + beamH / 2, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.38, 0.07, beamH, 28, 1, true]} />
        <primitive object={beamMat} attach="material" />
      </mesh>

      {/* dust caught in the beam */}
      <points ref={motes} position={[0, emitterY, 0]} geometry={moteGeom} renderOrder={3}>
        <pointsMaterial
          color="#a9f2ff"
          size={0.014}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* the CV sheet itself */}
      <mesh ref={sheet} position={[0, sheetY, 0]} rotation={[0, rotation, 0]} renderOrder={4}>
        <planeGeometry args={[sheetW, sheetH]} />
        <primitive object={sheetMat} attach="material" />
      </mesh>

      {/* a little spill of light on the floor and up the sheet */}
      <pointLight position={[0, emitterY + 0.2, 0]} color="#6fe4ff" intensity={1.4} distance={2.6} decay={2} />
    </group>
  )
}
