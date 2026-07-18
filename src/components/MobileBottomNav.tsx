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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 z-40 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around px-2 py-2">
        <Link 
          to={langPath('/')} 
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
            isActive('/') ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 mb-1 ${isActive('/') ? 'fill-teal-600/20' : ''}`} />
          <span className="text-[10px] font-semibold">{lang === 'fr' ? 'Accueil' : 'Home'}</span>
        </Link>

        <button 
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center w-16 h-12 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Search className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">{lang === 'fr' ? 'Chercher' : 'Search'}</span>
        </button>

        <Link 
          to={langPath('/glp-1-hub')} 
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
            isActive('/glp-1-hub') ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className={`w-5 h-5 mb-1 ${isActive('/glp-1-hub') ? 'fill-indigo-600/20' : ''}`} />
          <span className="text-[10px] font-semibold">GLP-1</span>
        </Link>

        <button 
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center w-16 h-12 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">{lang === 'fr' ? 'Menu' : 'Menu'}</span>
        </button>
      </div>
    </div>
  );
}
