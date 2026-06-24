import React from 'react';
import AdsterraNativeBanner from './AdsterraNativeBanner';

/**
 * CareCalculus Responsive Adsterra Unit
 *
 * Sandboxes Adsterra iframe banners to protect React from `document.write`
 * and dynamically renders the Native Banner format.
 */

export type AdFormat = 'leaderboard' | 'in-article';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  if (format === 'in-article') {
    return <AdsterraNativeBanner />;
  }

  // 728x90 Banner
  // We use an iframe with srcDoc to sandbox the Adsterra document.write script.
  // This guarantees it won't crash the React SPA while ensuring it refreshes
  // dynamically on route changes.
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '3c062c9261b205d552d240d01fa0a70e',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/3c062c9261b205d552d240d01fa0a70e/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`w-full flex justify-center overflow-hidden ${className}`} style={{ minHeight: '90px' }}>
      <iframe
        title="Advertisement"
        srcDoc={srcDoc}
        width="728"
        height="90"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        scrolling="no"
      />
    </div>
  );
}
