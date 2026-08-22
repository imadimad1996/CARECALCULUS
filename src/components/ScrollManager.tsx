import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollManager handles scrolling to the top of the page when navigating to a new route.
 * 
 * Best Practices implemented:
 * 1. Only scrolls on 'PUSH' or 'REPLACE' navigation types.
 * 2. Ignores 'POP' navigation (e.g. browser back/forward buttons) to preserve the user's scroll position.
 * 3. Uses 'auto' (instant) scrolling for snappy page transitions, avoiding the visual blur of smooth scrolling whole pages.
 */
export default function ScrollManager() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // We only want to scroll to the top if the user explicitly navigated to a new page.
    // If they clicked the browser's "Back" button (POP), we let the browser restore their scroll position natively.
    if (navigationType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }
  }, [pathname, navigationType]);

  return null; // This is a utility component, it renders nothing.
}
