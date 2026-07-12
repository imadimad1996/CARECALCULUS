// Build-time prerender entry for vite-prerender-plugin.
//
// For each route the plugin requests, we render the full React tree to an HTML
// string with StaticRouter, then hand back the per-route <head> (title, meta,
// canonical, hreflang, OG/Twitter, JSON-LD). The plugin injects the HTML into
// #root and the head elements into <head>, producing a complete static document
// per URL — so Googlebot AND non-JS AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) get real content on first fetch.
//
// The client bundle then hydrates over this markup as a normal SPA.

import { renderToString } from 'react-dom/server';
import App from './App';
import { preloadPages } from './routes';
import { parsePathname } from './utils/lang';
import { buildHead } from './utils/seo';
import { LangCode } from './types';
import { slugify } from './utils/slug';
import { MASTER_JOURNALS, MASTER_BLOGS, MASTER_COURSES, MASTER_PRESENTATIONS } from './utils/masterListContent';
import { ORIGINAL_CURATED_SEED_POSTS } from './pages/MedicalBlog';
import { ORIGINAL_BLOG_SEED } from './pages/Blog';
import { DEFAULT_COURSES } from './pages/Courses';
import { DEFAULT_SUBJECTS } from './pages/Presentations';
import { FMP_MODULES } from './utils/fmpModules';
import { ISPITS_MODULES } from './utils/ispitsModules';
import { CONDITIONS_DB } from './data/conditions';
import { SPECIALTIES_DB } from './data/specialties';
import faqDb from './data/faqDb.json';
import programmaticData from './data/programmaticEngine.json';

let pagesReady: Promise<void> | null = null;

/**
 * Render to a string, retrying across microtask/macrotask turns until the lazy
 * page chunks have resolved (i.e. the Suspense fallback is gone). renderToString
 * is synchronous and does not await Suspense, so we drive resolution manually.
 */
async function renderResolved(url: string): Promise<string> {
  let html = '';
  for (let i = 0; i < 25; i++) {
    html = renderToString(<App url={url} />);
    if (!html.includes('Loading clinical module')) return html;
    // Let any in-flight lazy import promises settle before re-rendering.
    await new Promise((r) => setTimeout(r, 0));
  }
  return html;
}

const journalSlugs = [
  ...ORIGINAL_CURATED_SEED_POSTS,
  ...MASTER_JOURNALS.map(mj => ({ id: mj.id, title: mj.title.en }))
].map(p => `/blog/${slugify(p.title, p.id)}`);

const blogSlugs = [
  ...ORIGINAL_BLOG_SEED,
  ...MASTER_BLOGS.map(mb => ({ id: mb.id, title: mb.title.en }))
].map(p => `/blog-articles/${slugify(p.title, p.id)}`);

const courseSlugs = [
  ...DEFAULT_COURSES,
  ...MASTER_COURSES.map(mc => ({ id: mc.id, title: mc.title.en }))
].map(p => `/cours/${slugify(p.title, p.id)}`);

const presentationSlugs = [
  ...DEFAULT_SUBJECTS,
  ...MASTER_PRESENTATIONS.map(mp => ({ id: mp.id, title: mp.title.en }))
].map(p => `/presentations/${slugify(p.title, p.id)}`);

const fmpSlugs = FMP_MODULES.map(m => `/fmp-medecine/${m.slug}`);
const ispitsSlugs = ISPITS_MODULES.map(m => `/ispits/${m.slug}`);

const conditionSlugs = CONDITIONS_DB.map(c => `/conditions/${c.id}`);
const specialtySlugs = SPECIALTIES_DB.map(s => `/specialties/${s.id}`);

function slugifyQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

const qaSlugs: string[] = [];
for (const entries of Object.values(faqDb as Record<string, { question: string; answer: string }[]>)) {
  for (const entry of entries) {
    const slug = slugifyQuestion(entry.question);
    if (slug) qaSlugs.push(`/q/${slug}`);
  }
}

const programmaticGuideSlugs: string[] = [];
for (const disease of (programmaticData as any).dataSets.diseases) {
  for (const calcSlug of disease.relatedCalculators || []) {
    programmaticGuideSlugs.push(`/clinical-guide/${calcSlug}-in-${disease.slug}`);
  }
}

const compareSlugs = [
  '/compare/map-calculator-vs-glasgow-coma-scale',
  '/compare/mdrd-gfr-vs-ckd-epi-gfr',
  '/compare/qsofa-score-vs-sofa-score',
  '/compare/wells-score-vs-curb65-score',
  '/compare/bmi-calculator-vs-adjusted-body-weight'
];

