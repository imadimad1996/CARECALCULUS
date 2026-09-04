/**
 * verify-links.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Comprehensive link & route verifier for CareCalculus.
 *
 * Modes:
 *   npm run verify-links              → checks production (https://carecalculus.com)
 *   npm run verify-links -- --local   → checks local dev server (http://localhost:3000)
 *
 * What it checks:
 *   1. Every URL in public/sitemap.xml (all 380+ routes)
 *   2. All known static calculator & utility routes (guaranteed coverage)
 *   3. Critical asset files: sitemap.xml, llms.txt, og-image.png, robots.txt, etc.
 *
 * Output:
 *   - Colour-coded terminal report with progress bar
 *   - reports/link-check-results.json  (full machine-readable results)
 * ────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// ─── Config ────────────────────────────────────────────────────────────────
const isLocal = process.argv.includes('--local');
const BASE_URL  = isLocal ? 'http://localhost:3000' : 'https://www.carecalculus.com';
const FR_BASE   = isLocal ? 'http://localhost:3000/fr' : 'https://fr.carecalculus.com';
const CONCURRENCY      = 20;    // parallel requests
const TIMEOUT_MS       = 15000; // 15s per request
const SLOW_THRESHOLD   = 3000;  // flag pages > 3s

// ─── Terminal colours ──────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  grey:   '\x1b[90m',
};

// ─── Result type ───────────────────────────────────────────────────────────
interface UrlResult {
  url: string;
  status: number | 'TIMEOUT' | 'ERROR' | 'REDIRECT';
  ms: number;
  ok: boolean;
  slow: boolean;
  redirectTo?: string;
  error?: string;
}

// ─── Collect URLs from sitemap.xml ─────────────────────────────────────────
function parseSitemap(): string[] {
  const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    console.error(`${c.red}✗ public/sitemap.xml not found — run "npm run sitemap" first${c.reset}`);
    process.exit(1);
  }
  const raw = readFileSync(sitemapPath, 'utf-8');
  const matches = [...raw.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
  return [...new Set(matches)];
}

// ─── Known static routes (guaranteed, even if sitemap is stale) ─────────
function staticRoutes(): string[] {
  const paths = [
    '/', '/map-calculator', '/bmi-calculator', '/glasgow-coma-scale',
    '/drip-rate-calculator', '/creatinine-clearance', '/mdrd-gfr', '/ckd-epi-gfr',
    '/wells-score', '/medical-conversions', '/corrected-calcium', '/qsofa-score',
    '/curb65-score', '/cha2ds2-vasc', '/phq9-score', '/meld-score', '/sirs-criteria',
    '/pf-ratio', '/tidal-volume', '/anc-calculator', '/adjusted-body-weight',
    '/steroid-conversion', '/apgar-score', '/sofa-score', '/child-pugh-score',
    '/anion-gap', '/aa-gradient',    '/nutrition-tdee', '/nutrition-must',
    '/nutrition-nrs2002',
    '/for-hospitals', '/embed-gallery', '/pricing', '/about', '/editorial-board', '/disclaimer',
    '/privacy', '/terms',
    '/compare/map-calculator-vs-qsofa-score',
    '/compare/qsofa-score-vs-sofa-score',
    '/compare/creatinine-clearance-vs-mdrd-gfr',
    '/compare/sofa-score-vs-sirs-criteria',
    '/conditions/sepsis', '/conditions/liver-disease', '/conditions/renal-failure',
    '/conditions/atrial-fibrillation', '/conditions/respiratory-failure',
    '/specialties/intensive-care', '/specialties/emergency-medicine',
    '/specialties/internal-medicine', '/specialties/nephrology',
  ];
  return paths.map(p => `${BASE_URL}${p}`);
}

// ─── Critical asset URLs ──────────────────────────────────────────────────
function assetUrls(): string[] {
  return [
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/llms.txt`,
    `${BASE_URL}/llms-full.txt`,
    `${BASE_URL}/robots.txt`,
    `${BASE_URL}/og-image.png`,
    `${BASE_URL}/icon.svg`,
    `${BASE_URL}/favicon.ico`,
    `${FR_BASE}/`,
    `${FR_BASE}/sofa-score`,
    `${FR_BASE}/map-calculator`,
  ];
}

// ─── HTTP check ───────────────────────────────────────────────────────────
async function checkUrl(url: string): Promise<UrlResult> {
  const t0 = Date.now();
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'CareCalculus-LinkChecker/1.0',
        'Accept':     'text/html,application/xml,text/plain,*/*',
      },
    });
    clearTimeout(tid);
    const ms = Date.now() - t0;
    return {
      url,
      status:     res.status,
      ms,
      ok:         res.ok,
      slow:       ms > SLOW_THRESHOLD,
      redirectTo: res.redirected ? res.url : undefined,
    };
  } catch (err: any) {
    clearTimeout(tid);
    const ms = Date.now() - t0;
    const isTimeout = err?.name === 'AbortError';
    return {
      url,
      status: isTimeout ? 'TIMEOUT' : 'ERROR',
      ms,
      ok:    false,
      slow:  false,
      error: isTimeout ? `Timed out after ${TIMEOUT_MS}ms` : String(err?.message || err),
    };
  }
}

// ─── Parallel batch runner ────────────────────────────────────────────────
async function checkBatch(urls: string[]): Promise<UrlResult[]> {
  const results: UrlResult[] = [];
  const total = urls.length;

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const chunk = urls.slice(i, i + CONCURRENCY);
    const batch = await Promise.all(chunk.map(checkUrl));
    results.push(...batch);

    const done = Math.min(i + CONCURRENCY, total);
    const pct  = Math.round((done / total) * 100);
    const fill  = Math.floor(pct / 5);
    const bar   = '█'.repeat(fill) + '░'.repeat(20 - fill);
    process.stdout.write(`\r  ${c.cyan}[${bar}] ${pct}%  (${done}/${total})${c.reset}  `);
  }
  process.stdout.write('\n');
  return results;
}

