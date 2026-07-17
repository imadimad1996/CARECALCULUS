import React, { useState, useEffect } from 'react';
import { Lock, Share2, Unlock } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  id: string; // unique ID for the resource
}

export default function GamificationLock({ children, id }: Props) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shares, setShares] = useState(0);

  useEffect(() => {
    const savedShares = parseInt(localStorage.getItem(`carecalculus_shares_${id}`) || '0', 10);
    if (savedShares >= 3) {
      setIsUnlocked(true);
    }
    setShares(savedShares);
  }, [id]);

  const handleShare = () => {
    const text = "Found an amazing open-source library of medical summaries and clinical tools. Check it out: https://carecalculus.com";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    
    const newShares = shares + 1;
    setShares(newShares);
    localStorage.setItem(`carecalculus_shares_${id}`, newShares.toString());
    
    if (newShares >= 3) {
      setIsUnlocked(true);
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none filter blur-sm">
        {children}
      </div>
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl max-w-sm text-center border border-teal-100/50">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Premium PDF Locked</h3>
        <p className="text-sm text-slate-500 mb-6 font-medium">
          Support our open-source mission! Share this platform with 3 friends or medical WhatsApp groups to unlock this resource instantly forever.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 rounded-xl font-bold transition shadow-md active:scale-95"
          >
            <Share2 className="w-5 h-5" />
            Share to WhatsApp ({shares}/3)
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-wider">
          {3 - shares} shares remaining
        </p>
      </div>
    </div>
  );
}
