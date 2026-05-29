import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three'
            if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'react-three'
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('framer-motion')) return 'framer'
          }

          return undefined
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    headers: {
      'Cache-Control': 'max-age=0',
    },
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
  },
})
