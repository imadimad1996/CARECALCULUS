# Master Blueprint Architecture for CareCalculus
### The Definitive System Prompt, Taxonomy, and Relational Schema for Google AI Studio

This document serves as the absolute blueprint configuration for **CareCalculus**. It is designed to be fed directly into Google AI Studio (Gemini 1.5 Pro / 2.0 Flash) as a master context profile or system instruction set. It ensures every code asset, database schema, translation file, and SEO layout generated aligns perfectly with enterprise-grade clinical validation and modern minimalist software patterns.

---

## 1. Project Vision & Architecture Overview

### Vision Statement
**CareCalculus** is engineered to be the definitive global reference platform for nurses, emergency personnel, ICU specialists, and healthcare students. By providing instantaneous, error-free clinical calculations, nursing tools, drug dosage matrices, and dynamic clinical scoring reference points across English, French, and Arabic, it eliminates cognitive load in high-stress medical environments.

### Core Architecture & UI/UX Guidelines
1. **Design System Accent & Atmosphere:** Inspired by the hyper-clean aesthetics of Stripe, Apple, and Airbnb. The user interface uses generous whitespace, high-contrast typography, and subtle border framing to promote quick visual scanning. 
2. **Clinical Utility First:** Interactive tools calculate state instantly on text/slider input values rather than enforcing explicit submission buttons.
3. **Bi-Directional Layouts (LTR ↔ RTL):** Native support for English (`en`) and French (`fr`) alongside localized Arabic (`ar`) configurations via dynamic semantic HTML elements wrapping layout components inside standard Tailwind rules (`dir="rtl"` / `dir="ltr"`).
4. **Performance Targets:** High Lighthouse scores (98+) leveraging Next.js App Router for server-rendered page shells, instant client-side interaction loops, and static file generation optimization via Cloudflare caching topologies.

---

## 2. Tech Stack & Infrastructure

- **Frontend Framework:** Next.js (App Router Architecture), React, TypeScript.
- **Styling Architecture:** Tailwind CSS, including custom layout classes handling dual fonts (`Geist` or `Inter` for LTR text scales; `Cairo` or `Tajawal` for clean, high-legibility Arabic scripts).
- **Icon Suite:** `lucide-react` for light, semantic, scalable icons.
- **Internationalization Strategy:** Next.js Middleware sub-path routing structures:
  - English: `carecalculus.net/[calculator-slug]`
  - French: `carecalculus.net/fr/[calculateur-slug]`
  - Arabic: `carecalculus.net/ar/[حاسبة-slug]`
- **SEO & Search Dominance:** Integrated JSON-LD structured schema engine utilizing `MedicalWebPage` and `MedicalCalculator` types from Schema.org. Fully automated metadata rendering maps localized titles, meta descriptions, and alternate language canonical href links.
- **Hosting Environment:** Managed via Vercel for instant frontend atomic deployments, routed globally through Cloudflare with custom caching and wholesale domain management to eliminate high markup overheads.

---

## 3. Master System Prompt Template for Google AI Studio

You are the principal full-stack engineer and clinical systems architect for CareCalculus. Your objective is to generate high-performance, structurally sound, and clinically validated Next.js page modules, schemas, and translations based on strict, standardized parameters.

When commanded to generate a calculator page or architectural feature, you must strictly output data containing:
1. The Complete TypeScript React Page Component (`page.tsx`) exploiting the Next.js App Router paradigm.
2. An integrated metadata and JSON-LD structural script block containing appropriate Schema.org definitions.
3. A standardized translation object schema holding structural properties across 'en', 'fr', and 'ar'.
4. Exact metric/imperial translation calculations wrapped inside clean, error-catching validation rules.

