import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { fitToHeight } from './utils/fit.js'
import { playerPos } from './playerState.js'
import { grut as grutState } from './grutState.js'
import { CV_SPOT } from './Hologram.jsx'

// Shared raycaster for grut's wall-aware following (whisker steering).
const _ray = new THREE.Raycaster()
_ray.firstHitOnly = true
const _o = new THREE.Vector3()
const _d = new THREE.Vector3()
const FOLLOW_R = 0.45 // grut's body clearance off walls while trailing the player
const WANDER_R = 0.18 // …and while pottering about, where he can get much closer
const WHISKERS = [-0.6, 0, 0.6] // feeler angles: left, ahead, right

// Distance to the nearest wall from (x,z) along (dx,dz), or Infinity if clear.
function wallDist(collider, x, z, dx, dz, far) {
  if (!collider) return Infinity
  const l = Math.hypot(dx, dz)
  if (l < 1e-6) return Infinity
  _d.set(dx / l, 0, dz / l)
  _ray.far = far
  _ray.near = 0
  _ray.set(_o.set(x, 0.3, z), _d)
  const hits = _ray.intersectObject(collider)
  return hits.length ? hits[0].distance : Infinity
}

// Decorative props (cardboard boxes, etc.). Each:
//  url        : model
//  position   : floor position [x, y, z]
//  rotation   : Y-axis spin / yaw (radians) — which way it faces
//  rotationY  : extra yaw, added to `rotation` (radians, optional)
//  rotationX  : pitch / tilt — nose up-down (radians, optional)
//  rotationZ  : roll — lean sideways (radians, optional)
//  heightM    : real height in metres (or `height` in world units)
//  say        : dialogue lines — makes the prop talkable (approach + F)
//  sound      : clip played when the chat opens (optional)
//  cue        : wording of its F prompt (optional; defaults to "Press F to chat")
//  radius     : how close you must get before its F prompt shows, in world
//               units (optional; defaults to TALK_R in Scene.jsx)
//  camDist    : close-up camera distance while chatting (optional; small = a
//               tight shot for little things like Nilo's notes)
//  camY/aimY  : camera height / look-at height above the prop base (optional)
//
// Yaw (Y) is applied FIRST, then pitch/roll around the model's OWN centre, so
// the three axes stay decoupled: set the facing with `rotation`, then tilt with
// rotationX/rotationZ and the prop tips in place instead of the axes fighting.
const UNITS_PER_M = 1.7 / 1.6
const propHeight = (p) => (p.heightM != null ? p.heightM * UNITS_PER_M : (p.height ?? 0.5))
const propYaw = (p) => (p.rotation ?? 0) + (p.rotationY ?? 0)

