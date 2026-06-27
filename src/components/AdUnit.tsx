import React from 'react';
import AdsterraNativeBanner from './AdsterraNativeBanner';

export type AdFormat = 'leaderboard' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  if (format === 'in-article') {
    return <AdsterraNativeBanner />;
  }

  // Placeholder Adsterra Keys - The user should replace these in their dashboard
  const ADSTERRA_LEADERBOARD_KEY = '3c062c9261b205d552d240d01fa0a70e';
  const ADSTERRA_SIDEBAR_KEY = 'YOUR_SIDEBAR_KEY_HERE';

  if (format === 'sidebar') {
    const sidebarSrcDoc = `
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
              'key' : '${ADSTERRA_SIDEBAR_KEY}',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/${ADSTERRA_SIDEBAR_KEY}/invoke.js"></script>
        </body>
      </html>
    `;

    return (
      <div className={`w-full flex justify-center overflow-hidden ${className}`} style={{ minHeight: '250px' }}>
        <iframe
          title="Advertisement"
          srcDoc={sidebarSrcDoc}
          width="300"
          height="250"
          style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
          scrolling="no"
        />
      </div>
    );
  }

  const leaderboardSrcDoc = `
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
            'key' : '${ADSTERRA_LEADERBOARD_KEY}',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/${ADSTERRA_LEADERBOARD_KEY}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`w-full flex justify-center overflow-hidden ${className}`} style={{ minHeight: '90px' }}>
      <iframe
        title="Advertisement"
        srcDoc={leaderboardSrcDoc}
        width="728"
        height="90"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        scrolling="no"
      />
    </div>
  );
}
