import asyncio
import json
import re
import os
from pathlib import Path
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

# Competitor target directories / URLs for medical calculators & specialties audit
TARGET_URLS = [
    "https://www.mdcalc.com/calc",
]

# Internal CareCalculus route list from src/routes/index.tsx
CARE_CALCULUS_PAGES = [
    "MapCalculator", "BmiCalculator", "GcsCalculator", "DripRate", "CreatinineClearance",
    "WellsScore", "MedicalConversions", "CorrectedCalcium", "QsofaScore", "Curb65Score",
    "Cha2ds2VascScore", "Phq9Score", "MeldScore", "SirsCriteria", "PfRatio", "TidalVolume",
    "AncCalculator", "AdjustedBodyWeight", "SteroidConversion", "ApgarScore", "SofaScore",
    "ChildPughScore", "AnionGap", "AaGradient", "NutritionTdee", "NutritionMust",
    "NutritionNrs2002", "MdrdGfr", "CkdEpiGfr", "ParklandFormula", "FenaCalculator",
    "WintersFormula", "HasBledScore", "CiwaArScore", "FreeWaterDeficit", "SodiumCorrection",
    "HeparinDosing", "OpioidConversion", "MaintenanceFluids", "OsmolalGap", "TimiScore",
    "HeartScore", "PercRule", "GenevaScore", "NihssScore", "GraceScore", "BicarbDeficit",
    "ReticIndex", "PhenytoinCorrection", "AscvdRisk", "VancomycinDosing", "AminoglycosideDosing",
    "PesiScore", "BovaScore", "ApacheIIScore", "SapsIIScore", "BishopScore", "CentorScore"
]

# Known Essential Medical Specialties & High-Yield Calculators Matrix
EXPECTED_SPECIALTIES = {
    "Emergency & Critical Care": ["MAP", "GCS", "qSOFA", "SOFA", "APACHE II", "SAPS II", "P/F Ratio", "Tidal Volume", "SIRS", "Parkland Formula"],
    "Cardiology & Vascular": ["CHA2DS2-VASc", "HAS-BLED", "HEART Score", "TIMI", "GRACE", "ASCVD Risk", "Bova Score", "Framingham Risk Score", "HFA-PEFF Score"],
    "Nephrology & Electrolytes": ["CKD-EPI GFR", "MDRD GFR", "Creatinine Clearance", "FENA", "Anion Gap", "Free Water Deficit", "Sodium Correction", "Bicarb Deficit", "Schwartz Pediatric GFR"],
    "Pulmonology & Respi": ["CURB-65", "Wells PE", "PERC Rule", "Geneva Score", "PESI Score", "A-a Gradient", "Winter's Formula"],
    "Gastroenterology & Hepatology": ["MELD Score", "Child-Pugh Score"],
    "Neurology & Psychiatry": ["Glasgow Coma Scale", "NIHSS", "PHQ-9", "CIWA-Ar"],
    "Pharmacology & Dosing": ["Drip Rate", "Steroid Conversion", "Opioid Conversion", "Heparin Dosing", "Vancomycin Dosing", "Aminoglycoside Dosing", "Phenytoin Correction"],
    "Nutrition & Body Metrics": ["BMI", "Adjusted Body Weight", "TDEE", "MUST Score", "NRS-2002", "Maintenance Fluids (Adult)"],
    "Pediatrics & Neonatology": ["APGAR Score", "Pediatric GCS", "Holliday-Segar 4-2-1 Fluid Rule", "Pediatric Dosage Calculator"],
    "Obstetrics & Gynecology": ["Bishop Score", "Naegele EDD Calculator", "Gestational Age CRL"],
    "Hematology & Oncology": ["Reticulocyte Index", "ANC Calculator", "4Ts Score for HIT", "MASCC Neutropenic Fever Risk"],
    "Toxicology": ["Osmolal Gap", "Rumack-Matthew Acetaminophen Nomogram"]
}

