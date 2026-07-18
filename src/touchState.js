// Analog movement axes from the on-screen joystick, read each frame by the
// PlayerController (same out-of-React pattern as playerState.js). Screen-space:
// x = right (+), y = down (+); magnitude 0..1 is how far the stick is pushed.
export const touch = { x: 0, y: 0, active: false }
