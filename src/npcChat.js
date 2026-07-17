import { useSyncExternalStore } from 'react'
import { AGENTS } from './npcState.js'
import { playerPos } from './playerState.js'

// Two visitors occasionally stop and natter at each other. You can't join in —
// you sidle up and press F to eavesdrop, and the camera frames the pair.
//
// Each script strictly alternates: line 0 is the first speaker (agent `a`),
// line 1 is the second (agent `b`), line 2 is `a` again, and so on.
export const CHAT_SCRIPTS = [
  [
    'Did you see the llama over by the boxes?',
    'The what? Don’t be daft, that’s a statue.',
    'It blinked at me. I’d swear it on my season pass.',
    '…Right. Let’s go and look at a nice painting instead.',
  ],
  [
    'Apparently Irene built this whole gallery herself.',
    'Every wall? Every box?',
    'Every wall, every box, every little cloud up there.',
    'And here’s me, still not finished with my bookshelf.',
  ],
  [
    'Have you tried the Meta glasses over there?',
    'Are they the real thing?',
    'Real enough. Her photos, her projects, the lot.',
    'Brilliant. I’ll have a peek before a queue forms.',
  ],
  [
    'That pug hasn’t moved in ten minutes.',
    'He’s working. Statue duty — very serious business.',
    'What does it pay?',
    'A bowlful of treats, I imagine. Worth it, honestly.',
  ],
  [
    'I keep pressing F at absolutely everything.',
    'That’s the spirit. Boxes, glasses, anyone standing about.',
    'Someone ought to put that on a sign.',
    'Someone did. The two in the yellow caps, by the door.',
  ],
  [
    'Which box was your favourite?',
    'The little house — very Nintendo DS, very nostalgic.',
    'Mine’s the travel one. It’s made me want to book a flight.',
    'Careful. That’s how these things always start.',
  ],
  [
    'Do you reckon she’s still unpacking?',
    'Look at the corner over there — boxes everywhere.',
    'Then she’s not finished with this place yet.',
    'Good. I like a gallery that keeps growing.',
  ],
]

// Live conversation, mutable (read every frame by the AI and the camera).
export const chat = {
  phase: 'off', // off -> meeting (walking together) -> talking (nattering away)
  a: -1,
  b: -1,
  lines: [],
  side: 1, // which side of the pair the camera sits on
  left: 0, // 0 = agent `a` is on screen-left, 1 = agent `b` is
  wait: 0, // give up if they can't reach each other
  timeout: 0, // how long they'll natter before parting, unheard
  cool: 10, // quiet spell before the next pair get chatting
  roomPlus: Infinity, // elbow room for the camera either side of the pair,
  roomMinus: Infinity, // measured by the director when they start talking
}

let state = { near: false, open: false, id: 0 }
const listeners = new Set()

export const chatStore = {
  get: () => state,
  set: (patch) => {
    const next = { ...state, ...patch }
    if (next.near === state.near && next.open === state.open && next.id === state.id) return
    state = next
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export const useChatStore = () => useSyncExternalStore(chatStore.subscribe, chatStore.get)

// The pair, if they're actually mid-conversation (used by the camera).
export function chatPair() {
  if (chat.phase !== 'talking' || chat.a < 0 || chat.b < 0) return null
  return { a: AGENTS[chat.a], b: AGENTS[chat.b] }
}

// Start eavesdropping. Frames the pair from whichever side the player is on, and
// works out who lands on screen-left so the name tag matches what you see.
export function openChat() {
  const pair = chatPair()
  if (!pair) return
  const A = pair.a.pos
  const B = pair.b.pos
  const mx = (A.x + B.x) / 2
  const mz = (A.z + B.z) / 2
  let ux = B.x - A.x
  let uz = B.z - A.z
  const len = Math.hypot(ux, uz) || 1
  ux /= len
  uz /= len
  // Perpendicular to the pair. With the camera at mid + n·side looking back at
  // mid, `a` lands on screen-left when side is +1 (and on the right when -1).
  let s = (playerPos.x - mx) * -uz + (playerPos.z - mz) * ux >= 0 ? 1 : -1
  // Film from your side by default — but if they've stopped against a wall on
  // that side, go round the other way rather than squash the shot.
  const mine = s > 0 ? chat.roomPlus : chat.roomMinus
  const other = s > 0 ? chat.roomMinus : chat.roomPlus
  if (other > mine + 0.4) s = -s
  chat.side = s
  chat.left = s > 0 ? 0 : 1
  chatStore.set({ open: true })
}

// Stop listening, but leave them to it — you can wander back and press F again.
export function closeChat() {
  if (!state.open) return
  chat.timeout = Math.max(chat.timeout, 12)
  chatStore.set({ open: false })
}

// The conversation is over: they say their goodbyes and go their separate ways.
export function endChat(cool = 16 + Math.random() * 12) {
  for (const i of [chat.a, chat.b]) {
    if (i < 0) continue
    const a = AGENTS[i]
    a.mode = 'walk'
    a.partner = -1
    a.target = null // the AI picks somewhere new to potter off to
    a.stuck = 0
  }
  chat.phase = 'off'
  chat.a = -1
  chat.b = -1
  chat.lines = []
  chat.cool = cool
  chatStore.set({ near: false, open: false })
}
