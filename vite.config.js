import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/YOGApass/', // Important for GitHub Pages deployment
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
      manifest: {
        name: '回数券トラッカー',
        short_name: '回数券',
        description: '「4回券・購入から2か月有効」の回数券トラッカー',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/YOGApass/', // Should match base
        start_url: '/YOGApass/', // Should match base
        icons: [
          {
            src: 'pwa-192x192.png', // Ensure these icons exist in your public folder
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Ensure these icons exist in your public folder
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Ensure these icons exist in your public folder
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          }
        ],
      },
      devOptions: {
        enabled: true // Enables PWA in development mode
      }
    })
  ],
})
