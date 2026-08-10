import { useEffect, useState } from 'react';

// Global state for popup lock
let activePopup: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

/**
 * Attempts to acquire the global popup lock.
 * @param id Unique identifier for the popup
 * @returns true if lock acquired successfully
 */
export const requestPopupLock = (id: string): boolean => {
  // Always allow Medical Disclaimer to override everything
  if (id === 'medical-disclaimer') {
    activePopup = id;
    notify();
    return true;
  }

  // If disclaimer is active, no one else can show
  if (activePopup === 'medical-disclaimer') {
    return false;
  }

  if (activePopup === null || activePopup === id) {
    activePopup = id;
    notify();
    return true;
  }
  
  return false;
};

export const releasePopupLock = (id: string) => {
  if (activePopup === id) {
    activePopup = null;
    notify();
  }
};

/**
 * Hook to manage popup orchestration.
 * @param id Unique identifier for the popup
 * @param shouldShow Boolean indicating if the popup WANTS to show
 * @returns [canRender, releaseLock]
 */
export function usePopupLock(id: string, shouldShow: boolean): [boolean, () => void] {
  const [hasLock, setHasLock] = useState(false);

  useEffect(() => {
    const checkLock = () => {
      if (shouldShow) {
        const locked = requestPopupLock(id);
        setHasLock(locked);
      } else {
        releasePopupLock(id);
        setHasLock(false);
      }
    };

    // Check immediately
    checkLock();

    // Listen for other popup state changes
    listeners.add(checkLock);
    return () => {
      listeners.delete(checkLock);
      if (activePopup === id) releasePopupLock(id);
    };
  }, [id, shouldShow]);

  return [hasLock, () => releasePopupLock(id)];
}
