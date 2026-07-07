// Universal EHR Lab Parser & Biomarker Extraction Utility
// Converts raw text or copied lab panels from EPIC, Cerner, Meditech, or standard lab reports
// into standardized numerical biomarker values for instant auto-population across CareCalculus.

export interface ParsedLabPanel {
  sodium?: number;       // mEq/L or mmol/L
  potassium?: number;    // mEq/L or mmol/L
  creatinine?: number;   // mg/dL
  bilirubin?: number;    // mg/dL (Total Bilirubin)
  inr?: number;          // International Normalized Ratio
  albumin?: number;      // g/dL
  glucose?: number;      // mg/dL
  wbc?: number;          // x10^3/uL
  platelets?: number;    // x10^3/uL
  bun?: number;          // mg/dL
  hemoglobin?: number;   // g/dL
  pco2?: number;         // mmHg
  po2?: number;          // mmHg
  ph?: number;           // pH
  fio2?: number;         // % (e.g. 40 or 0.40 -> 40)
  timestamp?: number;    // epoch ms
}

const STORAGE_KEY = 'carecalculus_parsed_labs';
const EVENT_NAME = 'carecalculus:labs-updated';

/**
 * Helper to extract a numerical value matching given biomarker regex patterns.
 */
function extractValue(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (!isNaN(val) && isFinite(val)) {
        return val;
      }
    }
  }
  return undefined;
}

/**
 * Parse raw lab text from hospital EHRs or copied lab sheets.
 */
