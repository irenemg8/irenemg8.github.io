// Shared state for the baby-groot follower, read/written outside React so the
// dialogue (App), the follow AI (Props) and the talk proximity (Scene) agree.
export const grut = {
  following: false, // is grut trailing the player?
  collider: null, // BVH collider mesh, for wall-aware following
}
