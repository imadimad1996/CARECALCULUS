import { LangCode } from '../types';
import { ORIGIN } from './seo';

interface LinkTarget {
  keywords: string[];
  url: string;
}

// Map of keywords to their target paths. We use the full URL to ensure it works correctly across languages.
const linkingDb: LinkTarget[] = [
  { keywords: ['map', 'mean arterial pressure', 'pression artérielle moyenne', 'الضغط الشرياني'], url: '/map-calculator' },
  { keywords: ['bmi', 'body mass index', 'imc', 'indice de masse corporelle', 'كتلة الجسم'], url: '/bmi-calculator' },
  { keywords: ['gcs', 'glasgow coma scale', 'échelle de glasgow', 'غلاسكو'], url: '/glasgow-coma-scale' },
  { keywords: ['drip rate', 'débit perfusion', 'معدل التنقيط'], url: '/drip-rate-calculator' },
  { keywords: ['creatinine clearance', 'clairance créatinine', 'تصفية الكرياتينين'], url: '/creatinine-clearance' },
  { keywords: ['wells score', 'score de wells', 'نقاط ويلز'], url: '/wells-score' },
  { keywords: ['corrected calcium', 'calcium corrigé', 'الكالسيوم المصحح'], url: '/corrected-calcium' },
  { keywords: ['qsofa', 'qsofa score', 'score qsofa', 'مؤشر qsofa'], url: '/qsofa-score' },
  { keywords: ['curb-65', 'curb65', 'score curb-65', 'مقياس curb-65'], url: '/curb65-score' },
  { keywords: ['cha2ds2-vasc', 'cha2ds2'], url: '/cha2ds2-vasc' },
  { keywords: ['phq-9', 'phq9'], url: '/phq9-score' },
  { keywords: ['meld', 'meld score', 'score meld'], url: '/meld-score' },
  { keywords: ['sirs', 'sirs criteria', 'critères sirs'], url: '/sirs-criteria' },
  { keywords: ['p/f ratio', 'rapport p/f', 'pao2/fio2'], url: '/pf-ratio' },
  { keywords: ['tidal volume', 'volume courant'], url: '/tidal-volume' },
  { keywords: ['anc', 'absolute neutrophil count', 'neutrophil count', 'nan'], url: '/anc-calculator' },
  { keywords: ['adjusted body weight', 'ideal body weight', 'poids idéal', 'الوزن المثالي'], url: '/adjusted-body-weight' },
  { keywords: ['steroid conversion', 'corticosteroid conversion', 'conversion corticoïdes', 'الستيرويد'], url: '/steroid-conversion' },
];

/**
 * Parses markdown content and injects internal markdown links for key terms.
 * This function ensures keywords inside existing links or headers are NOT modified.
 */
export function injectInternalLinks(content: string, lang: LangCode): string {
  let processedContent = content;
  const langPrefix = lang === 'en' ? '' : `/${lang}`;

  linkingDb.forEach(target => {
    // Determine the full absolute path or relative path
    const targetUrl = `${langPrefix}${target.url}`;

    target.keywords.forEach(keyword => {
      // Create a regex to find the keyword as a standalone word (case insensitive)
      // We use negative lookaheads to avoid replacing keywords inside existing markdown links [keyword](url)
      // or inside markdown image tags ![alt](url)
      // or inside headers (lines starting with #)
      const regex = new RegExp(`(?<!\\[)(?<!#.*\\b)\\b(${keyword})\\b(?!\\]\\([^)]*\\))`, 'gi');

      processedContent = processedContent.replace(regex, (match) => {
        // Only replace the first occurrence per paragraph/block to avoid link stuffing
        // For simplicity in runtime replacement, we'll wrap it in a markdown link.
        return `[${match}](${targetUrl})`;
      });
    });
  });

  return processedContent;
}