export function parseLabText(rawText: string): ParsedLabPanel {
  if (!rawText || !rawText.trim()) return {};

  // Clean up punctuation and standardize whitespace
  const text = rawText
    .replace(/[=:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const panel: ParsedLabPanel = {
    timestamp: Date.now(),
  };

  // Sodium (Na): typical range 100 - 180
  const naVal = extractValue(text, [
    /(?:sodium|natrium|na\+?)\s+(\d{3}(?:\.\d+)?)/i,
    /na\s*\[.*?\]\s*(\d{3}(?:\.\d+)?)/i
  ]);
  if (naVal !== undefined && naVal >= 100 && naVal <= 180) panel.sodium = naVal;

  // Potassium (K): typical range 1.0 - 10.0
  const kVal = extractValue(text, [
    /(?:potassium|kalium|k\+?)\s+(\d{1,2}(?:\.\d+)?)/i,
    /k\s*\[.*?\]\s*(\d{1,2}(?:\.\d+)?)/i
  ]);
  if (kVal !== undefined && kVal >= 1.0 && kVal <= 10.0) panel.potassium = kVal;

  // Creatinine (Cr): typical range 0.1 - 25.0
  const crVal = extractValue(text, [
    /(?:creatinine|creat|cr)\s+(\d{1,2}(?:\.\d+)?)/i
  ]);
  if (crVal !== undefined && crVal >= 0.1 && crVal <= 30.0) panel.creatinine = crVal;

  // Total Bilirubin (T.Bili): typical range 0.1 - 50.0
  const biliVal = extractValue(text, [
    /(?:total\s+bilirubin|t\.?bili|tbili|bilirubin,\s*total|bilirubin)\s+(\d{1,2}(?:\.\d+)?)/i
  ]);
  if (biliVal !== undefined && biliVal >= 0.1 && biliVal <= 60.0) panel.bilirubin = biliVal;

  // INR: typical range 0.8 - 15.0
  const inrVal = extractValue(text, [
    /(?:inr|pt\/inr|international\s+normalized\s+ratio)\s+(\d{1,2}(?:\.\d+)?)/i
  ]);
  if (inrVal !== undefined && inrVal >= 0.5 && inrVal <= 20.0) panel.inr = inrVal;

  // Albumin: typical range 1.0 - 6.0
  const albVal = extractValue(text, [
    /(?:albumin|alb)\s+(\d{1,2}(?:\.\d+)?)/i
  ]);
  if (albVal !== undefined && albVal >= 0.5 && albVal <= 8.0) panel.albumin = albVal;

  // Glucose: typical range 20 - 1500
  const gluVal = extractValue(text, [
    /(?:glucose|glu|bg|blood\s+sugar|fbg)\s+(\d{2,4}(?:\.\d+)?)/i
  ]);
  if (gluVal !== undefined && gluVal >= 20 && gluVal <= 1500) panel.glucose = gluVal;

  // WBC: typical range 0.1 - 200.0
  const wbcVal = extractValue(text, [
    /(?:wbc|white\s+blood\s+cell|leukocytes)\s+(\d{1,3}(?:\.\d+)?)/i
  ]);
  if (wbcVal !== undefined && wbcVal >= 0.1 && wbcVal <= 300.0) panel.wbc = wbcVal;

  // Platelets: typical range 5 - 1500
  const pltVal = extractValue(text, [
    /(?:platelets|plt|thrombocytes)\s+(\d{1,4}(?:\.\d+)?)/i
  ]);
  if (pltVal !== undefined && pltVal >= 5 && pltVal <= 2000) panel.platelets = pltVal;

  // BUN: typical range 1 - 200
  const bunVal = extractValue(text, [
    /(?:bun|blood\s+urea\s+nitrogen|urea\s+nitrogen)\s+(\d{1,3}(?:\.\d+)?)/i
  ]);
  if (bunVal !== undefined && bunVal >= 1 && bunVal <= 300) panel.bun = bunVal;

  // Hemoglobin: typical range 3.0 - 25.0
  const hbVal = extractValue(text, [
    /(?:hemoglobin|hgb|hb)\s+(\d{1,2}(?:\.\d+)?)/i
  ]);
  if (hbVal !== undefined && hbVal >= 2.0 && hbVal <= 25.0) panel.hemoglobin = hbVal;

  // pCO2: typical range 15 - 120
  const pco2Val = extractValue(text, [
    /(?:pco2|paco2)\s+(\d{2,3}(?:\.\d+)?)/i
  ]);
  if (pco2Val !== undefined && pco2Val >= 10 && pco2Val <= 150) panel.pco2 = pco2Val;

  // pO2: typical range 20 - 600
  const po2Val = extractValue(text, [
    /(?:po2|pao2)\s+(\d{2,3}(?:\.\d+)?)/i
  ]);
  if (po2Val !== undefined && po2Val >= 20 && po2Val <= 700) panel.po2 = po2Val;

  // pH: typical range 6.80 - 7.80
  const phVal = extractValue(text, [
    /(?:ph)\s+(7\.\d{2}|6\.\d{2})/i
  ]);
  if (phVal !== undefined && phVal >= 6.70 && phVal <= 7.90) panel.ph = phVal;

  // FiO2: typical range 21 - 100 or 0.21 - 1.0
  const fio2Val = extractValue(text, [
    /(?:fio2)\s+(\d{1,3}(?:\.\d+)?)/i
  ]);
  if (fio2Val !== undefined) {
    if (fio2Val <= 1.0 && fio2Val >= 0.21) {
      panel.fio2 = Math.round(fio2Val * 100);
    } else if (fio2Val >= 21 && fio2Val <= 100) {
      panel.fio2 = fio2Val;
    }
  }

  return panel;
}

/**
 * Save parsed lab panel to localStorage and dispatch reactive window event.
 */
export function saveParsedLabs(panel: ParsedLabPanel): void {
  try {
    const existing = getParsedLabs() || {};
    const merged = { ...existing, ...panel, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
  } catch (e) {
    console.error('Failed to save parsed labs:', e);
  }
}

/**
 * Retrieve saved lab panel from localStorage.
 */
export function getParsedLabs(): ParsedLabPanel | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

/**
 * Clear saved lab panel from localStorage and notify listeners.
 */
export function clearParsedLabs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
  } catch (e) {
    console.error('Failed to clear parsed labs:', e);
  }
}
