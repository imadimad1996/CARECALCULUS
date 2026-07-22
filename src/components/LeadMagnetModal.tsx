import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle2, X, Sparkles, Mail, Lock } from 'lucide-react';
import { LangCode } from '../types';

export interface LeadMagnetModalProps {
  lang: LangCode;
}

const LOCAL_KEY = 'carecalculus_lead_magnet_subscribed';

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFr = lang === 'fr';

  useEffect(() => {
    // Show modal after 15 seconds if not already subscribed
    const isSubscribed = localStorage.getItem(LOCAL_KEY);
    if (!isSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      // POST to Cloudflare Pages Function backend
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      });

      if (!res.ok) throw new Error('Failed to subscribe');

      localStorage.setItem(LOCAL_KEY, 'true');
      setIsSubmitted(true);
    } catch (e) {
      console.error('Lead save error', e);
      // Fallback: still let them download the guide even if network fails
      setIsSubmitted(true);
    }
  };

  const handleDownloadPdf = () => {
    // Download real 10/10 multi-page clinical PDF guide
    const pdfUrl = '/assets/docs/CareCalculus_2026_ICU_ER_Pocket_Guide.pdf';
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'CareCalculus_2026_ICU_ER_Pocket_Guide.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {isFr ? 'Votre Guide est Prêt !' : 'Your Pocket Guide is Ready!'}
            </h3>
            <p className="text-xs text-slate-300">
              {isFr
                ? 'Cliquez ci-dessous pour télécharger votre Guide de Poche Médical Réanimation 2026.'
                : 'Click below to instantly download your 2026 ICU & Emergency Medical Pocket Guide.'}
            </p>
            <button
              onClick={handleDownloadPdf}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isFr ? 'Télécharger le Guide Officiel (PDF 2026)' : 'Download Official Guide (2026 PDF)'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  FREE DOWNLOAD
                </span>
                <h3 className="font-bold text-xl text-white mt-1">
                  {isFr ? 'Guide de Poche Réanimation 2026' : '2026 ICU & ER Pocket Guide'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? 'Obtenez notre aide-mémoire clinique condensé (Sepsis-3, Wells MTEV, PAM, ARDS) directement dans votre poche.'
                : 'Get our high-yield clinical cheat sheet covering Sepsis-3, Wells DVT rules, MAP titration, and ARDS protective ventilation targets.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder={isFr ? 'votre.email@hopital.fr' : 'doctor@hospital.org'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isFr ? 'Obtenir le Guide Gratuit' : 'Get Free Pocket Guide'}</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{isFr ? '100% Confidentiel • Zéro Spam' : '100% Confidential • Zero Spam'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
