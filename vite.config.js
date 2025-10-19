import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [react()],

    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion'],
    },

    esbuild: {
      // Drop noisy logs in production bundles
      drop: isProd ? ['console', 'debugger'] : [],
    },

    build: {
      sourcemap: false,
      target: 'es2019',
      cssCodeSplit: true,
      minify: 'esbuild',
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          // Create long-term-cacheable vendor chunks
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            motion: ['framer-motion'],
          },
          chunkFileNames: 'assets/chunk-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  }
})



