// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Server configuration
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true, // Open browser on start
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          ui: ['lucide-react', '@headlessui/react'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
  
  // Preview configuration (for production preview)
  preview: {
    port: 4173,
    host: true,
  },
  
  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
      'lucide-react',
      '@supabase/supabase-js'
    ],
  },
})