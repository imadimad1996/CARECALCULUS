#!/usr/bin/env node
/**
 * Sitemap generator for CareCalculus.
 *
 * Regenerates public/sitemap.xml from the single source of truth in the app:
 *   - top-level routes  → parsed from navItems in src/App.tsx
 *   - blog articles     → /blog-articles/:slug   (BLOG_SEED in Blog.tsx)
 *   - journal articles  → /blog/:slug            (CURATED_SEED_POSTS in MedicalBlog.tsx)
 *   - courses           → /cours/:slug           (DEFAULT_COURSES in Courses.tsx)
 *   - presentations     → /presentations/:slug   (DEFAULT_SUBJECTS in Presentations.tsx)
 *
 * Only the curated/default items are emitted. The 2,100 procedurally generated
 * journal posts and any user-uploaded (localStorage) courses/decks are
 * intentionally excluded — thin/duplicate or client-only content does not
 * belong in a sitemap.
 *
 * Run via `npm run sitemap` (also invoked automatically by deploy_web.bat).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://carecalculus.com';
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// --- Keep this in lockstep with src/utils/slug.ts -----------------------------
function slugify(title, fallbackId) {
  const base = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return base || (fallbackId ? fallbackId.toLowerCase() : '');
}

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/**
 * Slice out a single named array literal `const NAME ... = [ ... ];` and return
 * its raw text, so nested objects in other arrays can't leak in.
 */
function extractArrayBlock(src, name) {
  const start = src.indexOf(`const ${name}`);
  if (start === -1) throw new Error(`Could not find "const ${name}" in source`);
  // Skip past the `=` so a `Type[]` annotation isn't mistaken for the literal.
  const eq = src.indexOf('=', start);
  const open = src.indexOf('[', eq);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  throw new Error(`Unbalanced brackets while reading "${name}"`);
}

/**
 * Pair each top-level `id: '...'` with the FIRST `title: '...'` that follows it.
 * Curated items in every seed file are written as { id: ..., title: ..., ... },
 * so this reliably skips nested slide/section titles.
 */