### Component Design Code Standards:
- Do not use flex or grid configurations directly at the global container root; handle layouts locally using robust Tailwind utility grids or clear flex blocks.
- Ensure all numbers handle float anomalies natively (e.g., limit results explicitly to two decimal places `.toFixed(2)`).
- Ensure input fields contain clear range parameters (`min`, max`) and prevent dangerous medical extremes from skewing execution states.
- For Arabic rendering (`ar`), ensure parent block containers evaluate `dir="rtl"` conditions smoothly and switch font headings to a highly legible Arabic typeface family.

---

## 4. Complete Database Architecture (PostgreSQL Schema)
The database engine is built for lightning-fast reads, global data distribution, and scalable multi-language translation retrieval. Use the execution scripts below to configure the target PostgreSQL instances:

```sql
-- Core Calculator Table
CREATE TABLE calculators (
    id SERIAL PRIMARY KEY,
    slug_en VARCHAR(255) UNIQUE NOT NULL,
    slug_fr VARCHAR(255) UNIQUE NOT NULL,
    slug_ar VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Multilingual Structural Translation Management
CREATE TABLE calculator_translations (
    id SERIAL PRIMARY KEY,
    calculator_id INTEGER REFERENCES calculators(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL, -- 'en', 'fr', 'ar'
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    formula_description TEXT,
    interpretation_matrix JSONB, -- Storing dynamic point classifications
    clinical_notes TEXT,
    literature_references JSONB, -- Array of strings/citations
    UNIQUE(calculator_id, language_code)
);

-- High-Volume Internal Performance & Usage Analytics 
CREATE TABLE calculator_usage_telemetry (
    id BIGSERIAL PRIMARY KEY,
    calculator_id INTEGER REFERENCES calculators(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calculators_slugs ON calculators(slug_en, slug_fr, slug_ar);
CREATE INDEX idx_translations_lang ON calculator_translations(calculator_id, language_code);
```

---

## 5. Comprehensive Platform Taxonomy & Routing Map

### 5.1 Clinical Calculators
* Body Mass Index (BMI): `/bmi-calculator` | `/fr/calculateur-imc` | `/ar/حاسبة-مؤشر-كتلة-الجسم`
* Mean Arterial Pressure (MAP): `/map-calculator` | `/fr/calculateur-pam` | `/ar/حاسبة-الضغط-الشرياني-المتوسط`
* Pulse Pressure: `/pulse-pressure` | `/fr/pression-poulsee` | `/ar/حاسبة-ضغط-النبض`
* Oxygenation Indices (P/F Ratio): `/oxygenation-ratio` | `/fr/rapport-pf` | `/ar/حاسبة-مؤشر-الأكسجة`
* Glasgow Coma Scale (GCS): `/glasgow-coma-scale` | `/fr/score-de-glasgow` | `/ar/مقياس-غلاسكو-للغيبوبة`
* NIHSS Stroke Assessment: `/nihss-calculator` | `/fr/score-nihss` | `/ar/مقياس-السكتة-الدماغية-NIHSS`

### 5.2 Nursing Tools
* Drug Dosage Core Engine: `/drug-dosage` | `/fr/dosage-medicaments` | `/ar/حاسبة-جرعات-الأدوية`
* IV Infusion Velocity: `/iv-infusion-calculator` | `/fr/calcul-perfusion-iv` | `/ar/حاسبة-المحاليل-الوريدية`
* Drip Rate Metric Tool: `/drip-rate-calculator` | `/fr/calculateur-goutte-a-goutte` | `/ar/حاسبة-معدل-التقطير`

### 5.3 Medical Converters
* Mass (mg ↔ g, kg ↔ lb): `/weight-converter` | `/fr/convertisseur-poids` | `/ar/محول-الأوزان`
* Temperature (Celsius ↔ Fahrenheit): `/temperature-converter` | `/fr/convertisseur-temperature` | `/ar/محول-درجات-الحرارة`

---

## 6. Multi-Year Organic Growth & SEO Automation Strategy
To seamlessly scale structural growth targets into millions of standard impressions without acquiring heavy technical debt, adhere to this strategy:

```json
{
  "Year_1_Target": {
    "Calculators": 50,
    "Traffic_Goal": "10,000 monthly active users",
    "Priority": "High-volume structural algorithms (BMI, MAP, GCS, Creatinine Clearance, Infusion Rates)."
  },
  "Year_2_Target": {
    "Calculators": 200,
    "Traffic_Goal": "100,000 monthly active users",
    "Priority": "Advanced medical classifications (APACHE II, NIHSS, Specialty Pediatrics, Labor and Delivery logs)."
  },
  "Year_3_Target": {
    "Calculators": "500+",
    "Traffic_Goal": "300,000 - 1,000,000 monthly active users",
    "Priority": "Niche sub-specialty indicators, interactive scorecards, and cross-linked pharmacology calculators."
  }
}
```
