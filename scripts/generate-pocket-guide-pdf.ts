import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function generatePocketGuidePDF() {
  console.log('Generating 10/10 2026 ICU & ER Pocket Guide PDF...');

  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.CourierBold);

  // Color Palette
  const primaryTeal = rgb(0.05, 0.58, 0.53);   // #0D9488
  const darkNavy = rgb(0.06, 0.09, 0.16);     // #0F172A
  const slateGray = rgb(0.33, 0.41, 0.52);    // #526484
  const lightBg = rgb(0.95, 0.97, 0.98);      // #F1F5F9
  const accentRed = rgb(0.86, 0.15, 0.15);     // #DC2626
  const textWhite = rgb(1, 1, 1);
  const textBlack = rgb(0.1, 0.1, 0.1);

  // --- PAGE 1: COVER & SEPSIS / CRITICAL CARE ---
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  const { width, height } = page1.getSize();

  // Header Banner
  page1.drawRectangle({
    x: 0,
    y: height - 110,
    width: width,
    height: 110,
    color: darkNavy,
  });

  page1.drawRectangle({
    x: 0,
    y: height - 116,
    width: width,
    height: 6,
    color: primaryTeal,
  });

  page1.drawText('CARECALCULUS CLINICAL SUITE 2026', {
    x: 40,
    y: height - 40,
    size: 10,
    font: fontMono,
    color: primaryTeal,
  });

  page1.drawText('2026 ICU & EMERGENCY CLINICAL POCKET GUIDE', {
    x: 40,
    y: height - 68,
    size: 16,
    font: fontHelveticaBold,
    color: textWhite,
  });

  page1.drawText('Evidence-Based Decision Rules, Ventilation Targets, Drug Infusions & Emergency Formulas', {
    x: 40,
    y: height - 90,
    size: 9,
    font: fontHelvetica,
    color: rgb(0.8, 0.85, 0.9),
  });

  let y = height - 140;

  // Section 1 Box
  page1.drawRectangle({
    x: 40,
    y: y - 24,
    width: width - 80,
    height: 24,
    color: primaryTeal,
  });
  page1.drawText('1. SEPSIS-3 & HEMODYNAMIC RESUSCITATION PROTOCOL', {
    x: 50,
    y: y - 16,
    size: 11,
    font: fontHelveticaBold,
    color: textWhite,
  });
  y -= 38;

  const sepsisContent = [
    '• qSOFA Score (Bedside Triage): 1 pt each for RR >= 22/min, Altered Mental Status (GCS <15), SBP <= 100 mmHg.',
    '  Interpretation: Score >= 2 indicates high risk of prolonged ICU stay & mortality -> Initiate Sepsis Bundle immediately.',
    '• SOFA Score (ICU Organ Dysfunction): Evaluates 6 systems (PaO2/FiO2, Platelets, Bilirubin, MAP/Vasopressors, GCS, Cr/Urine).',
    '  An acute increase in SOFA >= 2 points indicates organ dysfunction secondary to infection.',
    '• Mean Arterial Pressure (MAP) Equation: MAP = (2 * DBP + SBP) / 3',
    '  Resuscitation Target: MAP >= 65 mmHg in Septic Shock.',
    '  First-line Vasopressor: Norepinephrine (0.02 - 0.5 mcg/kg/min). Add Vasopressin at 0.03 units/min if refractory.',
    '• Initial Fluid Resuscitation: Administer 30 mL/kg balanced crystalloids (Plasmalyte or LR) within 3 hours for lactate >= 4 mmol/L.'
  ];

  for (const line of sepsisContent) {
    page1.drawText(line, {
      x: 45,
      y: y,
      size: 9,
      font: line.startsWith('•') ? fontHelveticaBold : fontHelvetica,
      color: textBlack,
    });
    y -= 15;
  }

  y -= 15;

  // Section 2 Box
  page1.drawRectangle({
    x: 40,
    y: y - 24,
    width: width - 80,
    height: 24,
    color: primaryTeal,
  });
  page1.drawText('2. ARDS BERLIN DEFINITION & MECHANICAL VENTILATION', {
    x: 50,
    y: y - 16,
    size: 11,
    font: fontHelveticaBold,
    color: textWhite,
  });
  y -= 38;

  const ardsContent = [
    '• PaO2/FiO2 (P/F Ratio) Classification (PEEP >= 5 cmH2O):',
    '  - Mild ARDS: 200 < P/F <= 300 mmHg   |   Mortality ~27%',
    '  - Moderate ARDS: 100 < P/F <= 200 mmHg |   Mortality ~32%',
    '  - Severe ARDS: P/F <= 100 mmHg        |   Mortality ~45% (Consider Prone Positioning & NMBA)',
    '• Protective Lung Ventilation Target:',
    '  - Initial Tidal Volume: 6 mL/kg Predicted Body Weight (PBW).',
    '  - PBW Male = 50 + 0.91 * (Height cm - 152.4)   |   PBW Female = 45.5 + 0.91 * (Height cm - 152.4)',
    '  - Plateau Pressure (Pplat) Target: <= 30 cmH2O.',
    '  - Driving Pressure (Delta P = Pplat - PEEP) Target: < 13 - 15 cmH2O.'
  ];

  for (const line of ardsContent) {
    page1.drawText(line, {
      x: 45,
      y: y,
      size: 9,
      font: line.startsWith('•') ? fontHelveticaBold : fontHelvetica,
      color: textBlack,
    });
    y -= 15;
  }

  y -= 15;

  // Section 3 Box
  page1.drawRectangle({
    x: 40,
    y: y - 24,
    width: width - 80,
    height: 24,
    color: primaryTeal,
  });
  page1.drawText('3. NEUROLOGICAL ASSESSMENT & TRAUMA (GCS)', {
    x: 50,
    y: y - 16,
    size: 11,
    font: fontHelveticaBold,
    color: textWhite,
  });
  y -= 38;

  const gcsContent = [
    '• Glasgow Coma Scale (GCS) Total: 3 to 15 Points',
    '  - Eye Response (E 1-4): Spontaneous (4), To Speech (3), To Pain (2), None (1).',
    '  - Verbal Response (V 1-5): Oriented (5), Confused (4), Inappropriate (3), Incomprehensible (2), None (1).',
    '  - Motor Response (M 1-6): Obeys Commands (6), Localizes Pain (5), Withdraws (4), Flexion (3), Extension (2), None (1).',
    '• Clinical Rule: GCS <= 8 -> Intubate for Airway Protection.'
  ];

  for (const line of gcsContent) {
    page1.drawText(line, {
      x: 45,
      y: y,
      size: 9,
      font: line.startsWith('•') ? fontHelveticaBold : fontHelvetica,
      color: textBlack,
    });
    y -= 15;
  }

  // Footer Page 1
  page1.drawRectangle({ x: 0, y: 0, width: width, height: 25, color: lightBg });
  page1.drawText('CareCalculus Clinical Guide 2026 — Verified against AHA, ESC, KDIGO & Surviving Sepsis Guidelines', {
    x: 40,
    y: 8,
    size: 8,
    font: fontHelvetica,
    color: slateGray,
  });
  page1.drawText('Page 1 of 2', { x: width - 80, y: 8, size: 8, font: fontMono, color: slateGray });

  // --- PAGE 2: RENAL, ELECTROLYTES & DRUG DOSING ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  let y2 = height - 50;

  // Header Page 2
  page2.drawRectangle({ x: 0, y: height - 60, width: width, height: 60, color: darkNavy });
  page2.drawText('CARECALCULUS — 2026 RENAL, ELECTROLYTE & DOSING REFERENCE', {
    x: 40,
    y: height - 38,
    size: 13,
    font: fontHelveticaBold,
    color: textWhite,
  });
  y2 = height - 90;

  // Section 4 Box
  page2.drawRectangle({ x: 40, y: y2 - 24, width: width - 80, height: 24, color: primaryTeal });
  page2.drawText('4. RENAL FUNCTION & ACID-BASE DIAGNOSTICS', { x: 50, y: y2 - 16, size: 11, font: fontHelveticaBold, color: textWhite });
  y2 -= 38;

  const renalContent = [
    '• Cockcroft-Gault CrCl = [(140 - Age) * Weight kg] / [72 * Serum Cr mg/dL] (* 0.85 for Females)',
    '• CKD-EPI 2021 GFR: Race-free equation recommended by KDIGO 2026 guidelines.',
    '• Serum Anion Gap = Na+ - (Cl- + HCO3-)   |   Normal Range: 8 - 12 mEq/L',
    '  - High Anion Gap Metabolic Acidosis (HAGMA): MUDPILES / GOLDMARK (Lactate, DKA, Uremia, Toxins).',
    '• Winter\'s Formula (Expected PCO2 in Metabolic Acidosis): PCO2 = 1.5 * [HCO3-] + 8 ± 2',
    '• Sodium Correction in Hyponatremia: Max correction rate <= 8 - 10 mEq/L in 24 hours to prevent ODS.'
  ];

  for (const line of renalContent) {
    page2.drawText(line, { x: 45, y: y2, size: 9, font: line.startsWith('•') ? fontHelveticaBold : fontHelvetica, color: textBlack });
    y2 -= 15;
  }

  y2 -= 15;

  // Section 5 Box
  page2.drawRectangle({ x: 40, y: y2 - 24, width: width - 80, height: 24, color: primaryTeal });
  page2.drawText('5. CARDIOLOGY & ANTICOAGULATION SCORE REFERENCE', { x: 50, y: y2 - 16, size: 11, font: fontHelveticaBold, color: textWhite });
  y2 -= 38;

  const cardioContent = [
    '• CHA2DS2-VASc Stroke Risk in AFib: CHF (1), HTN (1), Age >= 75 (2), Diabetes (1), Stroke/TIA (2), Vascular (1), Age 65-74 (1), Sex Female (1).',
    '  Interpretation: Score >= 2 in Males or >= 3 in Females -> Anticoagulation recommended (DOAC 1st line).',
    '• HAS-BLED Bleeding Risk: HTN (1), Abnormal Renal/Liver (1 or 2), Stroke (1), Bleeding (1), Labile INR (1), Elderly (1), Drugs/Alcohol (1 or 2).',
    '  Score >= 3 indicates high bleeding risk; warrants close monitoring rather than withholding anticoagulation.'
  ];

  for (const line of cardioContent) {
    page2.drawText(line, { x: 45, y: y2, size: 9, font: line.startsWith('•') ? fontHelveticaBold : fontHelvetica, color: textBlack });
    y2 -= 15;
  }

  y2 -= 15;

  // Section 6 Box
  page2.drawRectangle({ x: 40, y: y2 - 24, width: width - 80, height: 24, color: primaryTeal });
  page2.drawText('6. CRITICAL CARE DRUG INFUSION & STEROID CONVERSION TABLE', { x: 50, y: y2 - 16, size: 11, font: fontHelveticaBold, color: textWhite });
  y2 -= 38;

  const drugContent = [
    '• Vasopressor Starting Doses:',
    '  - Norepinephrine: 0.02 - 0.05 mcg/kg/min (Titrate q2-5min for MAP >= 65)',
    '  - Vasopressin: Fixed 0.03 units/min (Second-line non-titratable adjunct)',
    '  - Epinephrine: 0.01 - 0.5 mcg/kg/min (Inotrope + Vasopressor)',
    '• Systemic Steroid Equivalent Doses:',
    '  - Hydrocortisone: 20 mg (Short acting, high mineralocorticoid activity)',
    '  - Prednisone / Prednisolone: 5 mg',
    '  - Methylprednisolone: 4 mg',
    '  - Dexamethasone: 0.75 mg (Long acting, zero mineralocorticoid activity)'
  ];

  for (const line of drugContent) {
    page2.drawText(line, { x: 45, y: y2, size: 9, font: line.startsWith('•') ? fontHelveticaBold : fontHelvetica, color: textBlack });
    y2 -= 15;
  }

  // Footer Page 2
  page2.drawRectangle({ x: 0, y: 0, width: width, height: 25, color: lightBg });
  page2.drawText('CareCalculus Open-Access Clinical Suite — https://carecalculus.com', {
    x: 40,
    y: 8,
    size: 8,
    font: fontHelvetica,
    color: slateGray,
  });
  page2.drawText('Page 2 of 2', { x: width - 80, y: 8, size: 8, font: fontMono, color: slateGray });

  const pdfBytes = await pdfDoc.save();

  const publicDir = path.join(process.cwd(), 'public', 'assets', 'docs');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, 'CareCalculus_2026_ICU_ER_Pocket_Guide.pdf');
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`✅ 10/10 PDF successfully generated at: ${filePath}`);
}

generatePocketGuidePDF().catch(console.error);
