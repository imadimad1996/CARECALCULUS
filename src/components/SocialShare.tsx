import React, { useState } from 'react';
import { Share2, Link2, Check, MessageCircle } from 'lucide-react';
import { LangCode } from '../types';

/**
 * Social sharing bar for calculator results and article pages.
 * Supports WhatsApp (huge in MENA), Twitter/X, LinkedIn, and Copy Link.
 * Drives viral loops — critical for user growth.
 */

interface SocialShareProps {
  /** Page title to share */
  title: string;
  /** Optional custom text (e.g., "My BMI is 24.5 — check yours!") */
  shareText?: string;
  /** Current language for localized labels */
  lang: LangCode;
  /** Compact mode for inline use */
  compact?: boolean;
}

const T = {
  en: { share: 'Share', copied: 'Copied!', copyLink: 'Copy Link' },
  fr: { share: 'Partager', copied: 'Copié !', copyLink: 'Copier le lien' },
  ar: { share: 'مشاركة', copied: 'تم النسخ!', copyLink: 'نسخ الرابط' },
};

export default function SocialShare({ title, shareText, lang, compact = false }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const t = T[lang];

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://carecalculus.com';
  const text = shareText || title;
  const encodedText = encodeURIComponent(`${text}\n${pageUrl}`);
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pageUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const buttons = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}`,
      bg: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366]',
      border: 'border-[#25D366]/20',
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}`,
      bg: 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900',
      border: 'border-gray-900/10',
      icon: <span className="text-xs font-black">𝕏</span>,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: 'bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5]',
      border: 'border-[#0077B5]/20',
      icon: <span className="text-xs font-bold">in</span>,
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {buttons.map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg border ${btn.bg} ${btn.border} transition-all active:scale-95`}
            title={`${t.share} via ${btn.label}`}
            style={{ minWidth: '36px', minHeight: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {btn.icon}
          </a>
        ))}
        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg border transition-all active:scale-95 ${
            copied
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
          }`}
          title={t.copyLink}
          style={{ minWidth: '36px', minHeight: '36px' }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-4 h-4 text-gray-400" />
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">{t.share}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {buttons.map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${btn.bg} ${btn.border}`}
            style={{ minHeight: '40px' }}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </a>
        ))}
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
            copied
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
          }`}
          style={{ minHeight: '40px' }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          <span>{copied ? t.copied : t.copyLink}</span>
        </button>
      </div>
    </div>
  );
}
