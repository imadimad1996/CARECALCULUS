import React from 'react';
import AdsterraNativeBanner from './AdsterraNativeBanner';

export type AdFormat = 'leaderboard' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  return null;
}