// Logical (language-agnostic) structural routes worth prerendering. These are
// statically generated so Googlebot + AI crawlers get complete HTML on first
// fetch. Article detail pages (/blog/:slug, etc.) will be added as full-body
// content is authored for each article.
const LOGICAL_ROUTES = [
  '/',
  '/map-calculator',
  '/glasgow-coma-scale',
  '/qsofa-score',
  '/sirs-criteria',
  '/curb65-score',
  '/pf-ratio',
  '/tidal-volume',
  '/creatinine-clearance',
  '/meld-score',
  '/wells-score',
  '/cha2ds2-vasc',
  '/corrected-calcium',
  '/anc-calculator',
  '/drip-rate-calculator',
  '/steroid-conversion',
  '/adjusted-body-weight',
  '/medical-conversions',
  '/bmi-calculator',
  '/phq9-score',
  '/apgar-score',
  '/sofa-score',
  '/child-pugh-score',
  '/anion-gap',
  '/aa-gradient',
  '/blog',
  '/blog-articles',
  '/presentations',
  '/cours',
  '/fmp-medecine',
  '/ispits',
  '/nutrition-tdee',
  '/nutrition-must',
  '/nutrition-nrs2002',
  '/glp-1-hub',
  '/flashcard-generator',
  '/case-study-viewer',
  '/drug-sheets',
  '/study-tracker',
  '/abbreviation-lookup',
  '/about',
  '/disclaimer',
  '/privacy',
  '/terms',
  ...journalSlugs,
  ...blogSlugs,
  ...courseSlugs,
  ...presentationSlugs,
  ...fmpSlugs,
  ...ispitsSlugs,
  ...conditionSlugs,
  ...specialtySlugs,
  ...qaSlugs,
  ...programmaticGuideSlugs,
  ...compareSlugs,
];

const LANGS: LangCode[] = ['en', 'fr'];

/** Every URL (all langs) we want statically generated. */
function allUrls(): string[] {
  const urls: string[] = [];
  for (const path of LOGICAL_ROUTES) {
    for (const lang of LANGS) {
      if (lang === 'en') urls.push(path);
      else urls.push(path === '/' ? `/${lang}` : `/${lang}${path}`);
    }
  }
  return urls;
}

interface HeadElement {
  type: string;
  props: Record<string, any>;
}

export async function prerender(data: { url: string }) {
  const url = data.url || '/';
  const { lang, path: logicalPath } = parsePathname(url);
  const head = buildHead(logicalPath, lang);

  // Prime lazy page chunks once, then render with Suspense resolved.
  if (!pagesReady) pagesReady = preloadPages();
  await pagesReady;
  const html = await renderResolved(url);

  const elements: HeadElement[] = [
    { type: 'meta', props: { name: 'description', content: head.meta.desc } },
    { type: 'meta', props: { name: 'keywords', content: head.meta.keywords } },
    { type: 'link', props: { rel: 'canonical', href: head.url } },

    // Open Graph
    { type: 'meta', props: { property: 'og:title', content: head.title } },
    { type: 'meta', props: { property: 'og:description', content: head.meta.desc } },
    { type: 'meta', props: { property: 'og:url', content: head.url } },
    { type: 'meta', props: { property: 'og:type', content: 'website' } },
    { type: 'meta', props: { property: 'og:site_name', content: 'CareCalculus Clinical Suite' } },
    { type: 'meta', props: { property: 'og:image', content: head.ogImage } },
    { type: 'meta', props: { property: 'og:image:alt', content: 'CareCalculus — Free multilingual clinical calculators for ICU, ER and hospital clinicians' } },
    {
      type: 'meta',
      props: {
        property: 'og:locale',
        content: lang === 'fr' ? 'fr_FR' : 'en_US',
      },
    },

    // Twitter
    { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
    { type: 'meta', props: { name: 'twitter:title', content: head.title } },
    { type: 'meta', props: { name: 'twitter:description', content: head.meta.desc } },
    { type: 'meta', props: { name: 'twitter:image', content: head.ogImage } },
  ];

  // hreflang alternates (en/fr/ar + x-default)
  for (const alt of head.hreflang) {
    elements.push({
      type: 'link',
      props: { rel: 'alternate', hreflang: alt.hreflang, href: alt.href },
    });
  }

  // JSON-LD structured data (SoftwareApplication + MedicalWebPage + Organization + WebSite)
  elements.push({
    type: 'script',
    props: {
      type: 'application/ld+json',
      id: 'carecalculus-json-ld',
      children: JSON.stringify(head.jsonLd),
    },
  });

  return {
    html,
    links: new Set(allUrls()),
    head: {
      lang,
      title: head.title,
      elements: new Set(elements),
    },
  };
}
