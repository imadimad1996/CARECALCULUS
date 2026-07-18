import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { navItems } from '../routes';
import { Link } from 'react-router-dom';
import { Star, AlertOctagon } from 'lucide-react';
import { buildPath } from '../utils/lang';
import { LangCode } from '../types';

export default function FavoritesPage({ lang }: { lang: LangCode }) {
  const { favorites } = useFavorites();
  
  const favoriteItems = navItems.filter(item => favorites.includes(item.path));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl border border-amber-100 shadow-sm">
          <Star className="w-8 h-8 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'fr' ? 'Mes Favoris' : 'My Favorites'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base font-medium">
            {lang === 'fr' 
              ? 'Vos calculateurs médicaux et scores cliniques enregistrés.' 
              : 'Your saved medical calculators and clinical scores.'}
          </p>
        </div>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertOctagon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            {lang === 'fr' ? 'Aucun favori pour le moment' : 'No favorites yet'}
          </h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            {lang === 'fr' 
              ? 'Cliquez sur l\'étoile en haut de n\'importe quel calculateur clinique pour l\'ajouter à votre accès rapide.' 
              : 'Click the star icon at the top of any clinical calculator to add it to your quick access.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={buildPath(item.path, lang)}
                className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 hover:ring-2 hover:ring-amber-400/20 transition-all flex items-start gap-4 cursor-pointer"
              >
                <div className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-tight">
                    {lang === 'fr' ? item.nameFr : item.nameEn}
                  </h4>
                  <div className="mt-2 text-[10px] font-mono font-bold text-amber-500 uppercase flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">
                    <Star className="w-3 h-3 fill-current" />
                    {lang === 'fr' ? 'Ouvrir l\'outil' : 'Open Tool'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
