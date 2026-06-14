import { createContext, useContext } from 'react';
import { LangCode } from '../types';

export const LANGS: LangCode[] = ['en', 'fr', 'ar'];

// English is served bare (no prefix); French and Arabic are prefixed.
export const PREFIXED_LANGS: LangCode[] = ['fr', 'ar'];

export const layoutTranslations = {
  en: {
    reviewedBy: "Reviewed by the CareCalculus Clinical Team",
    specialists: "MD, ICU & Emergency Medicine specialists",
    updated: "Updated 2026",
    mathMetric: "Mathematical Metric",
    evidenceLit: "Evidence & Lit",
    seeAlso: "See Also",
    faqTitle: "Frequently Asked Questions"
  },
  fr: {
    reviewedBy: "Revu par l'équipe clinique de CareCalculus",
    specialists: "Médecins, spécialistes en réanimation & urgences",
    updated: "Mis à jour en 2026",
    mathMetric: "Métrique Mathématique",
    evidenceLit: "Preuves & Littérature",
    seeAlso: "Voir aussi",
    faqTitle: "Questions Fréquemment Posées"
  },
  ar: {
    reviewedBy: "تمت المراجعة من قبل الفريق الطبي السريري لـ CareCalculus",
    specialists: "أطباء استشاريين، أخصائيي العناية المركزة وطب الطوارئ",
    updated: "تم التحديث 2026",
    mathMetric: "المعادلة الرياضية",
    evidenceLit: "الأدلة والدراسات العلمية",
    seeAlso: "اقرأ أيضاً",
    faqTitle: "الأسئلة الشائعة"
  }
};

/**
 * Split a pathname into its language and the language-agnostic "logical" path.
 *   /fr/map-calculator      -> { lang: 'fr', path: '/map-calculator' }
 *   /ar/blog/some-slug      -> { lang: 'ar', path: '/blog/some-slug' }
 *   /map-calculator         -> { lang: 'en', path: '/map-calculator' }
 *   /fr                     -> { lang: 'fr', path: '/' }
 */
export function parsePathname(pathname: string): { lang: LangCode; path: string } {
  const match = pathname.match(/^\/(fr|ar)(\/.*)?$/);
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

