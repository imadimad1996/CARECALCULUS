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
import App, { preloadPages } from './App';
import { parsePathname } from './utils/lang';
import { buildHead } from './utils/seo';
import { LangCode } from './types';

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

// Logical (language-agnostic) structural routes worth prerendering. Detail
// pages (/blog/:slug, /cours/:slug, …) are intentionally excluded — they are
// client-only, thin, and not in the sitemap.
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
  '/blog',
  '/blog-articles',
  '/presentations',
  '/cours',
];

const LANGS: LangCode[] = ['en', 'fr', 'ar'];

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
    {
      type: 'meta',
      props: {
        property: 'og:locale',
        content: lang === 'fr' ? 'fr_FR' : lang === 'ar' ? 'ar_AR' : 'en_US',
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
