import React, { useEffect, useState } from 'react';
import AdsterraNativeBanner from './AdsterraNativeBanner';

export type AdFormat = 'leaderboard' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if adsbygoogle script executed successfully
      const isScriptLoaded = typeof window !== 'undefined' && (window as any).adsbygoogle && (window as any).adsbygoogle.loaded;
      if (!isScriptLoaded) {
        setAdBlocked(true);
      }
    }, 2500); // 2.5 second grace period for AdSense to report loaded status

    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push failed, falling back:", e);
        setAdBlocked(true);
      }
    }

    return () => clearTimeout(timer);
  }, [format]);

  // Dimensions based on formats
  const dimensions = {
    leaderboard: 'w-full max-w-[728px] h-[90px]',
    'in-article': 'w-[300px] h-[250px]',
    sidebar: 'w-[160px] h-[600px]'
  };

  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[9px] text-gray-400 font-mono tracking-wider uppercase mb-1.5">Advertisement</span>
      
      <div className={`relative bg-gray-50 border border-gray-150 rounded-xl overflow-hidden shadow-xs flex items-center justify-center ${dimensions[format]}`}>
        {/* Google AdSense slot */}
        {!adBlocked && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client="ca-pub-7102695194621911"
            data-ad-slot={
              format === 'leaderboard' ? '1111111111' :
              format === 'in-article' ? '2222222222' : '3333333333'
            }
            data-ad-format={format === 'leaderboard' ? 'auto' : undefined}
            data-full-width-responsive={format === 'leaderboard' ? 'true' : undefined}
          />
        )}
        
        {/* Fallback Sponsor Banner (only shown if AdSense fails/blocked) */}
        {adBlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-white p-4">
            {format === 'in-article' ? (
              <AdsterraNativeBanner />
            ) : (
              <div className="text-center">
                <span className="text-xs text-teal-600 font-bold uppercase tracking-wide">CareCalculus Clinical Sponsor</span>
                <p className="text-[11px] text-gray-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                  Access 19+ evidence-based bedside calculators offline and instantly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
