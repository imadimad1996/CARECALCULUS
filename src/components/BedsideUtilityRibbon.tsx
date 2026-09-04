import React, { useState, useEffect } from 'react';
import { Star, Download, Smartphone, Share2, Check, Sparkles, BookOpen } from 'lucide-react';
import { LangCode } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface BedsideUtilityRibbonProps {
  logicalPath: string;
  lang: LangCode;
}

export default function BedsideUtilityRibbon({ logicalPath, lang }: BedsideUtilityRibbonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(logicalPath);

  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowPwaModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const t = {
    en: {
      badge: 'Clinician Toolkit',
      guideBtn: 'ICU & ER Pocket Card (PDF)',
      guideDesc: 'Free 2026 laminated quick reference',
      saveFav: 'Save to Ward Favorites',
      savedFav: 'Saved to Favorites',
      installBtn: 'Add to Hospital Screen',
      shareBtn: 'Share Tool',
      copied: 'Link Copied!',
      pwaModalTitle: 'Install CareCalculus at the Bedside',
      pwaModalDesc: 'Add CareCalculus to your hospital tablet or mobile home screen for instantaneous, 100% offline access in ICU and emergency wards.',
      pwaIosStep: 'Tap the Share icon in Safari, then select "Add to Home Screen".',
      pwaAndroidStep: 'Tap Chrome menu (⋮) and tap "Install App" or "Add to Home screen".',
      close: 'Got it'
    },
    fr: {
      badge: 'Boîte à Outils Clinique',
      guideBtn: 'Guide ICU & Urgences (PDF)',
      guideDesc: 'Référentiel plastifié 2026 gratuit',
      saveFav: 'Enregistrer aux Favoris',
      savedFav: 'Enregistré aux Favoris',
      installBtn: 'Ajouter à l\'Écran d\'Accueil',
      shareBtn: 'Partager l\'Outil',
      copied: 'Lien Copié !',
      pwaModalTitle: 'Installer CareCalculus au Lit du Patient',
      pwaModalDesc: 'Ajoutez CareCalculus sur votre tablette hospitalière ou smartphone pour un accès 100% hors-ligne en réanimation et aux urgences.',
      pwaIosStep: 'Appuyez sur Partager dans Safari, puis "Sur l\'écran d\'accueil".',
      pwaAndroidStep: 'Appuyez sur le menu Chrome (⋮) puis "Installer l\'application".',
      close: 'Compris'
    },
    es: {
      badge: 'Kit del Clínico',
      guideBtn: 'Guía UCI y Urgencias (PDF)',
      guideDesc: 'Referencia laminada 2026 gratuita',
      saveFav: 'Guardar en Favoritos',
      savedFav: 'Guardado en Favoritos',
      installBtn: 'Instalar en Pantalla',
      shareBtn: 'Compartir',
      copied: '¡Enlace Copiado!',
      pwaModalTitle: 'Instalar CareCalculus en el Hospital',
      pwaModalDesc: 'Agregue CareCalculus a su tableta o teléfono para acceso 100% offline e inmediato en UCI y urgencias.',
      pwaIosStep: 'Pulse Compartir en Safari y elija "Agregar a pantalla de inicio".',
      pwaAndroidStep: 'Pulse Menú en Chrome (⋮) y elija "Instalar aplicación".',
      close: 'Entendido'
    }
  }[lang] || {
    badge: 'Clinician Toolkit',
    guideBtn: 'ICU & ER Pocket Card (PDF)',
    guideDesc: 'Free 2026 laminated quick reference',
    saveFav: 'Save to Ward Favorites',
    savedFav: 'Saved to Favorites',
    installBtn: 'Add to Hospital Screen',
    shareBtn: 'Share Tool',
    copied: 'Link Copied!',
    pwaModalTitle: 'Install CareCalculus at the Bedside',
    pwaModalDesc: 'Add CareCalculus to your hospital tablet or mobile home screen for instantaneous, 100% offline access in ICU and emergency wards.',
    pwaIosStep: 'Tap the Share icon in Safari, then select "Add to Home Screen".',
    pwaAndroidStep: 'Tap Chrome menu (⋮) and tap "Install App" or "Add to Home screen".',
    close: 'Got it'
  };

  return (
    <aside aria-label="Bedside Clinical Utility" className="relative mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-3 sm:p-4 text-white shadow-lg border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Quick PDF Guide Download */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300 border border-teal-400/30">
                  <Sparkles className="h-3 w-3" />
                  {t.badge}
                </span>
                <span className="text-xs text-slate-400 hidden lg:inline">{t.guideDesc}</span>
              </div>
              <a
                href="/pdf/carecalculus-pocket-guide-2026.pdf"
                download="CareCalculus_2026_ICU_ER_Pocket_Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-300 hover:text-teal-200 transition-colors group"
                title="Download 2026 Clinical Pocket Guide"
              >
                <Download className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform text-teal-400" />
                <span className="underline decoration-teal-400/60 underline-offset-2">{t.guideBtn}</span>
              </a>
            </div>
          </div>

          {/* Right: Bedside Interactive Actions */}
          <div className="flex items-center flex-wrap gap-2 pt-2 md:pt-0 border-t border-slate-700/60 md:border-t-0">
            {/* Save to Favorites */}
            <button
              onClick={() => toggleFavorite(logicalPath)}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                favorited
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
              }`}
              title={favorited ? t.savedFav : t.saveFav}
            >
              <Star className={`h-3.5 w-3.5 ${favorited ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
              <span>{favorited ? t.savedFav : t.saveFav}</span>
            </button>

            {/* Add to Hospital Home Screen */}
            <button
              onClick={handleInstall}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 transition-all shadow-sm"
              title={t.installBtn}
            >
              <Smartphone className="h-3.5 w-3.5 text-teal-300" />
              <span>{t.installBtn}</span>
            </button>

            {/* Share / Copy Handover Link */}
            <button
              onClick={handleCopyLink}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 transition-all"
              title={copied ? t.copied : t.shareBtn}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-300" />
                  <span className="hidden sm:inline">{t.shareBtn}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* PWA Install Instructions Modal for iOS/desktop where prompt isn't auto-triggered */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t.pwaModalTitle}</h3>
                <p className="text-xs text-teal-300">Fast • 100% Offline • No App Store needed</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.pwaModalDesc}
            </p>

            <div className="space-y-2 bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-xs text-slate-200">
              <div className="flex items-start gap-2">
                <span className="font-bold text-teal-300">iOS (Safari):</span>
                <span>{t.pwaIosStep}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-teal-300">Android (Chrome):</span>
                <span>{t.pwaAndroidStep}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPwaModal(false)}
                type="button"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
