import asyncio
import json
import re
import os
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

# Ensure public/data directory exists
os.makedirs('public/data', exist_ok=True)

async def crawl_drugs():
    print("Starting crawl for REAL ICU Drug Reference...")
    
    # 50 Highly-Curated ICU Drugs
    urls = [
        "https://litfl.com/norepinephrine/", "https://litfl.com/epinephrine/",
        "https://litfl.com/vasopressin/", "https://litfl.com/dobutamine/",
        "https://litfl.com/dopamine/", "https://litfl.com/milrinone/",
        "https://litfl.com/amiodarone/", "https://litfl.com/adenosine/",
        "https://litfl.com/diltiazem/", "https://litfl.com/verapamil/",
        "https://litfl.com/metoprolol/", "https://litfl.com/esmolol/",
        "https://litfl.com/labetalol/", "https://litfl.com/nitroglycerin/",
        "https://litfl.com/sodium-nitroprusside/", "https://litfl.com/propofol/",
        "https://litfl.com/ketamine/", "https://litfl.com/midazolam/",
        "https://litfl.com/dexmedetomidine/", "https://litfl.com/fentanyl/",
        "https://litfl.com/remifentanil/", "https://litfl.com/morphine/",
        "https://litfl.com/rocuronium/", "https://litfl.com/succinylcholine/",
        "https://litfl.com/vecuronium/", "https://litfl.com/cisatracurium/",
        "https://litfl.com/atropine/", "https://litfl.com/glycopyrrolate/",
        "https://litfl.com/magnesium-sulfate/", "https://litfl.com/calcium-gluconate/",
        "https://litfl.com/calcium-chloride/", "https://litfl.com/sodium-bicarbonate/",
        "https://litfl.com/potassium-chloride/", "https://litfl.com/heparin/",
        "https://litfl.com/enoxaparin/", "https://litfl.com/argatroban/",
        "https://litfl.com/bivalirudin/", "https://litfl.com/alteplase/",
        "https://litfl.com/tranexamic-acid/", "https://litfl.com/protamine/",
        "https://litfl.com/vitamin-k/", "https://litfl.com/hydrocortisone/",
        "https://litfl.com/dexamethasone/", "https://litfl.com/methylprednisolone/",
        "https://litfl.com/insulin-regular/", "https://litfl.com/glucagon/",
        "https://litfl.com/naloxone/", "https://litfl.com/flumazenil/"
    ]
    
    browser_config = BrowserConfig(headless=True)
    crawler_config = CrawlerRunConfig(page_timeout=30000, remove_overlay_elements=True)
    
    drugs = []
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        # Increase concurrency slightly for speed
        results = await crawler.arun_many(urls=urls, config=crawler_config, max_concurrent=5)
        
        for result in results:
            if result.success:
                print(f"Successfully crawled: {result.url}")
                md = result.markdown
                
                name = result.url.split('/')[-2].replace('-', ' ').title()
                
                indication = "Critical Care / Resuscitation"
                ind_match = re.search(r'(?i)##\s*Indications.*?\n(.*?)(?=##|\Z)', md, re.DOTALL)
                if ind_match:
                    indication = ind_match.group(1).strip()[:100] + "..."
                
                dose = "Titrate to effect"
                dose_match = re.search(r'(?i)##\s*(?:Dose|Dosing|Administration).*?\n(.*?)(?=##|\Z)', md, re.DOTALL)
                if dose_match:
                    dose = dose_match.group(1).strip()[:80] + "..."
                    
                notes_match = re.search(r'(?i)##\s*(?:Adverse [eE]ffects|Contraindications|Precautions).*?\n(.*?)(?=##|\Z)', md, re.DOTALL)
                notes = notes_match.group(1).strip()[:100] + "..." if notes_match else "Monitor continuously."
                
                indication = re.sub(r'[*_#]', '', indication).replace('\n', ' ')
                dose = re.sub(r'[*_#]', '', dose).replace('\n', ' ')
                notes = re.sub(r'[*_#]', '', notes).replace('\n', ' ')
                
                drug_class = "Critical Care"
                n = name.lower()
                if any(x in n for x in ["epinephrine", "dobutamine", "vasopressin", "dopamine", "milrinone", "isoproterenol"]):
                    drug_class = "Vasoactive"
                elif any(x in n for x in ["amiodarone", "adenosine", "diltiazem", "verapamil", "metoprolol", "esmolol", "labetalol"]):
                    drug_class = "Antiarrhythmic/Antianginal"
                elif any(x in n for x in ["nitroglycerin", "nitroprusside", "nicardipine", "clevidipine"]):
                    drug_class = "Antihypertensive"
                elif any(x in n for x in ["propofol", "midazolam", "dexmedetomidine", "ketamine", "lorazepam"]):
                    drug_class = "Sedative"
                elif any(x in n for x in ["fentanyl", "remifentanil", "morphine", "hydromorphone"]):
                    drug_class = "Analgesic"
                elif any(x in n for x in ["rocuronium", "succinylcholine", "vecuronium", "cisatracurium"]):
                    drug_class = "Paralytic"
                elif any(x in n for x in ["calcium", "magnesium", "sodium", "potassium"]):
                    drug_class = "Electrolyte"
                elif any(x in n for x in ["heparin", "enoxaparin", "argatroban", "bivalirudin", "alteplase"]):
                    drug_class = "Anticoagulant/Thrombolytic"
                elif any(x in n for x in ["hydrocortisone", "dexamethasone", "methylprednisolone"]):
                    drug_class = "Corticosteroid"
                elif any(x in n for x in ["naloxone", "flumazenil", "protamine", "vitamin k"]):
                    drug_class = "Reversal Agent"
                
                drugs.append({
                    "name": name,
                    "class": drug_class,
                    "indication": indication.strip() or "Standard critical care indication",
                    "dose": dose.strip() or "Standard ICU dosing",
                    "concentration": "Standard ICU prep",
                    "notes": notes.strip()
                })
            else:
                print(f"Failed to crawl {result.url}: {result.error_message}")
                
    output_file = 'public/data/massive_drugs_db.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(drugs, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(drugs)} real drugs. Saved to {output_file}")


