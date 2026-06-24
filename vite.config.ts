import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {vitePrerenderPlugin} from 'vite-prerender-plugin';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Statically generates a real HTML document per route at build time so
      // crawlers and non-JS AI engines get full content + meta + JSON-LD on the
      // first fetch. The client bundle hydrates over this markup as an SPA.
      vitePrerenderPlugin({
        renderTarget: '#root',
        prerenderScript: path.resolve(__dirname, 'src/entry-prerender.tsx'),
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'CareCalculus',
          short_name: 'CareCalculus',
          description: 'Clinical Calculators Suite',
          theme_color: '#ffffff',
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
      {
        name: 'force-close',
        closeBundle() {
          console.log('Build finished, forcing process exit to prevent hanging...');
          setTimeout(() => {
            process.exit(0);
          }, 200);
        }
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
