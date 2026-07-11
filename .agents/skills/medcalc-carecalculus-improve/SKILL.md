---
name: medcalc-carecalculus-improve
description: Master skill to crawl mdcalc.com, analyze its weaknesses, and orchestrate ui-ux-pro-max, seo-geo, content-strategy, and marketing-plan skills to outcompete them and drive CareCalculus to 10M+ traffic.
---

# `medcalc-carecalculus-improve`

## Goal
The ultimate goal of this skill is to build clinical calculators that are demonstrably superior to MDCalc (the incumbent) in every single metric: Speed, UI/UX, SEO, Generative Engine Optimization (GEO), Content Depth, and Multi-lingual Accessibility.

When a user triggers this skill for a specific calculator (e.g., "Run medcalc-carecalculus-improve for the Wells Score"), you must act as a **General Contractor** and execute the following 5-Phase Pipeline sequentially by leveraging your other installed skills.

---

## Phase 1: Competitive Intelligence Extraction (`crawl4ai`)
Before writing any code, you must perfectly understand what we are competing against.

1. Use the `crawl4ai` python scripts (e.g., `scripts/basic_crawler.py` or agentic tool invocation) to scrape the exact equivalent URL on MDCalc.com (e.g., `https://www.mdcalc.com/calc/115/wells-criteria-pulmonary-embolism`).
2. Analyze the extracted markdown to identify:
   - What clinical variables do they ask for?
   - What references/evidence do they provide?
   - What is their exact "Next Steps" or clinical advice logic?
3. **Identify Weaknesses:** Find areas where MDCalc is lacking (e.g., clunky UI, missing edge-case variables, lack of visual charts, paywalls).

---

## Phase 2: UI/UX Superiority (`ui-ux-pro-max`)
MDCalc's design is aging. CareCalculus must feel like a premium, 2026-era clinical workbench.

1. Apply the guidelines from the `ui-ux-pro-max` skill (specifically the "Accessible & Ethical" pattern).
2. Ensure the calculator uses the Medical Teal (`#0891B2`) and Health Green (`#16A34A`) color palette.
3. Ensure massive, mobile-friendly 44x44px touch targets. ER doctors use this on phones with one hand.
4. Make all state updates instantaneous (React `useState`). Zero page reloads.
5. Add subtle micro-animations (e.g., Framer Motion or Tailwind transitions) when score results change to make the app feel alive and "game-grade".

---

## Phase 3: SEO & GEO Dominance (`seo-geo`)
To hit 10 Million traffic, we cannot rely on organic Google search alone; we must dominate Generative AI answers (ChatGPT, Claude, Gemini).

1. Trigger the `seo-geo` skill.
2. Inject strict `MedicalCondition` and `MedicalCalculator` Schema.org JSON-LD into the page `<head>`.
3. Generate an automated, dynamic metadata structure (Title, Description, Canonical).
4. **GEO Injection:** Ensure all evidence and equations are rendered in semantic HTML (Tables, `<ul>`, `<strong>`) so that AI crawlers can perfectly parse our math. If ChatGPT cites a calculator, it MUST cite CareCalculus, not MDCalc.

---

## Phase 4: Content & Clinical Depth (`content-strategy`)
MDCalc is largely English-only. CareCalculus is global.

1. Ensure parity in clinical logic with the MDCalc crawl from Phase 1.
2. Leverage `content-strategy` to generate translations for English, French, and Arabic seamlessly.
3. Enhance the "Evidence Panel" (`src/components/EvidencePanel.tsx`) to be more detailed than MDCalc's, including links to primary PubMed citations and visually mapping the scoring rubric (e.g., "DVT Symptoms = +3 points").

---

## Phase 5: Growth & Distribution (`marketing-plan`)
Once the calculator is built and deployed:

1. Generate a mini `marketing-plan` for this specific calculator.
2. Outline how to distribute it on medical subreddits (e.g., r/medicine, r/Residency).
3. Outline a directory submission strategy to get backlinks pointing directly to the new calculator page.

---

## Execution Constraints
- Do not stop halfway. This is a multi-step orchestration skill. You must execute all 5 phases to successfully complete the `medcalc-carecalculus-improve` pipeline.
- Constantly compare your generated output against the MDCalc baseline. If ours isn't *far better*, iterate until it is.