async def run_audit():
    print("[+] Running Crawl4AI Medical Calculator Audit...")
    
    browser_config = BrowserConfig(headless=True, viewport_width=1280, viewport_height=800)
    crawler_config = CrawlerRunConfig(page_timeout=30000, remove_overlay_elements=True)
    
    discovered_external = []
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        for url in TARGET_URLS:
            try:
                print(f"[*] Crawling {url} ...")
                result = await crawler.arun(url=url, config=crawler_config)
                if result.success and result.markdown:
                    print(f"[+] Successfully retrieved markdown ({len(result.markdown)} chars)")
                    # Simple link/text extraction from markdown
                    lines = result.markdown.split("\n")
                    for line in lines:
                        if "[" in line and "]" in line and "calc" in line.lower():
                            discovered_external.append(line.strip())
            except Exception as e:
                print(f"[*] Crawl notice for {url}: {e}")

    # Build Comprehensive Gap Matrix
    missing_calculators = []
    covered_count = 0
    total_matrix_count = 0
    
    care_calculus_lower = [name.lower() for name in CARE_CALCULUS_PAGES]
    
    specialty_report = {}
    
    for specialty, calcs in EXPECTED_SPECIALTIES.items():
        specialty_report[specialty] = {
            "covered": [],
            "missing": []
        }
        for calc in calcs:
            total_matrix_count += 1
            # Check matching keyword
            clean_name = re.sub(r'[^a-zA-Z0-9]', '', calc).lower()
            is_covered = any(clean_name in p.lower() or p.lower() in clean_name for p in CARE_CALCULUS_PAGES)
            
            # Manual precise overrides
            if calc in ["MAP", "GCS", "qSOFA", "SOFA", "APACHE II", "SAPS II", "P/F Ratio", "Tidal Volume", "SIRS", "Parkland Formula",
                        "CHA2DS2-VASc", "HAS-BLED", "HEART Score", "TIMI", "GRACE", "ASCVD Risk", "Bova Score",
                        "CKD-EPI GFR", "MDRD GFR", "Creatinine Clearance", "FENA", "Anion Gap", "Free Water Deficit", "Sodium Correction", "Bicarb Deficit",
                        "CURB-65", "Wells PE", "PERC Rule", "Geneva Score", "PESI Score", "A-a Gradient", "Winter's Formula",
                        "MELD Score", "Child-Pugh Score", "Glasgow Coma Scale", "NIHSS", "PHQ-9", "CIWA-Ar",
                        "Drip Rate", "Steroid Conversion", "Opioid Conversion", "Heparin Dosing", "Vancomycin Dosing", "Aminoglycoside Dosing", "Phenytoin Correction",
                        "BMI", "Adjusted Body Weight", "TDEE", "MUST Score", "NRS-2002", "Maintenance Fluids (Adult)",
                        "APGAR Score", "Bishop Score", "Osmolal Gap", "Reticulocyte Index", "ANC Calculator"]:
                is_covered = True
                
            if is_covered:
                specialty_report[specialty]["covered"].append(calc)
                covered_count += 1
            else:
                specialty_report[specialty]["missing"].append(calc)
                missing_calculators.append({"name": calc, "specialty": specialty})

    summary = {
        "care_calculus_total_tools": len(CARE_CALCULUS_PAGES),
        "audit_matrix_total": total_matrix_count,
        "covered_in_matrix": covered_count,
        "coverage_percentage": f"{round((covered_count / total_matrix_count) * 100, 1)}%",
        "specialties": specialty_report,
        "top_missing_recommendations": missing_calculators
    }

    # Save output JSON
    out_dir = Path("dist/audit")
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "calculator_gap_report.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
        
    print("\n[+] Audit Complete!")
    print(f"[*] CareCalculus Total Existing Tools: {summary['care_calculus_total_tools']}")
    print(f"[*] Global Benchmark Coverage Rate: {summary['coverage_percentage']}")
    print(f"[*] Top Missing Calculators Identified: {len(missing_calculators)}")
    for item in missing_calculators:
        print(f"  - [{item['specialty']}] {item['name']}")

if __name__ == "__main__":
    asyncio.run(run_audit())
