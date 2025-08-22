import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cuwkbbakggpdvmvjknxh\.supabase\.co\/functions\/v1\/verse/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'verse-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
          {
            urlPattern: /^https:\/\/cuwkbbakggpdvmvjknxh\.supabase\.co/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      includeAssets: [
        'oneseed-logo-trans.png',
        'oneseed-title.png',
        'oneseed-title-curve.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-192-maskable.png',
        'icons/icon-512-maskable.png'
      ],
      manifest: {
        name: 'OneSeed - Nurture Your Spiritual Growth',
        short_name: 'OneSeed',
        description: 'Daily scripture, prayer journaling, and spiritual reflections to nurture your faith journey',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#ffffff',
        theme_color: '#16a34a',
        scope: '/',
        lang: 'en',
        categories: ['lifestyle', 'education', 'religion'],
        icons: [
          { 
            src: '/icons/icon-192.png', 
            sizes: '192x192', 
            type: 'image/png', 
            purpose: 'any' 
          },
          { 
            src: '/icons/icon-512.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'any' 
          },
          { 
            src: '/icons/icon-192-maskable.png', 
            sizes: '192x192', 
            type: 'image/png', 
            purpose: 'maskable' 
          },
          { 
            src: '/icons/icon-512-maskable.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'maskable' 
          }
        ],
        screenshots: [
          {
            src: '/oneseed-title.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
