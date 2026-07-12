/// <reference types="vite-plugin-pwa/client" />
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register the PWA service worker for retention/install loops
registerSW({ immediate: true });

const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

// If vite-prerender-plugin already injected SSR HTML into #root, hydrate
// over it (preserves nodes). If #root is empty (dev server), use createRoot.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
