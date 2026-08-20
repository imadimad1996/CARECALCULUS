import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calculator, BookOpen, Sparkles, Command, ArrowRight, Activity, FileText } from 'lucide-react';
import { LangCode } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LangCode;
}

import { ALL_CALCULATORS } from '../data/calculators';

export default function CommandPalette({ isOpen, onClose, lang }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = ALL_CALCULATORS.filter(item => {
    const titleText = item.title[lang] || item.title.en;
    const catText = item.category[lang] || item.category.en;
    const searchString = `${titleText} ${catText} ${item.keywords.join(' ')}`.toLowerCase();
    return searchString.includes(query.toLowerCase());
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      navigate(filteredItems[selectedIndex].path);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[80vh] transition-all transform animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header Search Input */}
        <div className="relative flex items-center px-4 border-b border-gray-100 dark:border-gray-800 py-3">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder={lang === 'fr' ? "Rechercher un calculateur, score ou fiche..." : "Search calculators, clinical scores, or hubs..."}
            className="w-full px-3 py-1.5 text-base bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-gray-50 dark:divide-gray-800/50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              {lang === 'fr' ? "Aucun résultat trouvé." : "No clinical calculators or resources found."}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const title = item.title[lang] || item.title.en;
              const category = item.category[lang] || item.category.en;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-cyan-50 dark:bg-cyan-950/40 border-l-4 border-cyan-600 dark:border-cyan-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1">
                        {lang === 'fr' ? 'Ouvrir' : 'Open'} <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 min-h-[44px].5 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono text-[10px]">↑↓</span>
            <span>{lang === 'fr' ? 'Naviguer' : 'Navigate'}</span>
            <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono text-[10px] ml-2">↵</span>
            <span>{lang === 'fr' ? 'Sélectionner' : 'Select'}</span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
