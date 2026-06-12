#!/usr/bin/env node
/**
 * Post-build: ensure prerendered Arabic pages declare dir="rtl" statically.
 *
 * vite-prerender-plugin sets <html lang="ar"> but not the text direction.
 * Crawlers and AI engines read the raw HTML, so we bake dir="rtl" into every
 * prerendered Arabic page under dist/ar. The runtime app already sets this on
 * hydration; this just makes the static document correct for crawlers too.
 */
import { readFileSync, writeFileSync, existsSync, globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const distAr = join(ROOT, 'dist', 'ar');

if (!existsSync(distAr)) {
  console.log('postbuild-rtl: no dist/ar directory, skipping.');
  process.exit(0);
}

let patched = 0;
// node >=22 has fs.globSync
const files = globSync('dist/ar/**/index.html', { cwd: ROOT }).map((f) => join(ROOT, f));

for (const file of files) {
  let html = readFileSync(file, 'utf8');
  if (/<html[^>]*\sdir=/.test(html)) continue;
  const next = html.replace(/<html(\s+lang="ar")?/i, '<html lang="ar" dir="rtl"');
  if (next !== html) {
    writeFileSync(file, next, 'utf8');
    patched++;
  }
}

console.log(`postbuild-rtl: set dir="rtl" on ${patched} Arabic page(s).`);
