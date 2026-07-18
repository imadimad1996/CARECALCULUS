import React from 'react';

export type AdFormat = 'leaderboard' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  // The user requested to remove manual placeholders and let AdSense Auto-Ads
  // "do whatever it wants". Auto-ads logic is loaded in index.html.
  return null;
}
