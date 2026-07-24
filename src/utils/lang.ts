import { createContext, useContext } from 'react';
import { LangCode } from '../types';

export const LANGS: LangCode[] = ['en', 'fr'];

// English is served bare (no prefix); French is prefixed.
export const PREFIXED_LANGS: LangCode[] = ['fr'];

import translationsRaw from '../data/translations.json';

export const layoutTranslations = translationsRaw;

export function getDomainLang(): LangCode | null {
  if (typeof window === 'undefined') return null;
  if (window.location.hostname.startsWith('fr.')) return 'fr';
  return null;
}

/**
 * Split a pathname into its language and the language-agnostic "logical" path.
 * Supports both /fr/ prefix routing (for local dev / fallback) and fr. domain routing.
 */
export function parsePathname(pathname: string): { lang: LangCode; path: string } {
  // Canonicalize: strip trailing slash (except for exactly "/")
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  
  const match = cleanPath.match(/^\/(fr)(\/.*)?$/);
  if (match) {
    return { lang: match[1] as LangCode, path: match[2] || '/' };
  }
  const domainLang = getDomainLang();
  if (domainLang === 'fr') {
    return { lang: 'fr', path: cleanPath || '/' };
  }
  return { lang: 'en', path: cleanPath || '/' };
}

/**
 * Prefix a logical path for a given language.
 */
export function buildPath(path: string, lang: LangCode): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const domainLang = getDomainLang();
  if (domainLang === 'fr') {
    if (lang === 'fr') return clean;
    return clean;
  }
  if (lang === 'en') return clean;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

interface LangContextValue {
  lang: LangCode;
  /** Prefix a logical path for the current language. */
  langPath: (path: string) => string;
}

export const LangContext = createContext<LangContextValue>({
  lang: 'en',
  langPath: (path) => path,
});

/** Access the active language and a helper to build language-aware URLs. */
export const useLang = () => useContext(LangContext);

