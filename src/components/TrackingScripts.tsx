import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TrackingScripts() {
  const location = useLocation();

  useEffect(() => {
    const loadScripts = () => {
      // 1. Google Analytics (GA4) Setup
      const GA_MEASUREMENT_ID = 'G-FE7C4XH4SK'; // Ensure this is your Measurement ID (Data Stream ID)
      
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
          window.gtag = gtag; // Make gtag globally available
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `;
        document.head.appendChild(gaInit);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadScripts);
    } else {
      setTimeout(loadScripts, 2000);
    }
  }, []);

  // Automatically track page views when the route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      const GA_MEASUREMENT_ID = 'G-FE7C4XH4SK'; // Ensure this matches your ID above
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  useEffect(() => {
    const loadSecondaryScripts = () => {
      // 2. Microsoft Clarity Setup
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

      // 3. Google AdSense Setup
      const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX';

      if (!document.getElementById('adsense-script') && ADSENSE_PUBLISHER_ID !== 'ca-pub-XXXXXXXXXXXXXXXX') {
        const adsenseScript = document.createElement('script');
        adsenseScript.id = 'adsense-script';
        adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
        adsenseScript.async = true;
        adsenseScript.crossOrigin = 'anonymous';
        document.head.appendChild(adsenseScript);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadSecondaryScripts);
    } else {
      setTimeout(loadSecondaryScripts, 2000);
    }
  }, []);

  return null;
}
