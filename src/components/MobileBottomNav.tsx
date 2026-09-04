import React from 'react';
import { Home, Search, Calculator, Sparkles, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LangCode } from '../types';

interface MobileBottomNavProps {
  lang: LangCode;
  langPath: (path: string) => string;
  onSearchClick: () => void;
  onMenuClick: () => void;
}

export default function MobileBottomNav({ lang, langPath, onSearchClick, onMenuClick }: MobileBottomNavProps) {
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\/(fr|ar)/, '') || '/';

  const isActive = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '/map-calculator')) return true;
    return currentPath === path;
  };

  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 z-40 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-around px-2 py-2">
        <Link 
          to={langPath('/')}
          aria-label={lang === 'fr' ? 'Accueil' : 'Home'}
          aria-current={isActive('/') ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${
            isActive('/') ? 'text-teal-600 dark:text-teal-400 scale-105 nav-active-pill' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className={`w-5 h-5 mb-1 transition-all ${isActive('/') ? 'fill-teal-600/20 dark:fill-teal-400/20' : ''}`} />
          <span className="text-[10px] font-semibold">{lang === 'fr' ? 'Accueil' : 'Home'}</span>
        </Link>

        <button 
          onClick={onSearchClick}
          aria-label={lang === 'fr' ? 'Ouvrir la recherche' : 'Open search'}
          className="flex flex-col items-center justify-center w-16 h-12 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">{lang === 'fr' ? 'Chercher' : 'Search'}</span>
        </button>

        <Link 
          to={langPath('/favorites')}
          aria-label={lang === 'fr' ? 'Favoris' : 'Saved'}
          aria-current={isActive('/favorites') ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${
            isActive('/favorites') ? 'text-teal-600 dark:text-teal-400 scale-105 nav-active-pill' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Calculator className={`w-5 h-5 mb-1 transition-all ${isActive('/favorites') ? 'fill-teal-600/20 dark:fill-teal-400/20' : ''}`} />
          <span className="text-[10px] font-semibold">{lang === 'fr' ? 'Favoris' : 'Saved'}</span>
        </Link>

        <button 
          onClick={onMenuClick}
          aria-label={lang === 'fr' ? 'Ouvrir le menu' : 'Open menu'}
          className="flex flex-col items-center justify-center w-16 h-12 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">{lang === 'fr' ? 'Menu' : 'Menu'}</span>
        </button>
      </div>
    </nav>
  );
}
