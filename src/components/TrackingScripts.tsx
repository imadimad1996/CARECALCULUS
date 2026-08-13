import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isProActive } from '../utils/pro';

export default function TrackingScripts() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

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
    const currentPath = location.pathname + location.search;
    if (
      typeof window !== 'undefined' &&
      (window as any).dataLayer &&
      lastTrackedPath.current !== currentPath
    ) {
      lastTrackedPath.current = currentPath;
      (window as any).dataLayer.push({
        event: 'virtual_page_view',
        page_path: currentPath,
      });
    }
  }, [location]);


  return null;
}
