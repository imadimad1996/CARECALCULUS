import React, { useEffect, useRef, useState } from 'react';

/**
 * CareCalculus Responsive AdSense Unit
 *
 * Lazy-loads Google AdSense ads to protect Core Web Vitals.
 * Supports multiple ad formats and gracefully degrades when
 * AdSense hasn't loaded or when in development.
 *
 * Usage:
 *   <AdUnit format="in-article" />
 *   <AdUnit format="sidebar" />
 *   <AdUnit format="leaderboard" />
 *   <AdUnit format="multiplex" />
 */

export type AdFormat = 'in-article' | 'sidebar' | 'leaderboard' | 'multiplex' | 'rectangle';

interface AdUnitProps {
  /** Ad format determines sizing and responsive behavior */
  format: AdFormat;
  /** Optional CSS class for positioning */
  className?: string;
  /** Whether to use the fluid layout (for in-article) */
  fluid?: boolean;
}

// Format-specific styles and ad slot configuration
const FORMAT_CONFIG: Record<AdFormat, { style: React.CSSProperties; layout?: string; layoutKey?: string }> = {
  'in-article': {
    style: { display: 'block', textAlign: 'center' as const, minHeight: '100px' },
    layout: 'in-article',
  },
  'sidebar': {
    style: { display: 'block', minHeight: '250px', width: '100%' },
  },
  'leaderboard': {
    style: { display: 'block', textAlign: 'center' as const, minHeight: '90px', width: '100%' },
  },
  'multiplex': {
    style: { display: 'block', minHeight: '200px', width: '100%' },
    layout: 'in-article',
    layoutKey: '-gw-3+1f-3d+2z',
  },
  'rectangle': {
    style: { display: 'inline-block', width: '300px', height: '250px' },
  },
};

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  // IntersectionObserver: only load ad when it's about to enter viewport
  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before viewport
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  // Push ad to AdSense when visible
  useEffect(() => {
    if (!isVisible || adLoaded) return;

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (e) {
      // AdSense not available — fail silently
      console.debug('AdSense not loaded, ad slot skipped.');
    }
  }, [isVisible, adLoaded]);

  const config = FORMAT_CONFIG[format];

  return (
    <div
      className={`carecalculus-ad-unit ad-${format} ${className}`}
      style={{ overflow: 'hidden', margin: '1.5rem 0' }}
    >
      {/* Subtle ad label for transparency */}
      <div style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '4px', textAlign: 'center', fontFamily: 'monospace' }}>
        Advertisement
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={config.style}
        data-ad-client="ca-pub-7102695194621911"
        data-ad-format={format === 'in-article' ? 'fluid' : 'auto'}
        data-full-width-responsive="true"
        {...(config.layout ? { 'data-ad-layout': config.layout } : {})}
        {...(config.layoutKey ? { 'data-ad-layout-key': config.layoutKey } : {})}
      />
    </div>
  );
}
