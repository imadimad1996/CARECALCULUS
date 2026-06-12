import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {vitePrerenderPlugin} from 'vite-prerender-plugin';

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
