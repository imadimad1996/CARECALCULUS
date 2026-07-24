import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('carecalculus-favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading favorites', e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'carecalculus-favorites' && e.newValue) {
        setFavorites(JSON.parse(e.newValue));
      }
    };

    const handleCustomEvent = (e: any) => {
      setFavorites(e.detail);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('favorites-updated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('favorites-updated', handleCustomEvent);
    };
  }, []);

  const toggleFavorite = (path: string) => {
    setFavorites(prev => {
      const next = prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path];
      try {
        localStorage.setItem('carecalculus-favorites', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('favorites-updated', { detail: next }));
      } catch (e) {
        console.error('Error saving favorites', e);
      }
      return next;
    });
  };

  const isFavorite = (path: string) => favorites.includes(path);

  return { favorites, toggleFavorite, isFavorite };
}
