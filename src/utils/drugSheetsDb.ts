export interface DrugInfo {
  name: string;
  indication: string;
  dose: string;
  concentration: string;
  notes: string;
  class: string;
}

export const DRUG_SHEETS_DB: DrugInfo[] = [
  { 
    name: "Norepinephrine", 
    class: "Vasoactive", 
    indication: "Refractory hypotension, shock", 
    dose: "0.01 - 3 mcg/kg/min", 
    concentration: "4 mg / 250 mL D5W or NS", 
    notes: "Must be infused via a central venous catheter. Protect from extravasation risk." 
  },
  { 
    name: "Amiodarone", 
    class: "Antiarrhythmic", 
    indication: "Pulseless VT/VF, Afib conversion", 
    dose: "150 mg bolus over 10 min, then 1 mg/min", 
    concentration: "450 mg / 250 mL D5W", 
    notes: "Requires inline filter. Avoid PVC tubing for maintenance infusion." 
  },
  { 
    name: "Propofol", 
    class: "Sedative", 
    indication: "ICU sedation, mechanical ventilation", 
    dose: "5 - 80 mcg/kg/min", 
    concentration: "1000 mg / 100 mL (10 mg/mL)", 
    notes: "Monitor triglycerides and BP. Change tubing every 12 hours." 
  }
];
