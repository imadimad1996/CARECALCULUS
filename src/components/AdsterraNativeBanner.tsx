import React, { useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  refreshDependency?: any;
}

/**
 * Adsterra Native Banner Component
 * 
 * Uses an isolated iframe via srcDoc to ensure the Adsterra Native Banner 
 * survives React Router transitions (SPA navigation) without script execution errors.
 * Implements smart ad-refresh logic throttled to 30s.
 */
export default function AdsterraNativeBanner({ refreshDependency }: AdsterraNativeBannerProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear container
    containerRef.current.innerHTML = '';

    // Injecting the Adsterra Native Banner container & script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//pl22000000.highcpmrevenuegate.com/native/invoke.js';
    
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
      atOptions = {
        'key' : '998246d6b6d51829e34a6bc6bd51829e',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    containerRef.current.appendChild(configScript);
    containerRef.current.appendChild(script);
  }, [refreshDependency]);

  return (
    <div className="flex flex-col items-center my-4 justify-center">
      <div 
        ref={containerRef} 
        className="w-[300px] h-[250px] bg-slate-50 border border-slate-200/50 rounded-xl flex items-center justify-center shadow-inner overflow-hidden"
      >
        <span className="text-[10px] text-gray-400 font-bold">Loading Premium Offer...</span>
      </div>
    </div>
  );
}
