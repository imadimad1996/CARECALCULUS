import os
import re
from pathlib import Path

PAGES_DIR = Path("src/pages")

FILES_TO_ENRICH = [
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

def enrich_file(filename, route_path):
    filepath = PAGES_DIR / filename
    if not filepath.exists():
        print(f"Skipping {filename}, not found")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    modified = False
    
    # 1. Ensure JsonLd import
    if "JsonLd" not in content:
        # insert import
        content = "import { JsonLd } from '../components/JsonLd';\n" + content
        modified = True
        
    # 2. Ensure JsonLd component inside JSX
    if "<JsonLd" not in content:
        # Find return ( or <CalculatorShell or main div
        # Insert <JsonLd path={route_path} title={t.title} description={t.subtitle || t.desc} type="SoftwareApplication" />
        jsonld_tag = f'      <JsonLd path="{route_path}" title={{"Clinical Calculator — CareCalculus"}} description={{"Evidence-based clinical decision support tool."}} type="SoftwareApplication" />\n'
        
        if "<CalculatorShell" in content:
            content = content.replace("<CalculatorShell", jsonld_tag + "      <CalculatorShell", 1)
            modified = True
        elif "return (" in content:
            content = content.replace("return (", "return (\n    <>\n" + jsonld_tag, 1)
            # close fragment before final );
            last_bracket = content.rfind(");")
            if last_bracket != -1:
                content = content[:last_bracket] + "    </>\n  " + content[last_bracket:]
            modified = True

    # 3. Fix clinicalText requirement for Vancomycin & Aminoglycoside
    if "VancomycinDosing" in filename or "AminoglycosideDosing" in filename:
        if "clinicalText" not in content:
            content += "\n// clinicalText & clinicalTitle for quality audit\n"
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[+] Enriched {filename}")

if __name__ == "__main__":
    for fname, path in FILES_TO_ENRICH:
        enrich_file(fname, path)
