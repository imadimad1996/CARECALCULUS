import React, { useState, useEffect } from 'react';
import { Mail, X, Sparkles, CheckCircle } from 'lucide-react';
import { LangCode } from '../types';
import { trackNewsletterSignup } from '../utils/telemetry';

/**
 * Elegant newsletter capture component.
 * Appears as a non-intrusive bottom bar after 2 page views.
 * Critical for driving return visits to reach 100K daily users.
 */

interface NewsletterCaptureProps {
  lang: LangCode;
}

const T = {
  en: {
    title: 'Weekly Clinical Digest',
    desc: 'Get new calculators, clinical guidelines, and peer-reviewed summaries every week — free.',
    placeholder: 'Enter your email',
    cta: 'Subscribe',
    success: 'You\'re subscribed! Check your inbox.',
    dismiss: 'Maybe later',
  },
  fr: {
    title: 'Digest Clinique Hebdomadaire',
    desc: 'Recevez chaque semaine les nouveaux outils, recommandations et résumés validés — gratuit.',
    placeholder: 'Votre adresse e-mail',
    cta: 'S\'abonner',
    success: 'Inscription réussie ! Vérifiez votre boîte de réception.',
    dismiss: 'Plus tard',
  },
  
};

export default function NewsletterCapture({ lang }: NewsletterCaptureProps) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = T[lang];
  const isRtl = false;

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    const dismissed = localStorage.getItem('cc-newsletter-dismissed');
    const subscribed = localStorage.getItem('cc-newsletter-subscribed');
    if (dismissed || subscribed) return;

    // Track page views — show after 2 page views
    const views = parseInt(localStorage.getItem('cc-page-views') || '0', 10) + 1;
    localStorage.setItem('cc-page-views', String(views));

    if (views >= 2) {
      // Show after 8 seconds on page
      const timer = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setVisible(false);
    localStorage.setItem('cc-newsletter-dismissed', Date.now().toString());
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // In production, configure VITE_NEWSLETTER_ENDPOINT in your .env file
      // If not configured, we simulate a successful API call for the demo.
      const endpoint = (import.meta as any).env?.VITE_NEWSLETTER_ENDPOINT;
      
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        
        if (!response.ok) throw new Error('Subscription failed');
      } else {
        // Fallback simulation if no API endpoint is provided
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      localStorage.setItem('cc-newsletter-subscribed', email);
      setSubmitted(true);
      trackNewsletterSignup('floating_bar');
      setTimeout(() => setVisible(false), 3000);
    } catch (err) {
      setErrorMsg('Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-5 sm:p-6 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-30 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center`}
            aria-label="Close newsletter prompt"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="flex items-center gap-3 relative z-10">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <p className="text-sm font-semibold text-emerald-400">{t.success}</p>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest">{t.title}</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 max-w-md">{t.desc}</p>

              <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.placeholder}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition disabled:opacity-50 ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                    style={{ minHeight: '44px' }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="shrink-0 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:text-teal-400 text-white text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-teal-500/20"
                  style={{ minHeight: '44px' }}
                >
                  <Mail className="w-4 h-4" />
                  {isSubmitting ? '...' : t.cta}
                </button>
              </form>

              {errorMsg && (
                <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
              )}

              <button
                onClick={handleDismiss}
                className="mt-3 text-[11px] text-slate-500 hover:text-slate-300 transition font-medium"
              >
                {t.dismiss}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
