/// <reference types="vite-plugin-pwa/client" />
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register the PWA service worker for retention/install loops
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
