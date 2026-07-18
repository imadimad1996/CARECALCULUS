import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { parsePathname } from '../utils/lang';
import { useFavorites } from '../hooks/useFavorites';
import { navItems } from '../routes';

export default function FavoriteButton({ lang }: { lang: string }) {
  const location = useLocation();
  const { path: logicalPath } = parsePathname(location.pathname);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showToast, setShowToast] = useState(false);
  const isFav = isFavorite(logicalPath);
  
  // Only show if the current path is a tool (i.e. in navItems)
  const isToolPage = navItems.some(item => item.path === logicalPath);
  
  if (!isToolPage) return null;

  const handleToggle = () => {
    toggleFavorite(logicalPath);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="relative shrink-0 z-50">
      <button
        onClick={handleToggle}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition border active:scale-95 cursor-pointer ${
          isFav 
            ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30' 
            : 'bg-white hover:bg-amber-50 text-slate-400 hover:text-amber-500 border-slate-200 shadow-sm'
        }`}
        title={lang === 'fr' ? 'Ajouter aux favoris' : 'Add to favorites'}
      >
        <Star className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
      </button>
      
      {showToast && (
        <div className="absolute top-12 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
          {isFav ? (lang === 'fr' ? 'Ajouté aux favoris' : 'Added to favorites') : (lang === 'fr' ? 'Retiré des favoris' : 'Removed from favorites')}
        </div>
      )}
    </div>
  );
}
