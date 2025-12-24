import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['minaret.svg', 'minaret.png'],
      manifest: {
        name: 'Minaret Live',
        short_name: 'Minaret',
        description: 'Listen to live mosque radio broadcasts from around the world',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#059669',
        orientation: 'portrait-primary',
        id: '/',
        icons: [
          {
            src: '/minaret.png',
            sizes: '192x192',
            type: 'image/png',
            // purpose: 'any'
          },
          {
            src: '/minaret.png',
            sizes: '512x512',
            type: 'image/png',
            // purpose: 'any'
          },
          {
            src: '/minaret.png',
            sizes: '512x512',
            type: 'image/png',
            // purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
