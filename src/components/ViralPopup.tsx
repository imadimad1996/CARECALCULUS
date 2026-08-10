import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Share2, X, Users, HeartPulse } from 'lucide-react';
import { usePopupLock } from '../utils/popupManager';

export default function ViralPopup() {
  const [wantsToShow, setWantsToShow] = useState(false);
  const [hasLock, releaseLock] = usePopupLock('viral-popup', wantsToShow);

  useEffect(() => {
    const handleData = () => {
      // Do not show for premium users
      const isPro = localStorage.getItem('carecalculus_pro_status') === 'active';
      if (isPro) return;

      // Increment calc success counter
      let calcUses = parseInt(localStorage.getItem('carecalculus_viral_uses') || '0', 10);
      calcUses += 1;
      localStorage.setItem('carecalculus_viral_uses', calcUses.toString());

      // If user has successfully copied calculators twice and hasn't dismissed the popup recently
      const lastDismissed = localStorage.getItem('carecalculus_share_dismissed');
      const timeSinceDismissal = lastDismissed ? Date.now() - parseInt(lastDismissed, 10) : Infinity;
      const hoursSinceDismissal = timeSinceDismissal / (1000 * 60 * 60);

      if (calcUses >= 2 && hoursSinceDismissal > 24) {
        setWantsToShow(true);
      }
    };

    window.addEventListener('carecalculus:calc-success', handleData);
    return () => window.removeEventListener('carecalculus:calc-success', handleData);
  }, []);

  if (!wantsToShow || !hasLock) return null;

  const handleDismiss = () => {
    setWantsToShow(false);
    releaseLock();
    localStorage.setItem('carecalculus_share_dismissed', Date.now().toString());
  };

  const handleShareWhatsApp = () => {
    const text = "I've been using CareCalculus for my clinical shifts. It's an insanely fast, open-source medical calculator. Check it out: https://carecalculus.com";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    handleDismiss();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 text-white text-center relative">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black mb-2">Help Us Stay Free!</h2>
          <p className="text-emerald-50 text-sm font-medium">
            CareCalculus is built by clinicians, for clinicians. If you've found it useful, please share it with your ward, residents, or study group.
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <button 
            onClick={handleShareWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Users className="w-6 h-6" />
            Share to WhatsApp Group
          </button>
          
          <button 
            onClick={handleDismiss}
            className="w-full py-3 text-slate-400 hover:text-slate-600 text-sm font-semibold transition cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
