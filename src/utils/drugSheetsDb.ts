export interface DrugInfo {
  name: string;
  indication: string;
  dose: string;
  concentration: string;
  notes: string;
  class: string;
}

export const DRUG_SHEETS_DB: DrugInfo[] = [
  // Vasoactives & Inotropes
  { 
    name: "Norepinephrine", 
    class: "Vasoactive", 
    indication: "Septic shock, severe hypotension", 
    dose: "0.01 - 3 mcg/kg/min (titrate to MAP > 65)", 
    concentration: "4 mg / 250 mL D5W or NS (16 mcg/mL) or 8 mg / 250 mL (32 mcg/mL)", 
    notes: "First-line vasopressor for septic shock. Best infused via central line to prevent tissue necrosis from extravasation." 
  },
  { 
    name: "Epinephrine", 
    class: "Vasoactive", 
    indication: "Cardiac arrest, anaphylaxis, cardiogenic shock", 
    dose: "Cardiac arrest: 1 mg IV q3-5 min. Infusion: 0.01 - 1 mcg/kg/min", 
    concentration: "4 mg / 250 mL (16 mcg/mL)", 
    notes: "May cause significant tachycardia, hyperglycemia, and increased lactate. Potent inotrope and chronotrope." 
  },
  { 
    name: "Vasopressin", 
    class: "Vasoactive", 
    indication: "Vasodilatory shock, adjunct to norepinephrine", 
    dose: "0.03 - 0.04 units/min (fixed dose, not titrated)", 
    concentration: "20 units / 100 mL NS (0.2 units/mL)", 
    notes: "Not typically titrated. Rapid discontinuation may cause rebound hypotension. Can cause splanchnic ischemia at high doses." 
  },
  { 
    name: "Dobutamine", 
    class: "Inotrope", 
    indication: "Cardiogenic shock, severe heart failure with low cardiac output", 
    dose: "2 - 20 mcg/kg/min", 
    concentration: "250 mg / 250 mL D5W (1000 mcg/mL)", 
    notes: "Can cause arrhythmias and peripheral vasodilation (resulting in transient hypotension). Do not mix with sodium bicarbonate." 
  },
  { 
    name: "Milrinone", 
    class: "Inotrope / Vasodilator", 
    indication: "Decompensated heart failure, cardiogenic shock", 
    dose: "0.125 - 0.75 mcg/kg/min (loading dose of 50 mcg/kg often omitted in ICU)", 
    concentration: "20 mg / 100 mL D5W (200 mcg/mL)", 
    notes: "Phosphodiesterase-3 inhibitor. Causes more vasodilation than dobutamine. Renally cleared; adjust dose in severe renal impairment." 
  },
  
  // Sedatives & Analgesics
  { 
    name: "Propofol", 
    class: "Sedative", 
    indication: "ICU sedation for mechanically ventilated patients", 
    dose: "5 - 80 mcg/kg/min", 
    concentration: "1000 mg / 100 mL (10 mg/mL lipid emulsion)", 
    notes: "Rapid onset/offset. Can cause hypotension and respiratory depression. Monitor for Propofol Infusion Syndrome (PRIS). Change tubing q12h." 
  },
  { 
    name: "Dexmedetomidine (Precedex)", 
    class: "Sedative", 
    indication: "ICU sedation, useful for extubation or delirium", 
    dose: "0.2 - 1.5 mcg/kg/hr", 
    concentration: "200 mcg / 50 mL or 400 mcg / 100 mL (4 mcg/mL)", 
    notes: "Alpha-2 agonist. Does not cause respiratory depression. Watch for bradycardia and hypotension. Avoid loading doses in ICU." 
  },
  { 
    name: "Midazolam", 
    class: "Sedative", 
    indication: "Procedural sedation, status epilepticus, severe agitation", 
    dose: "1 - 10 mg/hr", 
    concentration: "100 mg / 100 mL (1 mg/mL) or 50 mg / 50 mL", 
    notes: "Benzodiazepine. Risk of prolonged sedation in obesity or renal/hepatic failure due to active metabolites. Associated with ICU delirium." 
  },
  { 
    name: "Fentanyl", 
    class: "Analgesic", 
    indication: "Analgesia, adjunct to sedation", 
    dose: "25 - 250 mcg/hr", 
    concentration: "1000 mcg / 100 mL NS (10 mcg/mL) or 2500 mcg / 250 mL", 
    notes: "Synthetic opioid. Rapid onset, lacks histamine release (hemodynamically stable). Can accumulate with prolonged continuous infusions." 
  },
  { 
    name: "Ketamine", 
    class: "Sedative / Analgesic", 
    indication: "Procedural sedation, refractory pain, severe bronchospasm", 
    dose: "Pain: 0.1 - 0.5 mg/kg/hr. Sedation: 1 - 2 mg/kg/hr", 
    concentration: "500 mg / 50 mL (10 mg/mL)", 
    notes: "NMDA antagonist. Causes dissociative anesthesia. Bronchodilator properties. May increase heart rate and blood pressure." 
  },
  
  // Antiarrhythmics
  { 
    name: "Amiodarone", 
    class: "Antiarrhythmic", 
    indication: "Ventricular tachycardia/fibrillation, atrial fibrillation", 
    dose: "Cardiac arrest: 300 mg bolus. Infusion: 150 mg over 10 min, then 1 mg/min x 6 hrs, then 0.5 mg/min x 18 hrs.", 
    concentration: "450 mg / 250 mL D5W (1.8 mg/mL) or 900 mg / 500 mL", 
    notes: "Must use inline filter (0.22 micron). May cause hypotension during rapid bolus due to solvents. Can cause bradycardia and thyroid/pulmonary toxicity long-term." 
  },
  { 
    name: "Adenosine", 
    class: "Antiarrhythmic", 
    indication: "Paroxysmal Supraventricular Tachycardia (SVT)", 
    dose: "6 mg rapid IV push, followed by 12 mg if no conversion", 
    concentration: "Vials of 6 mg/2 mL (3 mg/mL)", 
    notes: "Extremely short half-life (<10 sec). Must be given as a rapid bolus followed by a rapid 20 mL saline flush. Causes transient asystole." 
  },
  
  // Neuromuscular Blockers (Paralytics)
  { 
    name: "Rocuronium", 
    class: "Paralytic (Non-depolarizing)", 
    indication: "Rapid sequence intubation (RSI), continuous paralysis (ARDS)", 
    dose: "RSI bolus: 0.6 - 1.2 mg/kg. Infusion: 8 - 12 mcg/kg/min", 
    concentration: "Usually 50 mg/5 mL (10 mg/mL)", 
    notes: "Ensure patient is deeply sedated before administration. Duration of action is 30-60 minutes. Can be reversed by Sugammadex." 
  },
  { 
    name: "Succinylcholine", 
    class: "Paralytic (Depolarizing)", 
    indication: "Rapid sequence intubation (RSI)", 
    dose: "1 - 1.5 mg/kg IV push", 
    concentration: "Usually 200 mg/10 mL (20 mg/mL)", 
    notes: "Ultra-rapid onset and short duration (5-10 min). Contraindicated in hyperkalemia, major burns/crush injuries, and malignant hyperthermia." 
  },
  
  // Electrolytes / Resuscitation
  {
    name: "Magnesium Sulfate",
    class: "Electrolyte",
    indication: "Torsades de pointes, severe asthma, hypomagnesemia, preeclampsia",
    dose: "Torsades/Asthma: 2 g IV over 10-20 mins. Eclampsia: 4 g loading dose.",
    concentration: "Usually 50% solution (500 mg/mL)",
    notes: "Can cause hypotension and depressed deep tendon reflexes at toxic levels. Calcium gluconate is the antidote for toxicity."
  },
  {
    name: "Calcium Gluconate",
    class: "Electrolyte",
    indication: "Hyperkalemia, hypocalcemia, calcium channel blocker overdose",
    dose: "1 - 3 g IV over 5-10 mins (central or peripheral line)",
    concentration: "10% solution (100 mg/mL or 0.46 mEq Ca/mL)",
    notes: "Less irritating to peripheral veins than Calcium Chloride. Essential for stabilizing myocardium in severe hyperkalemia."
  },
  {
    name: "Sodium Bicarbonate",
    class: "Electrolyte",
    indication: "Severe metabolic acidosis (pH < 7.1), TCA overdose, hyperkalemia",
    dose: "1 - 2 mEq/kg IV push or continuous infusion",
    concentration: "8.4% solution (50 mEq/50 mL) or mixed in D5W for drip",
    notes: "Can cause hypernatremia and paradoxical intracellular acidosis. Ensure adequate ventilation to clear generated CO2."
  }
];
