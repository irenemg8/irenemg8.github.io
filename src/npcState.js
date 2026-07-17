import * as THREE from 'three'
import { NPC_SPAWNS } from './data/galleryLayout.js'

// Shared state for the wandering gallery visitors. It lives outside React so the
// AI (GalleryNPCs), the chat director (npcChat) and the close-up camera
// (PlayerController) all read the same positions without prop-drilling.
export const N = 6

// Cozy, gender-neutral visitor names (Pokémon-villager flavour).
export const NPC_NAMES = ['Wren', 'Pip', 'Otto', 'Maud', 'Bram', 'Nell']
// No red in here — red belongs to the player, and to the player alone. Maud's
// orange sits between the player's red and the guides' yellow, so she reads as
// neither.
export const NPC_COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#10b981', '#6366f1']

export const AGENTS = Array.from({ length: N }, (_, i) => {
  const spawn = NPC_SPAWNS[i % NPC_SPAWNS.length].position
  // fan them out a little so they don't all start inside each other
  const ring = ((i / NPC_SPAWNS.length) | 0) * 0.55
  const angle = i * 2.4
  return {
    index: i,
    name: NPC_NAMES[i % NPC_NAMES.length],
    color: NPC_COLORS[i % NPC_COLORS.length],
    pos: new THREE.Vector3(spawn[0] + Math.sin(angle) * ring, 0, spawn[2] + Math.cos(angle) * ring),
    dir: new THREE.Vector3(0, 0, 1), // smoothed steering direction (no snapping)
    slot: new THREE.Vector3(), // where to stand when meeting someone for a chat
    heading: Math.PI,
    mode: 'walk', // walk | view | sit | meet | chat
    target: null,
    timer: 0,
    stuck: 0,
    turn: i % 2 ? 1 : -1, // preferred side to swerve round obstacles (no dithering)
    flipped: false, // already tried swerving the other way out of this jam
    speed: 0, // measured, not intended — drives the walk/idle animation
    seatY: 0,
    partner: -1,
  }
})

// A visitor is free to be pulled into a chat only while pottering about.
export const isFree = (a) => a.mode === 'walk' || a.mode === 'view'
