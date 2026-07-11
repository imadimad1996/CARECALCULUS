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

const BASE_URL = 'https://carecalculus.com';
const OUTPUT_PATH = join(process.cwd(), 'public', 'sitemap.xml');

// Read faqDb to extract all Q&A slugs
const faqDb = JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', 'faqDb.json'), 'utf-8'));

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

const staticPages = ['/about', '/disclaimer', '/privacy', '/terms', '/glp-1-hub', '/nutrition-hub'];

// Build all Q&A slug pages
const qaSlugs: string[] = [];
for (const [, entries] of Object.entries(faqDb) as [string, {question: string}[]][]) {
  for (const entry of entries) {
    const slug = slugifyQuestion(entry.question);
    if (slug) qaSlugs.push(`/q/${slug}`);
  }
}

const domains = ['https://www.carecalculus.com', 'https://fr.carecalculus.com'] as const;

function buildUrls(paths: string[], priority: string, changefreq: string): string {
  const urls: string[] = [];
  for (const path of paths) {
    for (const domain of domains) {
      urls.push(`
  <url>
    <loc>${domain}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }
  }
  return urls.join('');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage -->
  <url>
    <loc>https://www.carecalculus.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fr.carecalculus.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${buildUrls(calculatorPages, '0.9', 'monthly')}
${buildUrls(conditionPages, '0.8', 'monthly')}
${buildUrls(specialtyPages, '0.8', 'monthly')}
${buildUrls(comparisonPages, '0.7', 'monthly')}
${buildUrls(qaSlugs, '0.7', 'weekly')}
${buildUrls(staticPages, '0.5', 'monthly')}
</urlset>`;

writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');

const totalUrls = (
  2 +
  calculatorPages.length * 2 +
  conditionPages.length * 2 +
  specialtyPages.length * 2 +
  comparisonPages.length * 2 +
  qaSlugs.length * 2 +
  staticPages.length * 2
);

console.log(`✅ sitemap.xml generated: ${OUTPUT_PATH}`);
console.log(`📊 Total URLs indexed: ${totalUrls}`);
console.log(`  - Calculator pages: ${calculatorPages.length * 2}`);
console.log(`  - Condition pages: ${conditionPages.length * 2}`);
console.log(`  - Specialty pages: ${specialtyPages.length * 2}`);
console.log(`  - Comparison pages: ${comparisonPages.length * 2}`);
console.log(`  - Clinical Q&A pages: ${qaSlugs.length * 2} (THE 100x MULTIPLIER)`);
console.log(`  - Static pages: ${staticPages.length * 2}`);
