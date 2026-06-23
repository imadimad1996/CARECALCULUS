import React, { useEffect, useRef } from 'react';

/**
 * Adsterra Native Banner Component
 * 
 * Safely injects the Adsterra native banner script into the React lifecycle.
 * The script uses the unique container ID to render the ad.
 */
export default function AdsterraNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Prevent duplicate script injections during React StrictMode or re-renders
    if (scriptLoaded.current || document.getElementById('adsterra-native-banner-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'adsterra-native-banner-script';
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl29869264.effectivecpmnetwork.com/44cfd4429085b087e60c41dbe6b342fe/invoke.js';

    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  return (
    <div className="w-full flex justify-center my-8">
      {/* Adsterra requires this exact ID for the native banner to render */}
      <div id="container-44cfd4429085b087e60c41dbe6b342fe" ref={containerRef}></div>
    </div>
  );
}
