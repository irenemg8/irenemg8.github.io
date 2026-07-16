import { SPEAKERS as PROP_SPEAKERS } from './Props.jsx'
import { GUIDE_SPEAKERS } from './Guides.jsx'
import { VILLAGER_SPEAKERS } from './Villagers.jsx'

// Every talkable entity, in one list. talkStore.near / .open index into this,
// so proximity (Scene), dialogue (App) and the close-up camera (PlayerController)
// all agree. Props (llama/pug) first, then the door guides, then villagers.
export const TALKERS = [...PROP_SPEAKERS, ...GUIDE_SPEAKERS, ...VILLAGER_SPEAKERS]
