import React from 'react';
import { Link } from 'react-router-dom';
import { X, Layers, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { SPECIALTIES_DB } from '../data/specialties';
import { navItems } from '../routes';
import { LangCode } from '../types';

interface SpecialtiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LangCode;
  langPath: (path: string) => string;
}

export function SpecialtiesModal({ isOpen, onClose, lang, langPath }: SpecialtiesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {lang === 'fr' ? 'Spécialités Médicales' : 'Medical Specialties Directory'}
                <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[10px] font-mono font-bold uppercase">
                  {SPECIALTIES_DB.length} Hubs
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'fr' 
                  ? 'Explorez nos calculateurs et recommandations cliniques par spécialité.' 
                  : 'Explore clinical calculators and decision support organized by medical specialty.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPECIALTIES_DB.map((spec) => {
              const Icon = spec.icon;
              const title = lang === 'fr' ? spec.nameFr : spec.nameEn;
              const desc = lang === 'fr' ? spec.descriptionFr : spec.descriptionEn;

              const matchedCalculators = spec.calculators
                .map((calcSlug) => navItems.find((item) => item.path === `/${calcSlug}`))
                .filter(Boolean);

              return (
                <div
                  key={spec.id}
                  className="group flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-teal-500/50 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {title}
                        </h3>
                      </div>

                      <Link
                        to={langPath(`/specialties/${spec.id}`)}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        <span>{lang === 'fr' ? 'Hub Complete' : 'View Hub'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                      {desc}
                    </p>
                  </div>

                  {/* Calculator chips */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    {matchedCalculators.map((calc) => {
                      if (!calc) return null;
                      const calcName = lang === 'fr' ? calc.nameFr : calc.nameEn;
                      return (
                        <Link
                          key={calc.path}
                          to={langPath(calc.path)}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 text-[11px] font-semibold transition-colors border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {calcName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'fr' 
              ? 'Besoin d\'un calculateur spécifique ? Utilisez la recherche globale.' 
              : 'Need a specific calculator? Use global search.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            {lang === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
