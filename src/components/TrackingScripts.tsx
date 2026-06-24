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

    // 3. Adsterra RTL Overlap Fix Mutation Observer
    // Detects dynamically injected fixed-position ads (e.g., Social Bar) and shifts them to the left
    // when layout direction is RTL, preventing them from blocking the sidebar navigation or language switcher.
    const observer = new MutationObserver((mutations) => {
      const isRtl = document.documentElement.dir === 'rtl';
      if (!isRtl) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const style = window.getComputedStyle(el);
            if (
              style.position === 'fixed' &&
              el.tagName !== 'ASIDE' &&
              !el.classList.contains('z-30') && // Mobile menu overlay
              !el.classList.contains('z-40') && // Sidebar navigation
              !el.id.includes('root') &&
              !el.id.includes('command-palette')
            ) {
              el.style.setProperty('right', 'auto', 'important');
              el.style.setProperty('left', '16px', 'important');
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