// ─── Terminal report ──────────────────────────────────────────────────────
function printReport(results: UrlResult[]) {
  const broken  = results.filter(r => !r.ok);
  const slow    = results.filter(r => r.ok && r.slow);
  const passing = results.filter(r => r.ok);

  const SEP = c.bold + '━'.repeat(72) + c.reset;

  console.log('\n' + SEP);
  console.log(`${c.bold}  🔍 CareCalculus Link Check — ${new Date().toLocaleString()}${c.reset}`);
  console.log(`  Base: ${c.cyan}${BASE_URL}${c.reset}  |  Checked: ${c.bold}${results.length}${c.reset} URLs`);
  console.log(SEP + '\n');

  console.log(`  ${c.green}${c.bold}✔ Passing :${c.reset} ${passing.length}`);
  console.log(`  ${c.yellow}${c.bold}⚠ Slow    :${c.reset} ${slow.length}   (>${SLOW_THRESHOLD}ms response)`);
  console.log(`  ${c.red}${c.bold}✗ Broken  :${c.reset} ${broken.length}\n`);

  if (broken.length > 0) {
    console.log(c.bold + c.red + '  ✗ BROKEN / ERROR URLS' + c.reset);
    console.log('  ' + '─'.repeat(70));
    for (const r of broken) {
      const tag = typeof r.status === 'number' ? `HTTP ${r.status}` : r.status;
      console.log(`  ${c.red}[${tag}]${c.reset} ${r.url}`);
      if (r.error)      console.log(`       ${c.grey}↳ ${r.error}${c.reset}`);
      if (r.redirectTo) console.log(`       ${c.grey}↳ Redirected to: ${r.redirectTo}${c.reset}`);
    }
    console.log('');
  }

  if (slow.length > 0) {
    console.log(c.bold + c.yellow + '  ⚠ SLOWEST URLS (top 15)' + c.reset);
    console.log('  ' + '─'.repeat(70));
    for (const r of slow.sort((a, b) => b.ms - a.ms).slice(0, 15)) {
      console.log(`  ${c.yellow}[${r.ms}ms]${c.reset} ${r.url}`);
    }
    console.log('');
  }

  console.log(SEP);
  if (broken.length === 0) {
    console.log(`${c.green}${c.bold}  ✔  ALL LINKS PASSING — CareCalculus is healthy!${c.reset}`);
  } else {
    console.log(`${c.red}${c.bold}  ✗  ${broken.length} broken link(s) detected — fix before deploying!${c.reset}`);
  }
  console.log(SEP + '\n');
}

// ─── JSON report ──────────────────────────────────────────────────────────
function saveReport(results: UrlResult[]) {
  const reportsDir = join(process.cwd(), 'reports');
  if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });

  const broken  = results.filter(r => !r.ok);
  const slow    = results.filter(r => r.ok && r.slow);

  const report = {
    generatedAt:  new Date().toISOString(),
    baseUrl:      BASE_URL,
    mode:         isLocal ? 'local' : 'production',
    totalChecked: results.length,
    passing:      results.filter(r => r.ok).length,
    broken:       broken.length,
    slow:         slow.length,
    brokenUrls:   broken,
    slowUrls:     slow.sort((a, b) => b.ms - a.ms),
    allResults:   results,
  };

  const outPath = join(reportsDir, 'link-check-results.json');
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`  ${c.grey}📄 Full JSON report: reports/link-check-results.json${c.reset}\n`);
  return outPath;
}

// ─── Entry point ──────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}═══════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}${c.cyan}   CareCalculus Link Verifier v1.0             ${c.reset}`);
  console.log(`${c.bold}${c.cyan}═══════════════════════════════════════════════${c.reset}`);
  console.log(`  Mode         : ${isLocal ? c.yellow + 'LOCAL (localhost:3000)' : c.green + 'PRODUCTION (carecalculus.com)'}${c.reset}`);
  console.log(`  Concurrency  : ${CONCURRENCY} parallel requests`);
  console.log(`  Timeout/URL  : ${TIMEOUT_MS / 1000}s`);
  console.log(`  Slow warning : >${SLOW_THRESHOLD}ms\n`);

  // Step 1: Collect all URLs
  process.stdout.write(`${c.cyan}[1/3]${c.reset} Parsing sitemap.xml… `);
  const sitemapUrls = parseSitemap();
  console.log(`${c.green}${sitemapUrls.length} URLs found${c.reset}`);

  process.stdout.write(`${c.cyan}[2/3]${c.reset} Merging static routes & assets… `);
  const allRaw = [
    ...sitemapUrls,
    ...staticRoutes(),
    ...assetUrls(),
  ];
  const allUrls = [...new Set(allRaw)].sort();
  console.log(`${c.green}${allUrls.length} unique URLs to check${c.reset}\n`);

  // Step 2: Check all URLs
  console.log(`${c.cyan}[3/3]${c.reset} Sending HTTP requests…\n`);
  const results = await checkBatch(allUrls);

  // Step 3: Report
  printReport(results);
  saveReport(results);

  const exitCode = results.some(r => !r.ok) ? 1 : 0;
  process.exit(exitCode);
}

main().catch(err => {
  console.error(`\n${c.red}Fatal: ${err.message}${c.reset}`);
  process.exit(1);
});
