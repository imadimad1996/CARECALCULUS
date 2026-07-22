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
      const win = window as any;
      win.dataLayer = win.dataLayer || [];
      function gtag(..._args: any[]) {
        win.dataLayer.push(arguments);
      }
      win.gtag = gtag; // Make gtag globally available
      // Removed direct gtag('config') and GA4 script insertion to prevent duplicate tracking with GTM

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
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'virtual_page_view',
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  useEffect(() => {
    const loadSecondaryScripts = () => {
      // 2. Microsoft Clarity Setup
      const CLARITY_PROJECT_ID = 'XXXXXXXXXX';

      if (!document.getElementById('clarity-script') && CLARITY_PROJECT_ID !== 'XXXXXXXXXX') {
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
      const ADSENSE_PUBLISHER_ID: string = 'ca-pub-7102695194621911';

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
