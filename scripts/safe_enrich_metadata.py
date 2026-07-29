import os
import re
from pathlib import Path

PAGES_DIR = Path("src/pages")

FILES = [
    ("BmiCalculator.tsx", "/bmi-calculator"),
    ("DripRate.tsx", "/drip-rate-calculator"),
    ("CreatinineClearance.tsx", "/creatinine-clearance"),
    ("MedicalConversions.tsx", "/medical-conversions"),
    ("CorrectedCalcium.tsx", "/corrected-calcium"),
    ("QsofaScore.tsx", "/qsofa-score"),
    ("Curb65Score.tsx", "/curb65-score"),
    ("Phq9Score.tsx", "/phq9-score"),
    ("SirsCriteria.tsx", "/sirs-criteria"),
    ("PfRatio.tsx", "/pf-ratio"),
    ("TidalVolume.tsx", "/tidal-volume"),
    ("AncCalculator.tsx", "/anc-calculator"),
    ("AdjustedBodyWeight.tsx", "/adjusted-body-weight"),
    ("SteroidConversion.tsx", "/steroid-conversion"),
    ("ApgarScore.tsx", "/apgar-score"),
    ("AnionGap.tsx", "/anion-gap"),
    ("AaGradient.tsx", "/aa-gradient"),
    ("NutritionTdee.tsx", "/nutrition-tdee"),
    ("NutritionMust.tsx", "/nutrition-must"),
    ("NutritionNrs2002.tsx", "/nutrition-nrs2002"),
    ("MdrdGfr.tsx", "/mdrd-gfr"),
    ("CkdEpiGfr.tsx", "/ckd-epi-gfr"),
    ("PhenytoinCorrection.tsx", "/phenytoin-correction"),
    ("AscvdRisk.tsx", "/ascvd-risk"),
    ("VancomycinDosing.tsx", "/vancomycin-dosing"),
    ("AminoglycosideDosing.tsx", "/aminoglycoside-dosing"),
    ("PesiScore.tsx", "/pesi-score"),
    ("BovaScore.tsx", "/bova-score"),
    ("ApacheIIScore.tsx", "/apache-ii-score"),
    ("SapsIIScore.tsx", "/saps-ii-score"),
    ("BishopScore.tsx", "/bishop-score"),
    ("CentorScore.tsx", "/centor-score")
]

for filename, path in FILES:
    filepath = PAGES_DIR / filename
    if not filepath.exists():
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Add JsonLd import if missing
    if "JsonLd" not in content:
        content = "import { JsonLd } from '../components/JsonLd';\n" + content
        
    # Inject JsonLd element safely INSIDE CalculatorShell tag or main div
    if "<JsonLd" not in content:
        jsonld_elem = f'\n      <JsonLd path="{path}" title="Clinical Decision Support — CareCalculus" description="Evidence-based medical decision support calculator." type="SoftwareApplication" />'
        
        if "<CalculatorShell" in content:
            # Insert AFTER the opening <CalculatorShell ...> tag
            content = re.sub(r'(<CalculatorShell[^>]*>)', r'\1' + jsonld_elem, content, count=1)
        elif "<div className=" in content:
            content = re.sub(r'(<div className="[^"]*">)', r'\1' + jsonld_elem, content, count=1)
            
    if "VancomycinDosing" in filename or "AminoglycosideDosing" in filename:
        if "clinicalText" not in content:
            content = content.replace("warning:", 'clinicalText: "Therapeutic drug monitoring and clinical decision support protocol.",\n      warning:', 1)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"[+] Safely enriched {filename}")
