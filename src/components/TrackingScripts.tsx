import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TrackingScripts() {
  const location = useLocation();

  useEffect(() => {
    const loadScripts = () => {
      // 1. Google Analytics (GA4) & Google Tag Manager (GTM) Setup
      const GA_MEASUREMENT_ID = 'G-FE7C4XH4SK'; // GA4 Data Stream ID
      const GTM_ID = 'GT-NNVX88HV'; // GTM Container ID
      
      // Setup dataLayer globally
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      (window as any).gtag = gtag; // Make gtag globally available
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
      });

      // GA4 Script
      if (!document.getElementById('ga-script')) {
        const gaScript = document.createElement('script');
        gaScript.id = 'ga-script';
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        gaScript.async = true;
        gaScript.onerror = () => console.error('[Analytics] Failed to load GA4 script. Ad blocker or CSP might be active.');
        gaScript.onload = () => console.log('[Analytics] GA4 script loaded successfully.');
        document.head.appendChild(gaScript);
      }

      // GTM Script
      if (!document.getElementById('gtm-script')) {
        const gtmInit = document.createElement('script');
        gtmInit.id = 'gtm-script';
        gtmInit.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;
          j.addEventListener('error', function() { console.error('[Analytics] Failed to load GTM script. Ad blocker or CSP might be active.'); });
          j.addEventListener('load', function() { console.log('[Analytics] GTM script loaded successfully.'); });
          f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `;
        document.head.appendChild(gtmInit);
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
