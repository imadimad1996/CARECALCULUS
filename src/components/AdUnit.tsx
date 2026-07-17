import React, { useEffect } from 'react';

export type AdFormat = 'leaderboard' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push failed:", e);
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
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-7102695194621911"
          data-ad-slot={
            format === 'leaderboard' ? '1111111111' :
            format === 'in-article' ? '2222222222' : '3333333333'
          }
          data-ad-format={format === 'leaderboard' ? 'auto' : undefined}
          data-full-width-responsive={format === 'leaderboard' ? 'true' : undefined}
        />
      </div>
    </div>
  );
}
