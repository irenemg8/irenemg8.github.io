import { NPC_SPAWNS, DOORS, ARTWORKS, benchSeats } from './data/galleryLayout.js'

// Coloured pins so you can see where spawns / doors / artwork spots / bench
// seats are and tell me what to move. Toggle with the HUD button.
function Pin({ position, color, height = 1.6, r = 0.28 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r, r + 0.12, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, height, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export default function Markers({ show }) {
  if (!show) return null
  return (
    <group>
      {/* green = NPC spawns */}
      {NPC_SPAWNS.map((s, i) => (
        <Pin key={`s${i}`} position={s.position} color="#22c55e" height={2} />
      ))}
      {/* yellow = doors */}
      {DOORS.map((d, i) => (
        <Pin key={`d${i}`} position={d.position} color="#eab308" height={2.6} r={0.4} />
      ))}
      {/* blue = artwork viewpoints */}
      {ARTWORKS.map((a, i) => (
        <Pin key={`a${i}`} position={a.position} color="#3b82f6" height={1.4} />
      ))}
      {/* orange = bench seats (at the seat height so you can tune it) */}
      {benchSeats().map((seat, i) => (
        <Pin key={`b${i}`} position={seat.position} color="#f97316" height={0.6} r={0.18} />
      ))}
    </group>
  )
}
