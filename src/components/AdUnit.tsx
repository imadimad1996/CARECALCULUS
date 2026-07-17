import React, { useEffect, useRef } from 'react';
import AdsterraNativeBanner from './AdsterraNativeBanner';

export type AdFormat = 'leaderboard' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // In production, we'll try to load Google AdSense. 
  // If AdSense is blocked or fails, we fall back to Adsterra.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Push to Google Adsense array
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push failed, using fallback ads:", e);
      }
    }
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
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-0000000000000000" // Replace with real Publisher ID
          data-ad-slot={
            format === 'leaderboard' ? '1111111111' :
            format === 'in-article' ? '2222222222' : '3333333333'
          }
          data-ad-format={format === 'leaderboard' ? 'auto' : undefined}
          data-full-width-responsive={format === 'leaderboard' ? 'true' : undefined}
        />
        
        {/* Adsterra Fallback (hidden if AdSense loads, or runs in parallel if slot is invalid) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-white pointer-events-auto">
          {format === 'in-article' ? (
            <AdsterraNativeBanner />
          ) : (
            <div className="text-center p-4">
              <span className="text-xs text-gray-400 font-bold">Premium Clinical Sponsor</span>
              <p className="text-[10px] text-gray-300 mt-1">Unlock fast medical calculators daily.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
