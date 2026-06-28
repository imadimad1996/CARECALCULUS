---
name: enhance-carecalculus
description: Autonomous master growth, content enrichment, and SEO enhancement pipeline for CareCalculus. Executes competitor data crawling (crawl4ai), competitive profiling, content strategy implementation, multi-skill SEO/GEO/schema optimization, and automated production build verification.
---

# Enhance CareCalculus Autonomous Growth Engine

You are executing the **Enhance CareCalculus Master Pipeline**. Your objective is to take the CareCalculus platform from "zero to hero" by autonomously executing a rigorous, multi-skill enhancement loop every time this skill is triggered.

Follow these 5 distinct phases sequentially. Do not skip steps. Proactively run necessary terminal commands and file edits.

---

## Phase 1: Competitor Intelligence & Crawling (`crawl4ai`)
1. **Identify Targets:** Review top clinical calculator benchmarks (e.g., MDCalc, ClinCalc, QxMD) relevant to active or planned calculators in CareCalculus.
2. **Execute Crawl / Gather Data:** Use `scripts/competitor_monitor.py` or web fetch tools (`read_url_content`) to extract clinical formulas, literature references, interpretation thresholds, and FAQ structures from competitor pages.
3. **Data Synthesis:** Aggregate extracted competitor intelligence into a structured summary (e.g., identifying missing clinical pearls, contraindications, or evidence citations).

---

## Phase 2: Competitive Gap Analysis (`competitor-profiling` & `competitors`)
1. **Benchmark Comparison:** Compare CareCalculus UI/content against competitor profiles.
2. **Identify Opportunities:** Look for:
   - Missing clinical dosing adjustments (e.g., renal impairment, hepatic failure).
   - Incomplete literature references or outdated guideline citations.
   - Missing diagnostic scoring categories or risk stratification tables.
3. **Formulate Action Plan:** Define the exact code and content updates required to make CareCalculus decisively superior in clarity, trust, and clinical utility.

---

## Phase 3: Content Strategy & Clinical Enrichment (`content-strategy` & `copywriting`)
1. **Direct Code Enhancement:** Modify target pages (e.g., `src/pages/*.tsx`, `src/data/faqDb.json`) to incorporate the newly identified clinical insights.
2. **Tone & Aesthetic Compliance:**
   - Maintain a clean, modern clinical operating system aesthetic.
   - Ensure all terminology is medically rigorous, multi-lingual compliant (EN, FR, AR), and easy to scan in acute ICU/ER settings.
3. **Reciprocity & Engagement:** Ensure clinical export buttons, copy-result features, and related calculator cross-links are optimized to maximize session duration and user retention.

---

## Phase 4: Full-Stack SEO, GEO & Schema Mastery (`seo-audit`, `ai-seo`, `schema`, `programmatic-seo`, `seo-geo`)
Apply the full suite of SEO skills across modified and core pages:
1. **Technical & On-Page SEO (`seo-audit`, `seo`):**
   - Verify descriptive `<title>` tags and `<meta name="description">` definitions.
   - Ensure semantic heading hierarchy (`<h1>` followed by logical `<h2>`/`<h3>` blocks).
   - Check hreflang alternate links and canonical URLs in `src/utils/seo.ts` and `App.tsx`.
2. **Generative Engine Optimization (`ai-seo`, `seo-geo`):**
   - Ensure every calculator page features a concise, authoritative 40-60 word "Clinical Definition" block optimized for AI search engines (ChatGPT, Perplexity, Gemini Overviews).
3. **Structured Data Injection (`schema`):**
   - Validate and enrich JSON-LD schemas (`MedicalWebPage`, `MedicalRiskScore`, `SoftwareApplication`) in `src/components/JsonLd.tsx` or `src/data/medicalSchemas.json`.
4. **Programmatic SEO Scaling (`programmatic-seo`):**
   - Check `src/data/programmaticEngine.json` and expand calculator-to-disease mappings to capture high-intent long-tail search traffic.

---

## Phase 5: Build Verification & Deployment Readiness
1. **Run Production Build:** Execute `npm run build` in the terminal to verify TypeScript type safety, Tailwind CSS compilation, and Vite static prerendering.
2. **Autonomous Self-Healing:** If any compilation, lint, or prerender errors occur, inspect the logs, diagnose the root cause, and apply fixes immediately until the build succeeds with exit code 0.
3. **Final Execution Report:** Summarize all competitor insights gained, content enriched, SEO optimizations applied, and verification status in a clear markdown summary for the user.
