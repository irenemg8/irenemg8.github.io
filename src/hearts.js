// Tiny heart-burst emitter. The <Hearts/> component registers its spawn
// callback here; anything can call hearts.burst(x, y, z) to pop a few little
// hearts at a world position (e.g. petting Nilo).
export const hearts = {
  _spawn: null,
  burst(x, y, z) {
    this._spawn?.(x, y, z)
  },
}
