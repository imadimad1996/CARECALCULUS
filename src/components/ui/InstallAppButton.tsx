import React, { useState, useEffect } from 'react';
import { DownloadCloud } from 'lucide-react';
import { LangCode } from '../../types';

interface InstallAppButtonProps {
  lang: LangCode;
  className?: string;
}

export default function InstallAppButton({ lang, className = '' }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 transition-all ${className}`}
      style={{ minHeight: '36px' }}
      title={lang === 'fr' ? 'Installer l\'application' : lang === 'ar' ? 'تثبيت التطبيق' : 'Install App'}
    >
      <DownloadCloud className="w-3.5 h-3.5 text-indigo-500" />
      <span className="hidden sm:inline">
        {lang === 'fr' ? 'Installer' : lang === 'ar' ? 'تثبيت' : 'Install App'}
      </span>
    </button>
  );
}
