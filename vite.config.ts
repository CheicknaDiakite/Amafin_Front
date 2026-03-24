import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { imagetools } from 'vite-imagetools';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
    plugins: [react(), VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
            'favicon.svg', 
            'icon-192x192.png', 
            'icon-512x512.png', 
            'icon-180x180.png',
            'icon-167x167.png',
            'icon-152x152.png',
            'icon-120x120.png',
            'C_D.ico', 
            'offline.html'
        ],
        manifest: {
            name: 'Amafin',
            short_name: 'Amafin',
            description: 'Meilleur application Amafin',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            categories: ['business', 'productivity'],
            lang: 'fr',
            dir: 'ltr',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
              },
              {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              },
              // Icônes spécifiques pour iOS
              {
                src: '/icon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: '/icon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
                purpose: 'any'
              }
            ],
            screenshots: [
              {
                src: '/icon-512x512.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide'
              }
            ]
          },
        workbox: {
            globPatterns: ['**/*{js,css,html,ico,png,svg}'],
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            navigateFallback: '/offline.html',
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/diakitedigital\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'diakitedigital',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                        },
                    },
                }
            ]
        },
        devOptions: {
            enabled: false,
            type: 'module'
        }
    }),
    imagetools(),
    viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
        deleteOriginFile: false
    }),
    viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false
    })],
    build: {
        target: 'esnext',
        rollupOptions: {
            external: ['workbox-window'],
        },
    },
});