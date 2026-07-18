import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setShowPrompt(false);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-white shadow-2xl rounded-2xl border border-slate-200 p-4 z-50 animate-in slide-in-from-bottom-4">
      <button 
        onClick={() => setShowPrompt(false)}
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