export const PROPS = [
  { url: '/models/box_set.glb', position: [-2.8, 0, 7], rotation: 2.4, heightM: 1.8 }, //ya
  { url: '/models/psx_boxes.glb', position: [2.4, 0.96, -7], rotation: -0.5, heightM: 0.7 }, //ya
    { url: '/models/carton_box.glb', position: [0, 0.3, 0.3], rotation: 0.8, heightM: 0.2 }, //ya
  { url: '/models/carton_closed.glb', position: [-1.8, 0, -6.5], rotation: -0.3, heightM: 0.55 },
  // Nilo, the pug — hangs out near his watermelon box
  {
    url: '/models/pug.glb',
    position: [3.25, 0.65, -0.8],
    rotationY: 0,
    rotationX: 0.8,
    rotationZ: 0,
    heightM: 0.3,
    sound: 'audio/pug_bark.mp3',
    cue: 'Press F to pet Nilo 🐶',
    pet: true, // petting him pops little hearts (see PropTalk + Hearts)
    say: [
      'My owner said if I hold still like a statue for five minutes, she’ll refill my green treat bowl. 🐶',
      'I can already imagine how juicy that watermelon must be… 💦',
    ],
  },

  { url: '/models/cardboard_staircase.glb', position: [3.4, 0, -0.2], rotation: -1.6, heightM: 1.1 },
  // Nilo's dog bowl + bed
  { url: '/models/dog_bowl.glb', position: [2.6, 0, -0.9], rotation: 0, heightM: 0.07, color: '#3aa34a' },
  { url: '/models/dog_bed.glb', position: [2.9, 1, -2.3], rotation: 0.4, heightM: 0.18 },
  // Beach vibes near the beach box [2.2, 0, -6.8]
  { url: '/models/palm_tree.glb', position: [0.7, 0, -6.8], rotation: 0.4, heightM: 2.8 },
  { url: '/models/coconut.glb', position: [0.8, -0.03, -6.3], rotation: 0, heightM: 0.2 },
  { url: '/models/beer_bottle.glb', position: [2.3, -0.17, -5.4], rotationZ: 1.6, heightM: 0.4 },
  // More cardboard decor + a little frog
  // The guitar only pipes up if you come right up to it (radius), so it doesn't
  // butt in while you're passing by.
  {
    url: '/models/cardboard_guitar.glb',
    position: [-3, 0, -3.4],
    rotation: 2.3,
    heightM: 0.9,
    radius: 0.8,
    cue: 'Press F to play 🎵',
    sound: 'audio/guitar.mp3',
    say: [
      'That tune drifting round the gallery? It’s “Lake”. 🎵',
      'Irene grew up with it. She says it still sounds like being nine years old on the sofa with a Nintendo DS.',
      'By the way — did you know she plays the clarinet and the piano?',
      'Go on, then: guess her favourite composer. I’ll never tell. 🎹',
    ],
  },
  { url: '/models/cardboard_decorations.glb', position: [-2.8, 0, -0.15], rotation: 0, heightM: 2 },
  { url: '/models/frog.glb', position: [-2.5, 1, 2], rotation: -1.6, heightM: 0.8 },

    { url: '/models/cardboard_cloud.glb', position: [2, 3.5, 5.5], rotation: -0.4, heightM: 0.4 },
        { url: '/models/cardboard_cloud.glb', position: [-1, 3.5, 3], rotation: 0.2, heightM: 0.3 },

          { url: '/models/cardboard_cloud.glb', position: [1.8, 3.7, 0], rotation: -0.2, heightM: 0.3 },
        { url: '/models/cardboard_cloud.glb', position: [-1.7, 3.2, -4.5], rotation: -0.3, heightM: 0.35 },


    { url: '/models/cardboard_cloud.glb', position: [-3.1, 0.65, 2.3], rotation: 1.9, heightM: 0.09 },
    { url: '/models/cardboard_cloud.glb', position: [-2.4, 0.6, 1.7], rotation: -1.9, heightM: 0.1 },



  { url: '/models/lemonade.glb', position: [-1.9, 0.925, -2.55],rotation: -1.6, heightM: 0.35 },
  // on the +X wall behind the study box [2.6, 0, 2]
  { url: '/models/sticky_note.glb', position: [3.35, 0.7, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.035 },
    { url: '/models/sticky_note.glb', position: [3.5, 0.7, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.03 },
        { url: '/models/sticky_note.glb', position: [3.7, 0.5, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
                { url: '/models/sticky_note.glb', position: [3.15, 0.4, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.025 },
                        { url: '/models/sticky_note.glb', position: [3.5, 0.3, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
                                                { url: '/models/sticky_note.glb', position: [4, 0.2, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.025 },
  // Nilo's easter-egg notes — tiny scraps the pug has left about, each with a
  // little croquette-flavoured wisdom. Come right up (small radius) and press F
  // for a close-up read. Copy this block for each note; just change position +
  // the `say` line.
  {
    url: '/models/nota_nilo.glb',
    position: [2.5, 0.7, 7.05],
    rotation: 0.5,
    heightM: 0.2,
    radius: 0.7,
    cue: 'Press F to find out 🐾',
    sound: 'audio/nota_sorpresa.mp3',
    say: [
      'Wait— WHAT?! What is this?! 😲',
      'Oh! Nilo the pug left this note here... 🐶',
      '_“When life gives you kibble, don’t sit there wishing it were lemons — crunch it like it’s the best thing that ever happened to you. Because it is.” 🐾_',
    ],
    camDist: 0.42,
    camY: 0.12,
    aimY: 0.1,
    camAngle: 0.757, // fixed camera side (measured from the note's face normal)
  },
                                                            { url: '/models/sticky_note.glb', position: [3.85, 0.8, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
                                                                        { url: '/models/sticky_note.glb', position: [4, 0.6, 2.88], rotationX: -1.6, rotationX: 1.6, heightM: 0.02 },
  { url: '/models/cardboard_cactus.glb', position: [2.5, 0, 7], rotation: -2.7, heightM: 1.5 },
    { url: '/models/cardboard_cactus.glb', position: [0, 0, 7.25], rotation: 2.8, heightM: 1.25 },

  { url: '/models/pile_of_books.glb', position: [2.1, 1, 1.6], rotation: 2.2, heightM: 0.3 },
  // Animated llama playing its "lookaround" clip on loop
  {
    url: '/models/llama.glb',
    position: [1.1, 0, 7.2],
    rotation: -2.3,
    heightM: 1.2,
    anim: 'lookaround',
    sound: 'audio/llama.mp3',
    say: [
      'Psst… I snuck in here when nobody was looking. 🦙',
      "Now I'm playing statue — let's see how long it takes them to notice!",
    ],
  },
  { url: '/models/cardboard_cloud_b.glb', position: [1.5, 2, 7.5], rotation: 0, heightM: 0.5 },
    { url: '/models/cardboard_cloud_b.glb', position: [0.6, 1.8, 7.4], rotation: 0, heightM: 0.3 },

  // Newly added — rough placements; adjust position/rotation/heightM to taste.
  // Baby-groot toddling about on the floor: wanders within a patch, running as
  // it moves and idling / looking sad when it stops. scaleMul 0.01 undoes its
  // FBX import scale so it sizes correctly. (Reposition / grow the radius freely.)
  {
    url: '/models/grut_stickman.glb',
    position: [-1.2, 0, -0.6],
    rotation: 0.4,
    heightM: 0.3,
    scaleMul: 0.01,
    anim: 'Idle',
    wander: { radius: 1.5, speed: 0.4, walk: 'Run', idles: ['Idle', 'Idle_Sad'] },
    radius: 0.5, // very small — you have to be right next to him
    cue: 'Press F to say hi 🌱',
    sound: 'audio/i_am_groot.mp3',
    intro: ['I am Groot 🌱'],
    follow: true, // dialogue offers to come along / stop (see PropTalk)
  },
  { url: '/models/trainer_red.glb', position: [-2.4, 0.29, -2.44], rotation: 0, heightM: 0.15, spin: { every: 2.5, deg: -90 } },
  // black_tie is now worn by the door guides (see Guides.jsx), not a floor prop.
  // Toy figures — rough placements, adjust position / rotation / heightM to taste.
  // The CV hologram's tech corner (+X wall, between the pug and beach boxes).
  // The projector is a plain prop so it gets a collider and placement for free;
  // the sheet of light it beams out lives in Hologram.jsx and reads the same
  // CV_SPOT, so moving the corner is a one-line change over there.
  {
    url: '/models/hologram_projector.glb',
    position: CV_SPOT.position,
    rotation: CV_SPOT.rotation,
    heightM: CV_SPOT.projectorH,
  },
  // An articulated arm working away on a shelf. Its rig keeps the FBX unit
  // scale, which defeats fitToHeight (the arm came out 100x too small), so
  // `poseFit` re-measures it from what's actually drawn — see refitToPose below.
  {
    url: '/models/robot_arm.glb',
    position: [2.9, 1, 2.5],
    rotation: -1.6,
    heightM: 0.7,
    poseFit: true,
    anim: 'ArmAction',
    pingPong: true, // reach out, then rewind back — no snap at the end of the clip
  },
  { url: '/models/rex.glb', position: [-3, 1, -2.4], rotation: 0.6, heightM: 0.4 },
  { url: '/models/alien.glb', position: [-2.7, 0.92, -2], rotation: 0.8, rotationX:-1.3, heightM: 0.25 },
  { url: '/models/guido.glb', position: [-2.1, 1, -1.5], rotation: 0.6, heightM: 0.4 },
  { url: '/models/hamm.glb', position: [-3.1, 1, -1.6], rotation: 1.6, heightM: 0.35 },








]

// Box colliders (position-only, world space) so you can't walk through them.
// Wandering props are skipped: their collider would be baked at the spawn point
// and stay there, leaving an invisible wall wherever they started — and, since
// they steer by raycasting this very collider, walling themselves in.
export function propColliderGeometries(gltfs) {
  const out = []
  PROPS.forEach((p, i) => {
    const g0 = gltfs[i]
    if (!g0 || p.wander) return
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
        .multiply(new THREE.Matrix4().makeRotationY(propYaw(p)))
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

function Prop(p) {
  const { url, position, height, heightM, color } = p
  const outer = useRef()
  const floats = p.float ?? url.includes('cloud') // clouds bob gently
  // Stepped spin: snap `deg` degrees every `every` seconds (e.g. trainer_red).
  const spin = p.spin // { every: seconds, deg: degrees per step }
  // deterministic per-prop phase so they drift out of sync (no randomness)
  const phase = position[0] * 1.7 + position[2] * 0.9
  useFrame((state) => {
    if (!outer.current) return
    const t = state.clock.elapsedTime
    if (floats) {
      outer.current.position.y = position[1] + Math.sin(t * 0.8 + phase) * 0.12
      outer.current.rotation.y = propYaw(p) + Math.sin(t * 0.5 + phase) * 0.05
    } else if (spin) {
      const steps = Math.floor(t / spin.every) // whole snaps so far
      outer.current.rotation.y = propYaw(p) + steps * (spin.deg * Math.PI) / 180
    }
  })
  const { scene } = useGLTF(url)
  const { model, fitScale, yOffset, cx: modelCx, cz: modelCz } = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        if (color) {
          // clone the material so we don't tint other instances of this model
          o.material = o.material.clone()
          o.material.color = new THREE.Color(color)
          if ('map' in o.material) o.material.map = null // solid colour, drop texture
          if ('metalness' in o.material) o.material.metalness = 0 // matte, not metal
          if ('roughness' in o.material) o.material.roughness = 0.85
          if ('metalnessMap' in o.material) o.material.metalnessMap = null
          if ('roughnessMap' in o.material) o.material.roughnessMap = null
          o.material.needsUpdate = true
        }
      }
    })
    const fit = fitToHeight(c, propHeight({ height, heightM }))
    return { model: c, fitScale: fit.scale, yOffset: fit.yOffset, cx: fit.cx, cz: fit.cz }
  }, [scene, height, heightM, color])
  const midY = propHeight(p) / 2 // tilt pivots around the model's own centre
  // A spinning prop turns about its OWN vertical axis: recentre it horizontally
  // so it rotates in place instead of orbiting around an off-centre origin.
  const cx = spin ? p.cx ?? modelCx : 0
  const cz = spin ? p.cz ?? modelCz : 0
  return (
    // 1) yaw around the floor position (ref lets floating props bob in useFrame)
    <group ref={outer} position={position} rotation={[0, propYaw(p), 0]}>
      {/* recentre (only for spinning props) so the spin axis is the model's own */}
      <group position={[-cx, 0, -cz]}>
      {/* 2) pitch/roll about the model centre (tips in place, no fly-off) */}
      <group position={[0, midY, 0]} rotation={[p.rotationX ?? 0, 0, p.rotationZ ?? 0]}>
        <group position={[0, -midY, 0]}>
          <group scale={fitScale} position={[0, yOffset, 0]}>
            <primitive object={model} />
          </group>
        </group>
      </group>
      </group>
    </group>
  )
}

// A prop with a skinned animation. By default plays (on loop) the clip whose
// name contains `anim`. Extra options:
//  pingPong: true             — on reaching the end, play the clip BACKWARDS
//                               instead of snapping to the start (the robot arm
//                               — its routine ends mid-reach, so a plain loop
//                               jumps). Alternates forever.
//  animRandom: [names]        — cycle random clips every 1.5–4s (crossfaded)
//  wander: { radius, speed,   — potter about within `radius` of the spawn,
//            walk, idles }       playing `walk` while moving and a random
//                                `idles` clip while paused (e.g. grut).
// Corrective fit for rigs whose bind pose carries an import scale (the robot
// arm): fitToHeight measures their raw geometry instead of the posed skeleton,
// so the model lands at the wrong size AND off the floor. `poseFit` ignores that
// measurement and sizes the prop from what's really being drawn — which means
// changing `heightM` keeps working instead of needing a new magic number.
//
// It can't be done in one frame: a freshly cloned skeleton reads as a box tens
// of thousands of units across until the bones are posed. So we let it settle,
// sample the animation for a few frames, and fit to the tallest pose we saw —
// one correction, no per-frame pulsing. Only for props with no rotationX /
// rotationZ, since the tilt pivots would skew the grounding.
const _fitBox = new THREE.Box3()
const _fitTmp = new THREE.Box3()
const REFIT_SKIP = 8 // frames to let the rig settle before believing it
const REFIT_SAMPLES = 12 // frames of animation sampled before committing

function measurePose(group) {
  _fitBox.makeEmpty()
  let any = false
  group.traverse((o) => {
    if (!o.isSkinnedMesh) return
    o.skeleton?.update?.()
    o.computeBoundingBox()
    if (o.boundingBox) {
      _fitBox.union(_fitTmp.copy(o.boundingBox).applyMatrix4(o.matrixWorld))
      any = true
    }
  })
  if (!any || _fitBox.isEmpty()) return null
  return Number.isFinite(_fitBox.min.y) && Number.isFinite(_fitBox.max.y) ? _fitBox : null
}

// Returns true once it's done with the prop (fitted, or given up on it).
function refitToPose(st, group, targetH, floorY) {
  st.n += 1
  if (st.n <= REFIT_SKIP) return false
  const box = measurePose(group)
  if (box) {
    st.minY = Math.min(st.minY, box.min.y)
    st.maxY = Math.max(st.maxY, box.max.y)
  }
  if (st.n < REFIT_SKIP + REFIT_SAMPLES) return false

  const h = st.maxY - st.minY
  if (!(h > 1e-6) || !Number.isFinite(h)) return true // unmeasurable — leave it be
  const k = targetH / h
  // Children scale about the group's own origin, so that's where the base lands
  // once k is applied; lift the group by whatever's left to reach the floor.
  const originY = group.matrixWorld.elements[13]
  const baseAfter = (st.minY - originY) * k + originY
  group.scale.multiplyScalar(k)
  group.position.y += floorY - baseAfter
  return true
}

function AnimatedProp(p) {
  const { url, position, height, heightM, anim } = p
  const group = useRef() // inner (animated) group
  const outer = useRef() // outermost group — moved around for wandering
  const play = useRef(() => {}) // set once actions are ready; called from useFrame
  const st = useRef(null) // wander state
  // poseFit props re-measure themselves over the first few frames (see above)
  const refit = useRef({ done: !p.poseFit, n: 0, minY: Infinity, maxY: -Infinity })
  const { scene, animations } = useGLTF(url)
  const { model, fitScale, yOffset } = useMemo(() => {
    const c = cloneSkeleton(scene) // proper skeleton clone for skinned meshes
    c.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
      if (o.isSkinnedMesh) o.frustumCulled = false
    })
    const fit = fitToHeight(c, propHeight({ height, heightM }))
    return { model: c, fitScale: fit.scale, yOffset: fit.yOffset }
  }, [scene, height, heightM])
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    const list = Object.values(actions).filter(Boolean)
    if (!list.length) return
    const find = (name) =>
      name && list.find((ac) => ac.getClip().name.toLowerCase().includes(name.toLowerCase()))

    // Crossfade to a named clip (used by wander + animRandom). Remembers the
    // current action so it only switches when the clip actually changes.
    let current = null
    const loop = p.pingPong ? THREE.LoopPingPong : THREE.LoopRepeat
    play.current = (name) => {
      const next = find(name) || list[0]
      if (next === current) return
      next.reset().setLoop(loop, Infinity).fadeIn(0.25).play()
      current?.fadeOut(0.25)
      current = next
    }

    // wander: a tiny roam-in-a-circle state machine, driven in useFrame below.
    if (p.wander) {
      st.current = {
        mode: 'pause',
        timer: 0.4,
        x: 0,
        z: 0,
        tx: 0,
        tz: 0,
        heading: propYaw(p),
        spawn: [position[0], position[1], position[2]], // wander is relative to this
        wx: position[0], // live world position
        wz: position[2],
        turn: 1, // preferred swerve side when avoiding walls
        stuck: 0,
      }
      play.current(p.wander.idles?.[0] || 'Idle')
      if (import.meta.env.DEV) window.__wander = st.current // dev: watch where it roams
      return () => list.forEach((ac) => ac.stop())
    }

    // animRandom: cycle through a set of clips at random.
    if (p.animRandom?.length) {
      let timer = null
      const tick = () => {
        play.current(p.animRandom[(Math.random() * p.animRandom.length) | 0])
        timer = setTimeout(tick, 1500 + Math.random() * 2500)
      }
      tick()
      return () => {
        clearTimeout(timer)
        list.forEach((ac) => ac.stop())
      }
    }

    // otherwise: a single clip named by `anim` (fall back to the first one)
    play.current(anim)
    if (import.meta.env.DEV) window.__llama = current
    return () => list.forEach((ac) => ac.stop())
  }, [actions, anim, p.animRandom, p.wander])

  // grut's movement, driven every frame. Two modes:
  //  • following the player (grut.following): trail them, steering round walls
  //    with three feelers so it doesn't get stuck — stops a step short.
  //  • wandering: roam within `radius` of the spawn, running while moving and
  //    idling / looking sad when paused. Freezes to face you when you come to
  //    chat. grut.wx/wz track its live world position (published to the speaker).
  useFrame((_, dtRaw) => {
    // Size a poseFit rig from its real pose, keeping it hidden until it's right
    // (it spends those frames at a nonsense scale).
    const rf = refit.current
    if (!rf.done && group.current) {
      rf.done = refitToPose(rf, group.current, propHeight(p), position[1])
      group.current.visible = rf.done
    }

    const w = p.wander
    const s = st.current
    if (!w || !s || !outer.current) return
    const dt = Math.min(dtRaw, 0.05)
    const idles = w.idles ?? ['Idle', 'Idle_Sad']
    const walk = w.walk ?? 'Run'

    if (grutState.following) {
      // --- follow the player, avoiding walls ---
      const speed = (w.followSpeed ?? 0.9)
      let dx = playerPos.x - s.wx
      let dz = playerPos.z - s.wz
      const gap = Math.hypot(dx, dz)
      if (gap > 0.85) {
        dx /= gap
        dz /= gap
        let sx = dx
        let sz = dz
        // wall feelers: steer along anything close ahead
        const col = grutState.collider
        const look = Math.min(1.0, gap)
        for (const a of WHISKERS) {
          const ca = Math.cos(a)
          const sa = Math.sin(a)
          const fx = dx * ca - dz * sa
          const fz = dx * sa + dz * ca
          const hit = wallDist(col, s.wx, s.wz, fx, fz, look)
          if (hit >= look) continue
          const wgt = (1 - hit / look) * 1.6
          sx += -fz * wgt * s.turn - fx * wgt * 0.5
          sz += fx * wgt * s.turn - fz * wgt * 0.5
        }
        const l = Math.hypot(sx, sz) || 1
        const nx = sx / l
        const nz = sz / l
        const step = speed * dt
        const px = s.wx
        const pz = s.wz
        if (wallDist(col, px, pz, nx, nz, step + FOLLOW_R) > step + FOLLOW_R) {
          s.wx += nx * step
          s.wz += nz * step
        } else {
          // blocked head-on: slide along whichever axis is open
          if (wallDist(col, px, pz, nx, 0, Math.abs(nx) * step + FOLLOW_R) > Math.abs(nx) * step + FOLLOW_R) s.wx += nx * step
          if (wallDist(col, s.wx, pz, 0, nz, Math.abs(nz) * step + FOLLOW_R) > Math.abs(nz) * step + FOLLOW_R) s.wz += nz * step
        }
        const moved = Math.hypot(s.wx - px, s.wz - pz)
        if (moved > 1e-4) s.heading = Math.atan2(nx, nz)
        // stuck? flip the preferred swerve side so it rounds the other way
        s.stuck = moved < step * 0.3 ? s.stuck + dt : 0
        if (s.stuck > 0.6) {
          s.turn = -s.turn
          s.stuck = 0
        }
        play.current(walk)
      } else {
        // close enough — stand and face the player
        play.current(idles[0])
        const hx = playerPos.x - s.wx
        const hz = playerPos.z - s.wz
        if (Math.hypot(hx, hz) > 0.01) {
          let d = Math.atan2(hx, hz) - s.heading
          d = Math.atan2(Math.sin(d), Math.cos(d))
          s.heading += d * Math.min(1, dt * 8)
        }
      }
      // keep the wander offset in sync with where grut ended up, so it resumes
      // wandering from here (relative to a spawn re-anchored at its current spot)
      s.spawn[0] = s.wx
      s.spawn[2] = s.wz
      s.x = 0
      s.z = 0
      s.mode = 'pause'
      s.timer = 0.3
    } else {
      // --- wander within radius of spawn ---
      const radius = w.radius ?? 0.8
      const speed = w.speed ?? 0.35
      s.wx = s.spawn[0] + s.x
      s.wz = s.spawn[2] + s.z
      const nearPlayer = Math.hypot(playerPos.x - s.wx, playerPos.z - s.wz) < (p.radius ?? 0.6) + 0.4
      if (nearPlayer) {
        play.current(idles[0])
        const hx = playerPos.x - s.wx
        const hz = playerPos.z - s.wz
        if (Math.hypot(hx, hz) > 0.01) {
          let d = Math.atan2(hx, hz) - s.heading
          d = Math.atan2(Math.sin(d), Math.cos(d))
          s.heading += d * Math.min(1, dt * 8)
        }
      } else if (s.mode === 'walk') {
        const dx = s.tx - s.x
        const dz = s.tz - s.z
        const d = Math.hypot(dx, dz)
        if (d < 0.03) {
          s.mode = 'pause'
          s.timer = 1.2 + Math.random() * 2.5
          play.current(idles[(Math.random() * idles.length) | 0])
        } else {
          const step = Math.min(speed * dt, d)
          const nx = dx / d
          const nz = dz / d
          // Wandering used to ignore the world entirely, so he strolled straight
          // through the benches. Same collider the follow mode already steers
          // around — but he's tiny, so he gets a much smaller berth than the
          // whiskers use, or he'd be repelled from half his own patch.
          const reach = step + WANDER_R
          if (wallDist(grutState.collider, s.wx, s.wz, nx, nz, reach) > reach) {
            s.x += nx * step
            s.z += nz * step
            s.heading = Math.atan2(dx, dz)
            play.current(walk)
          } else {
            // something in the way — give up on this spot and pick another
            s.mode = 'pause'
            s.timer = 0.4 + Math.random() * 0.8
            play.current(idles[(Math.random() * idles.length) | 0])
          }
        }
      } else {
        s.timer -= dt
        if (s.timer <= 0) {
          const ang = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random()) * radius
          s.tx = Math.cos(ang) * r
          s.tz = Math.sin(ang) * r
          s.mode = 'walk'
        }
      }
    }

    outer.current.position.set(s.wx, s.spawn[1], s.wz)
    outer.current.rotation.y = s.heading
    // Publish grut's live position so talk proximity / close-up follow it
    // (SPEAKERS maps `position: p.position`, the same array reference).
    position[0] = s.wx
    position[2] = s.wz
  })

  const midY = propHeight(p) / 2
  // scaleMul corrects rigs whose FBX import scale (e.g. 0.01) makes fitToHeight
  // and the skinned render disagree — grut needs 0.01. Feet stay grounded since
  // yOffset scales with it.
  const sm = p.scaleMul ?? 1
  const scale = fitScale * sm
  const yOff = yOffset * sm
  return (
    <group ref={outer} position={position} rotation={[0, propYaw(p), 0]}>
      <group position={[0, midY, 0]} rotation={[p.rotationX ?? 0, 0, p.rotationZ ?? 0]}>
        <group position={[0, -midY, 0]}>
          <group ref={group} scale={scale} position={[0, yOff, 0]}>
            <primitive object={model} />
          </group>
        </group>
      </group>
    </group>
  )
}

export default function Props() {
  return (
    <group>
      {PROPS.map((p, i) =>
        p.anim ? <AnimatedProp key={i} {...p} /> : <Prop key={i} {...p} />,
      )}
    </group>
  )
}

PROPS.forEach((p) => useGLTF.preload(p.url))

// Props that can be talked to (approach + F): position + world height (for the
// close-up camera) + dialogue (plain lines, or an intro/menu, or a follow flag).
export const SPEAKERS = PROPS.filter((p) => p.say || p.follow).map((p) => ({
  position: p.position,
  height: propHeight(p),
  sound: p.sound ?? null,
  radius: p.radius ?? null, // null = use the default range
  cue: p.cue ?? null, // null = the default "Press F to chat" wording
  camDist: p.camDist ?? null, // close-up camera framing overrides (null = auto)
  camY: p.camY ?? null,
  aimY: p.aimY ?? null,
  camAngle: p.camAngle ?? null, // fixed viewing side (null = from the player's side)
  lines: p.say,
  intro: p.intro ?? null,
  follow: p.follow ?? false, // grut: dialogue offers to follow / stop following
  pet: p.pet ?? false, // nilo: petting pops hearts
}))