function extractItems(block) {
  const items = [];
  const idRe = /\bid:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = idRe.exec(block)) !== null) {
    const id = m[1];
    const after = block.slice(m.index);
    const titleMatch = after.match(/\btitle:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
    if (titleMatch) {
      items.push({ id, title: titleMatch[2].replace(/\\(['"`])/g, '$1') });
    }
  }
  return items;
}

/**
 * Pair each top-level `id: '...'` with the FIRST `en: '...'` that follows it.
 * This is used to extract English titles from translated master lists.
 */
function extractMasterItems(block) {
  const items = [];
  const idRe = /\bid:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = idRe.exec(block)) !== null) {
    const id = m[1];
    const after = block.slice(m.index);
    const titleMatch = after.match(/\ben:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
    if (titleMatch) {
      items.push({ id, title: titleMatch[2].replace(/\\(['"`])/g, '$1') });
    }
  }
  return items;
}

/** Parse the path strings out of the exported navItems array in App.tsx. */
function extractNavPaths(src) {
  const block = extractArrayBlock(src, 'navItems');
  const paths = [];
  const re = /\bpath:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(block)) !== null) paths.push(m[1]);
  return paths;
}

// --- Gather sources -----------------------------------------------------------
const routesSrc = read('src/routes.tsx');
const navPaths = extractNavPaths(routesSrc);

const masterSrc = read('src/utils/masterListContent.ts');
const masterBlogs = extractMasterItems(extractArrayBlock(masterSrc, 'MASTER_BLOGS'));
const masterJournals = extractMasterItems(extractArrayBlock(masterSrc, 'MASTER_JOURNALS'));
const masterCourses = extractMasterItems(extractArrayBlock(masterSrc, 'MASTER_COURSES'));
const masterDecks = extractMasterItems(extractArrayBlock(masterSrc, 'MASTER_PRESENTATIONS'));

const blogPosts = [
  ...extractItems(extractArrayBlock(read('src/pages/Blog.tsx'), 'ORIGINAL_BLOG_SEED')),
  ...masterBlogs
];
const journalPosts = [
  ...extractItems(extractArrayBlock(read('src/pages/MedicalBlog.tsx'), 'ORIGINAL_CURATED_SEED_POSTS')),
  ...masterJournals
];
const courses = [
  ...extractItems(extractArrayBlock(read('src/pages/Courses.tsx'), 'DEFAULT_COURSES')),
  ...masterCourses
];
const decks = [
  ...extractItems(extractArrayBlock(read('src/pages/Presentations.tsx'), 'DEFAULT_SUBJECTS')),
  ...masterDecks
];

// FMPC Modules
const fmpModulesSrc = read('src/utils/fmpModules.ts');
const fmpModules = [];
const fmpNameRe = /\b"?name"?:\s*['"]([^'"]+)['"]/g;
let fmpMatch;
while ((fmpMatch = fmpNameRe.exec(fmpModulesSrc)) !== null) {
  fmpModules.push({ title: fmpMatch[1] });
}

// ISPITS Modules
const ispitsModulesSrc = read('src/utils/ispitsModules.ts');
const ispitsModules = [];
const ispitsNameRe = /\b"?name"?:\s*['"]([^'"]+)['"]/g;
let ispitsMatch;
while ((ispitsMatch = ispitsNameRe.exec(ispitsModulesSrc)) !== null) {
  ispitsModules.push({ title: ispitsMatch[1] });
}

// --- Build the set of LOGICAL paths (language-agnostic) -----------------------
// English is served bare, French at /fr, Arabic at /ar. Each logical path below
// is emitted once per language with full hreflang alternates.
const LANGS = ['en', 'fr', 'ar'];
const langUrl = (path, lang) => {
  const clean = path === '/' ? '' : path;
  return lang === 'en' ? `${ORIGIN}${clean || '/'}` : `${ORIGIN}/${lang}${clean}`;
};

/** @type {{path:string, priority:string, changefreq?:string}[]} */
const pages = [];
const seen = new Set();
const add = (path, priority, changefreq) => {
  if (seen.has(path)) return;
  seen.add(path);
  pages.push({ path, priority, changefreq });
};

// Homepage
add('/', '1.0', 'weekly');

// Top-level routes (calculators + resource landing pages)
const RESOURCE_PATHS = new Set(['/blog', '/blog-articles', '/presentations', '/cours', '/fmp-medecine', '/ispits']);
for (const path of navPaths) {
  if (RESOURCE_PATHS.has(path)) add(path, '0.7', 'weekly');
  else add(path, '0.8');
}

// Per-item detail routes
for (const p of blogPosts) add(`/blog-articles/${slugify(p.title, p.id)}`, '0.6', 'monthly');
for (const p of journalPosts) add(`/blog/${slugify(p.title, p.id)}`, '0.6', 'monthly');
for (const c of courses) add(`/cours/${slugify(c.title, c.id)}`, '0.5', 'monthly');
for (const d of decks) add(`/presentations/${slugify(d.title, d.id)}`, '0.5', 'monthly');
for (const f of fmpModules) add(`/fmp-medecine/${slugify(f.title)}`, '0.6', 'monthly');
for (const i of ispitsModules) add(`/ispits/${slugify(i.title)}`, '0.6', 'monthly');

// High-value programmatic comparison routes
const comparisons = [
  'map-calculator-vs-qsofa-score',
  'qsofa-score-vs-sirs-criteria',
  'qsofa-score-vs-sofa-score',
  'glasgow-coma-scale-vs-qsofa-score',
  'curb65-score-vs-qsofa-score',
  'apgar-score-vs-glasgow-coma-scale',
  'creatinine-clearance-vs-meld-score',
  'bmi-calculator-vs-adjusted-body-weight'
];
for (const comp of comparisons) add(`/compare/${comp}`, '0.7', 'monthly');

// --- Emit XML with hreflang alternates ----------------------------------------
// Per Google's multilingual sitemap spec, every <url> lists all language
// variants (plus x-default → English) via xhtml:link rel="alternate".
const blocks = [];
for (const { path, priority, changefreq } of pages) {
  const alternates = [
    ...LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${langUrl(path, l)}"/>`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${langUrl(path, 'en')}"/>`,
  ].join('\n');

  for (const lang of LANGS) {
    const cf = changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : '';
    blocks.push(`  <url>
    <loc>${langUrl(path, lang)}</loc>
    <lastmod>${today}</lastmod>${cf}
    <priority>${priority}</priority>
${alternates}
  </url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`;

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml, 'utf8');
console.log(`✓ sitemap.xml generated — ${pages.length} pages × ${LANGS.length} languages = ${blocks.length} URLs (lastmod ${today})`);
console.log(`  • ${navPaths.length} top-level routes`);
console.log(`  • ${blogPosts.length} blog · ${journalPosts.length} journal · ${courses.length} courses · ${decks.length} presentations · ${fmpModules.length} FMPC modules · ${ispitsModules.length} ISPITS modules`);
