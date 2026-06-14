import React, { useEffect, useState } from 'react';

/**
 * Thin reading progress bar at the top of article/content pages.
 * Increases perceived engagement — users scroll further when they see progress.
 * More scrolling = more in-article ad impressions = more revenue.
 */

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress < 1) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 transition-[width] duration-150 ease-out rounded-r-full shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
