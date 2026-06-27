import React from 'react';

/**
 * Adsterra Native Banner Component
 * 
 * Uses an isolated iframe via srcDoc to ensure the Adsterra Native Banner 
 * survives React Router transitions (SPA navigation) without script execution errors.
 */
export default function AdsterraNativeBanner() {
  const NATIVE_BANNER_ID = '44cfd4429085b087e60c41dbe6b342fe';
  const NATIVE_SCRIPT_URL = `//pl29869264.effectivecpmnetwork.com/${NATIVE_BANNER_ID}/invoke.js`;

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
