import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Calculator, ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navItems } from '../../routes';
import { useLang } from '../../utils/lang';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { lang, langPath } = useLang();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    const handleCustomOpen = () => setIsOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('carecalculus:open-command-palette', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('carecalculus:open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = navItems.filter((item) => {
    const searchTerms = [item.nameEn, item.nameFr, item.nameAr, item.path].join(' ').toLowerCase();
    return searchTerms.includes(query.toLowerCase());
  });

  const handleSelect = (path: string) => {
    setIsOpen(false);
    navigate(langPath(path));
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-md transition-opacity"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-[672px] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 animate-in slide-in-from-top-4 duration-200" 
        onClick={(e) => e.stopPropagation()}
        dir={'ltr'}
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-gray-400 mr-3 ml-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-slate-100 placeholder-gray-400 text-lg"
            placeholder={lang === 'fr' ? 'Rechercher un outil...' : 'Search clinical tools...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-slate-300 font-semibold mb-1">
                {lang === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}
              </p>
              <p className="text-gray-400 text-sm mb-5">
                {lang === 'fr' ? 'Vérifiez l\'orthographe ou parcourez notre catalogue.' : 'Check your spelling or browse our full catalogue.'}
              </p>
              <button
                onClick={() => handleSelect('/')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-xl font-medium transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                {lang === 'fr' ? 'Parcourir les Outils' : 'Browse All Tools'}
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon || Calculator;
              const name = lang === 'fr' ? item.nameFr : item.nameEn;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-800/60 hover:text-blue-700 rounded-xl transition-colors text-left group"
                >
                  <div className="bg-gray-100 dark:bg-slate-800 group-hover:bg-blue-100 p-2 rounded-lg transition-colors">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <div className="flex-1 font-medium text-gray-800 dark:text-slate-200 group-hover:text-blue-800">
                    {name}
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ${''}`} />
                </button>
              );
            })
          )}
        </div>
        <div className="bg-gray-50 dark:bg-slate-900/80 px-4 py-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 flex justify-between items-center">
          <span>{lang === 'fr' ? 'Recherche globale' : 'Global Search'}</span>
          <span className="font-mono bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-1.5 py-0.5 rounded">esc</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
