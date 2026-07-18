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
  }, []);

  const toggleFavorite = (path: string) => {
    setFavorites(prev => {
      const next = prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path];
      try {
        localStorage.setItem('carecalculus-favorites', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving favorites', e);
      }
      return next;
    });
  };

  const isFavorite = (path: string) => favorites.includes(path);

  return { favorites, toggleFavorite, isFavorite };
}
