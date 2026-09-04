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

import { CONDITIONS_DB } from './data/conditions';
import { SPECIALTIES_DB } from './data/specialties';
import { ALL_CALCULATORS } from './data/calculators';
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


const conditionSlugs = CONDITIONS_DB.map(c => `/conditions/${c.id}`);
const specialtySlugs = SPECIALTIES_DB.map(s => `/specialties/${s.id}`);
const calculatorSlugs = Array.from(new Set(ALL_CALCULATORS.map(c => c.path)));

function slugifyQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
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
// fetch. Exclusively clinical calculators and clinical pathway hubs.
const LOGICAL_ROUTES = [
  '/',
  ...calculatorSlugs,
  '/about',
  '/editorial-board',
  '/disclaimer',
  '/privacy',
  '/terms',
  '/pricing',
  '/for-hospitals',
  '/embed-gallery',
  '/synapse-engine',

  ...conditionSlugs,
  ...specialtySlugs,

  ...compareSlugs,
];

const LANGS: LangCode[] = ['en', 'fr', 'es'];

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
    { type: 'link', props: { rel: 'alternate', type: 'text/markdown', href: '/llms.txt' } },

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
        content: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      },
    },

    // Twitter
    { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
    { type: 'meta', props: { name: 'twitter:title', content: head.title } },
    { type: 'meta', props: { name: 'twitter:description', content: head.meta.desc } },
    { type: 'meta', props: { name: 'twitter:image', content: head.ogImage } },
  ];

  // hreflang alternates (en/fr/es + x-default)
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
