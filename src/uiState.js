// Plain mutable UI flags the render loop reads each frame (same pattern as
// playerState.js). Kept out of React so PlayerController can gate movement
// without a re-render.
export const ui = { welcomeOpen: false }
