import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// irenemg8.github.io is a user page -> served from the domain root, so base = '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.hdr'],
  // Force a single three instance so three-mesh-bvh's prototype patch applies
  // to the same BufferGeometry class used by the loaders/utils.
  resolve: { dedupe: ['three'] },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1500,
  },
})
