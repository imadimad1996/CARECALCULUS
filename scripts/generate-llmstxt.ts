/**
 * generate-llmstxt.ts
 * Generates official /llms.txt standard file for AI engine crawlers (ChatGPT, Claude, Gemini, Perplexity).
 * Run: npx tsx scripts/generate-llmstxt.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import seoMaps from '../src/data/seoMaps.json';

const OUTPUT_PATH = join(process.cwd(), 'public', 'llms.txt');
const FULL_OUTPUT_PATH = join(process.cwd(), 'public', 'llms-full.txt');

const faqDb = JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', 'faqDb.json'), 'utf-8'));

// Filter for calculators
const excludePrefixes = ['/conditions', '/specialties', '/compare', '/clinical', '/blog', '/fmp', '/ispits', '/medical-conversions/', '/about', '/disclaimer', '/privacy', '/terms', '/for-hospitals', '/embed-gallery', '/favorites', '/presentations', '/cours', '/hub', '/glp'];
const calculatorPaths = Object.keys(seoMaps.nameEnMap).filter(path => !excludePrefixes.some(prefix => path.startsWith(prefix)));

let content = `# CareCalculus — Evidence-Based Clinical Decision Support Suite

> CareCalculus is a free, open-access, peer-reviewed clinical decision support platform for ICU, ER, and hospital clinicians worldwide. All formulas, cutoffs, and risk models are strictly aligned with international guidelines (AHA, ESC, KDIGO, SFAR, NIH).

## Core Clinical Calculators & Scoring Tools (English)

`;

calculatorPaths.forEach(path => {
  content += `- [${seoMaps.nameEnMap[path as keyof typeof seoMaps.nameEnMap]}](https://carecalculus.com${path})\n`;
});

content += `
## Calculateurs Cliniques (Français)

`;

calculatorPaths.forEach(path => {
  const frTitle = seoMaps.nameFrMap[path as keyof typeof seoMaps.nameFrMap];
  if (frTitle) {
    content += `- [${frTitle}](https://fr.carecalculus.com${path})\n`;
  }
});

content += `
## Academic & Multilingual Libraries

- [French Clinical Hub (/fr)](https://fr.carecalculus.com): Full suite localized in French (SFAR, HAS guideline aligned).
- [FMP Médecine Casablanca (/fmp-medecine)](https://carecalculus.com/fmp-medecine): Academic medical student module library.
- [ISPITS Paramedical Academy (/ispits)](https://carecalculus.com/ispits): Nursing & ICU anesthesia academic curriculum library.
- [Clinical Guidelines Library](https://carecalculus.com/clinical-library): Comprehensive evidence-based clinical guides and Q&A references.

## Citation & Guideline Authority
- AHA (American Heart Association)
- ESC (European Society of Cardiology)
- KDIGO (Kidney Disease: Improving Global Outcomes)
- SFAR (Société Française d'Anesthésie et de Réanimation)
- NIH / National Library of Medicine
`;

writeFileSync(OUTPUT_PATH, content, 'utf-8');
console.log(`✅ llms.txt generated successfully at: ${OUTPUT_PATH}`);

// Build llms-full.txt
let fullContent = content + `\n## Clinical Question & Answer Database (Full Knowledge Base)\n\n`;

for (const [category, entries] of Object.entries(faqDb) as [string, { question: string; answer: string }[]][]) {
  fullContent += `### ${category.toUpperCase()} CLINICAL Q&A\n\n`;
  for (const entry of entries) {
    fullContent += `#### Q: ${entry.question}\n${entry.answer}\n\n`;
  }
}

writeFileSync(FULL_OUTPUT_PATH, fullContent, 'utf-8');
console.log(`✅ llms-full.txt generated successfully at: ${FULL_OUTPUT_PATH}`);

