import { useEffect } from 'react';

export default function TrackingScripts() {
  useEffect(() => {
    // 1. Google Analytics (GA4) Setup
    // Replace G-XXXXXXXXXX with your actual GA4 Measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    
    if (!document.getElementById('ga-script')) {
      const gaScript = document.createElement('script');
      gaScript.id = 'ga-script';
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      gaScript.async = true;
      document.head.appendChild(gaScript);

      const gaInit = document.createElement('script');
      gaInit.id = 'ga-init';
      gaInit.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_path: window.location.pathname,
        });
      `;
      document.head.appendChild(gaInit);
    }

    // 2. Microsoft Clarity Setup
    // Replace XXXXXXXXXX with your actual Clarity Project ID
    const CLARITY_PROJECT_ID = 'XXXXXXXXXX';

    if (!document.getElementById('clarity-script')) {
      const clarityInit = document.createElement('script');
      clarityInit.id = 'clarity-script';
      clarityInit.innerHTML = `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `;
      document.head.appendChild(clarityInit);
    }
  }, []);

  return null;
}