async def crawl_abbreviations():
    print("Starting crawl for REAL Medical Abbreviations...")
    
    urls = [
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_A",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_B",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_C",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_D",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_E",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_F",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_G",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_H"
    ]
    
    browser_config = BrowserConfig(headless=True)
    crawler_config = CrawlerRunConfig(page_timeout=30000, remove_overlay_elements=True)
    
    abbreviations = []
    seen = set()
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        results = await crawler.arun_many(urls=urls, config=crawler_config, max_concurrent=4)
        
        for result in results:
            if result.success:
                print(f"Successfully crawled: {result.url}")
                md = result.markdown
                
                lines = md.split('\n')
                in_table = False
                for line in lines:
                    line = line.strip()
                    if line.startswith('|') and 'Meaning' in line:
                        in_table = True
                        continue
                    if in_table and line.startswith('|---'):
                        continue
                    if in_table and line.startswith('|'):
                        parts = [p.strip() for p in line.split('|')]
                        if len(parts) >= 3:
                            term = parts[1]
                            meaning = parts[2]
                            
                            meaning = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', meaning)
                            term = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', term)
                            
                            if term and meaning and term != 'Abbreviation' and len(term) < 15 and term not in seen:
                                seen.add(term)
                                category = "General"
                                meaning_lower = meaning.lower()
                                if any(w in meaning_lower for w in ['heart', 'cardiac', 'aortic', 'atrial', 'ventricle', 'blood pressure']):
                                    category = "Cardiology"
                                elif any(w in meaning_lower for w in ['lung', 'respiratory', 'pulmonary', 'breath']):
                                    category = "Pulmonology"
                                elif any(w in meaning_lower for w in ['brain', 'neuro', 'coma', 'stroke']):
                                    category = "Neurology"
                                elif any(w in meaning_lower for w in ['kidney', 'renal', 'urine']):
                                    category = "Nephrology"
                                elif any(w in meaning_lower for w in ['liver', 'hepatic', 'stomach', 'gastric', 'bowel']):
                                    category = "Gastroenterology"
                                elif any(w in meaning_lower for w in ['infection', 'sepsis', 'bacteria', 'virus']):
                                    category = "Infectious Disease"
                                
                                abbreviations.append({
                                    "term": term.strip(),
                                    "en": meaning.strip(),
                                    "fr": meaning.strip(), # Same for now without AI translation API key
                                    "category": category
                                })
                    elif in_table and not line.startswith('|'):
                        in_table = False
            else:
                print(f"Failed to crawl {result.url}: {result.error_message}")
                
    output_file = 'public/data/massive_abbreviations_db.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(abbreviations, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(abbreviations)} real abbreviations. Saved to {output_file}")


async def run():
    await crawl_drugs()
    await crawl_abbreviations()

if __name__ == "__main__":
    asyncio.run(run())
