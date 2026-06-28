import React, { useState, useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  refreshDependency?: any;
}

/**
 * Adsterra Native Banner Component
 * 
 * Uses an isolated iframe via srcDoc to ensure the Adsterra Native Banner 
 * survives React Router transitions (SPA navigation) without script execution errors.
 * Implements smart ad-refresh logic throttled to 30s.
 */
export default function AdsterraNativeBanner({ refreshDependency }: AdsterraNativeBannerProps = {}) {
  const NATIVE_BANNER_ID = '44cfd4429085b087e60c41dbe6b342fe';
  const NATIVE_SCRIPT_URL = `//pl29869264.effectivecpmnetwork.com/${NATIVE_BANNER_ID}/invoke.js`;
  
  const [iframeKey, setIframeKey] = useState(0);
  const lastRefresh = useRef(Date.now());

  useEffect(() => {
    if (refreshDependency !== undefined) {
      const now = Date.now();
      // Only allow refresh if at least 30 seconds have passed since last load
      if (now - lastRefresh.current > 30000) {
        setIframeKey(k => k + 1);
        lastRefresh.current = now;
      } else {
        const remaining = 30000 - (now - lastRefresh.current);
        const timer = setTimeout(() => {
          setIframeKey(k => k + 1);
          lastRefresh.current = Date.now();
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [refreshDependency]);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
        </style>
      </head>
      <body>
        <div id="container-${NATIVE_BANNER_ID}"></div>
        <script type="text/javascript" async="async" data-cfasync="false" src="${NATIVE_SCRIPT_URL}"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden" style={{ minHeight: '250px' }}>
      <iframe
        key={iframeKey}
        title="Native Advertisement"
        srcDoc={srcDoc}
        width="100%"
        height="250"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '650px' }}
        scrolling="no"
      />
    </div>
  );
}
