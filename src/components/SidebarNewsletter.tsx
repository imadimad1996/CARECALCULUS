import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { LangCode } from '../types';

interface SidebarNewsletterProps {
  lang: LangCode;
}

const T = {
  en: {
    title: 'Clinical Digest',
    desc: 'Get weekly ICU reference tools & CME course updates.',
    placeholder: 'Email address',
    cta: 'Subscribe',
    success: 'Subscribed!',
  },
  fr: {
    title: 'Digest Clinique',
    desc: 'Recevez les nouveaux outils de réanimation et de formation.',
    placeholder: 'Votre e-mail',
    cta: 'S\'abonner',
    success: 'Inscrit !',
  },
  
};

export default function SidebarNewsletter({ lang }: SidebarNewsletterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = T[lang];
  const isRtl = false;

  useEffect(() => {
    const subscribed = localStorage.getItem('cc-newsletter-subscribed');
    if (subscribed) {
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    try {
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
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      localStorage.setItem('cc-newsletter-subscribed', email);
      setSubmitted(true);
    } catch (err) {
      console.error('Sidebar newsletter subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto px-6 pt-4 border-t border-gray-150/80">
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 relative overflow-hidden text-left rtl:text-right">
        {submitted ? (
          <div className="flex items-center gap-2 py-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] font-bold text-emerald-600">{t.success}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[10px] font-mono font-black text-teal-600 uppercase tracking-wider">{t.title}</span>
            </div>
            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">{t.desc}</p>
            
            <form onSubmit={handleSubmit} className="space-y-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                disabled={isSubmitting}
                className={`w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
                style={{ minHeight: '34px' }}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-1.5 bg-[#0891B2] hover:bg-[#0891B2]/95 text-white font-extrabold text-[10px] uppercase rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                style={{ minHeight: '32px' }}
              >
                <Mail className="w-3 h-3" />
                <span>{isSubmitting ? '...' : t.cta}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
