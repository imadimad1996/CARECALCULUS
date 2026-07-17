import React, { useState, useEffect } from 'react';
import { Share2, X, Users, HeartPulse } from 'lucide-react';

export default function ViralPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleData = () => {
      // Increment calc usage counter
      let calcUses = parseInt(localStorage.getItem('carecalculus_uses') || '0', 10);
      calcUses += 1;
      localStorage.setItem('carecalculus_uses', calcUses.toString());

      // If user has used calculators twice and hasn't dismissed the popup recently
      const lastDismissed = localStorage.getItem('carecalculus_share_dismissed');
      const timeSinceDismissal = lastDismissed ? Date.now() - parseInt(lastDismissed, 10) : Infinity;
      const hoursSinceDismissal = timeSinceDismissal / (1000 * 60 * 60);

      if (calcUses >= 2 && hoursSinceDismissal > 24) {
        setIsVisible(true);
      }
    };

    window.addEventListener('carecalculus:calc-data', handleData);
    return () => window.removeEventListener('carecalculus:calc-data', handleData);
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('carecalculus_share_dismissed', Date.now().toString());
  };

  const handleShareWhatsApp = () => {
    const text = "I've been using CareCalculus for my clinical shifts. It's an insanely fast, open-source medical calculator. Check it out: https://carecalculus.com";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    handleDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 text-white text-center relative">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
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
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Users className="w-6 h-6" />
            Share to WhatsApp Group
          </button>
          
          <button 
            onClick={handleDismiss}
            className="w-full py-3 text-slate-400 hover:text-slate-600 text-sm font-semibold transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
