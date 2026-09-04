/**
 * generate-sitemap.ts
 * Generates a comprehensive sitemap.xml for CareCalculus covering:
 * - All calculator pages in EN / FR / AR
 * - All clinical Q&A pages in EN / FR / AR (the 100x SEO multiplier)
 * - All condition, specialty, comparison pages
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

import { slugify } from '../src/utils/slug';

const BASE_URL = 'https://carecalculus.com';
const OUTPUT_PATH = join(process.cwd(), 'public', 'sitemap.xml');

// Removed programmatic and FAQ paths

function slugifyQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

// All static calculator pages
const calculatorPages = [
  '/map-calculator', '/bmi-calculator', '/glasgow-coma-scale', '/drip-rate-calculator',
  '/creatinine-clearance', '/mdrd-gfr', '/ckd-epi-gfr', '/wells-score',
  '/medical-conversions', '/corrected-calcium', '/qsofa-score', '/curb65-score',
  '/cha2ds2-vasc', '/phq9-score', '/meld-score', '/sirs-criteria',
  '/pf-ratio', '/tidal-volume', '/anc-calculator', '/adjusted-body-weight',
  '/steroid-conversion', '/apgar-score', '/sofa-score', '/child-pugh-score',
  '/anion-gap', '/aa-gradient', '/nutrition-tdee', '/nutrition-must', '/nutrition-nrs2002',
  '/phenytoin-correction', '/ascvd-risk', '/vancomycin-dosing', '/aminoglycoside-dosing',
  '/pesi-score', '/bova-score', '/apache-ii-score', '/saps-ii-score',
  '/bishop-score', '/centor-score', '/pediatric-gcs', '/holliday-segar-fluids',
  '/pediatric-dosage', '/naegele-edd-calculator', '/gestational-age-crl',
  '/four-ts-hit-score', '/mascc-risk-index', '/rumack-matthew-nomogram',
  '/framingham-risk-score', '/hfa-peff-score', '/schwartz-pediatric-gfr',
  '/braden-scale', '/morse-fall-scale', '/news2-score', '/mews-score',
  '/wong-baker-faces', '/flacc-score', '/rass-score', '/cam-icu',
  '/insulin-sliding-scale', '/ascvd-risk-score', '/benzo-equivalence',
  '/tpn-macronutrients', '/digoxin-dosing', '/protamine-reversal',
  '/phenytoin-loading', '/warfarin-dosing', '/rcri-score', '/apri-score',
  '/meld-na-score', '/fena-calculator', '/nnt-calculator',
  '/sample-size-calculator', '/or-to-rr', '/fragility-index'
];

const academicPages = [
  '/cours',
  '/fmp-medecine',
  '/ispits',
  '/ispits/anatomie-et-physiologie-i',
  '/fmp-medecine/anatomie-iii',
  '/ispits/soins-infirmiers-en-nephrologie-et-dialyse'
];

const conditionPages = [
  '/conditions/sepsis', '/conditions/liver-disease', '/conditions/atrial-fibrillation',
  '/conditions/respiratory-failure', '/conditions/renal-failure',
];

const specialtyPages = [
  '/specialties/intensive-care', '/specialties/emergency-medicine',
  '/specialties/internal-medicine', '/specialties/nephrology',
  '/specialties/cardiology', '/specialties/pulmonology', '/specialties/neurology',
];

const comparisonPages = [
  '/compare/map-calculator-vs-qsofa-score',
  '/compare/qsofa-score-vs-sirs-criteria',
  '/compare/qsofa-score-vs-sofa-score',
  '/compare/glasgow-coma-scale-vs-qsofa-score',
  '/compare/curb65-score-vs-qsofa-score',
  '/compare/bmi-calculator-vs-adjusted-body-weight',
  '/compare/meld-score-vs-child-pugh-score',
  '/compare/mdrd-gfr-vs-ckd-epi-gfr',
  '/compare/creatinine-clearance-vs-mdrd-gfr',
];

const staticPages = ['/about', '/disclaimer', '/privacy', '/terms', '/glp-1-hub', '/nutrition-hub', '/pricing', '/embed-gallery'];





const domains = ['https://www.carecalculus.com', 'https://fr.carecalculus.com', 'https://es.carecalculus.com'] as const;

function buildUrls(paths: string[], priority: string, changefreq: string, frPriority?: string): string {
  const urls: string[] = [];
  for (const path of paths) {
    const enUrl = `https://www.carecalculus.com${path}`;
    const frUrl = `https://fr.carecalculus.com${path}`;
    const esUrl = `https://es.carecalculus.com${path}`;
    
    // EN Entry
    urls.push(`
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);

    // FR Entry
    const pFr = frPriority || priority;
    urls.push(`
  <url>
    <loc>${frUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <changefreq>${changefreq}</changefreq>
    <priority>${pFr}</priority>
  </url>`);

    // ES Entry
    urls.push(`
  <url>
    <loc>${esUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <changefreq>${changefreq}</changefreq>
    <priority>${pFr}</priority>
  </url>`);
  }
  return urls.join('');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage -->
  <url>
    <loc>https://www.carecalculus.com/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://fr.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://es.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.carecalculus.com/" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fr.carecalculus.com/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://fr.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://es.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.carecalculus.com/" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://es.carecalculus.com/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://fr.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://es.carecalculus.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.carecalculus.com/" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${buildUrls(calculatorPages, '1.0', 'weekly', '0.8')}
${buildUrls(academicPages, '0.9', 'weekly', '0.95')}
${buildUrls(conditionPages, '0.8', 'monthly', '0.8')}
${buildUrls(specialtyPages, '0.8', 'monthly', '0.8')}
${buildUrls(comparisonPages, '0.7', 'monthly', '0.7')}

${buildUrls(staticPages, '0.5', 'monthly', '0.5')}
</urlset>`;

writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');

const totalUrls = (
  3 +
  calculatorPages.length * 3 +
  academicPages.length * 3 +
  conditionPages.length * 3 +
  specialtyPages.length * 3 +
  comparisonPages.length * 3 +
  staticPages.length * 3
);

console.log(`✅ sitemap.xml generated: ${OUTPUT_PATH}`);
console.log(`📊 Total URLs indexed: ${totalUrls}`);
console.log(`  - Calculator pages: ${calculatorPages.length * 3}`);
console.log(`  - Academic pages: ${academicPages.length * 3}`);
console.log(`  - Condition pages: ${conditionPages.length * 3}`);
console.log(`  - Specialty pages: ${specialtyPages.length * 3}`);
console.log(`  - Comparison pages: ${comparisonPages.length * 3}`);
console.log(`  - Static pages: ${staticPages.length * 3}`);
