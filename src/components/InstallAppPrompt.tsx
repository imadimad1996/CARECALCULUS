import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePopupLock } from '../utils/popupManager';

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [wantsToShow, setWantsToShow] = useState(false);
  const [hasLock, releaseLock] = usePopupLock('install-app', wantsToShow);

  useEffect(() => {
    // Only show to returning users (visit_count > 1) and if not dismissed
    const visits = parseInt(localStorage.getItem('visit_count') || '1', 10);
    const hasDismissed = localStorage.getItem('pwa_prompt_dismissed') === 'true';

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (visits > 1 && !hasDismissed) {
        setWantsToShow(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Fallback for iOS returning users
    const isIos = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
    const isStandalone = ('standalone' in navigator) && ((navigator as any).standalone === true);
    
    if (isIos && !isStandalone && visits > 1 && !hasDismissed) {
      setWantsToShow(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setWantsToShow(false);
      releaseLock();
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      const isFr = localStorage.getItem('carecalculus-lang') === 'fr';
      alert(isFr 
        ? "Pour installer, appuyez sur l'icône de partage puis sur 'Sur l'écran d'accueil'." 
        : "To install, tap the Share icon and select 'Add to Home Screen'.");
    }
  };

  const handleDismiss = () => {
    setWantsToShow(false);
    releaseLock();
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!wantsToShow || !hasLock) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-white shadow-2xl rounded-2xl border border-slate-200 p-4 z-50 animate-in slide-in-from-bottom-4">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-start gap-4">
        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
          <Download className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm mb-1">Install CareCalculus</h4>
          <p className="text-xs text-slate-500 mb-3">Get offline access and native app features.</p>
          <button 
            onClick={handleInstallClick}
            className="bg-indigo-600 text-white text-sm font-semibold py-1.5 px-4 rounded-lg shadow-sm hover:bg-indigo-700 transition"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
