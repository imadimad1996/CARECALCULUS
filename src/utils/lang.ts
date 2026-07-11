import { createContext, useContext } from 'react';
import { LangCode } from '../types';

export const LANGS: LangCode[] = ['en', 'fr'];

// English is served bare (no prefix); French is prefixed.
export const PREFIXED_LANGS: LangCode[] = ['fr'];

import translationsRaw from '../data/translations.json';

export const layoutTranslations = translationsRaw;

/**
 * Split a pathname into its language and the language-agnostic "logical" path.
 *   /fr/map-calculator      -> { lang: 'fr', path: '/map-calculator' }
 *   /ar/blog/some-slug      -> { lang: 'ar', path: '/blog/some-slug' }
 *   /map-calculator         -> { lang: 'en', path: '/map-calculator' }
 *   /fr                     -> { lang: 'fr', path: '/' }
 */
export function parsePathname(pathname: string): { lang: LangCode; path: string } {
  const match = pathname.match(/^\/(fr)(\/.*)?$/);
  if (match) {
    return { lang: match[1] as LangCode, path: match[2] || '/' };
  }
  return { lang: 'en', path: pathname || '/' };
}

/**
 * Prefix a logical path for a given language.
 *   buildPath('/map-calculator', 'fr') -> '/fr/map-calculator'
 *   buildPath('/map-calculator', 'en') -> '/map-calculator'
 *   buildPath('/', 'ar')               -> '/ar'
 */
export function buildPath(path: string, lang: LangCode): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
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

