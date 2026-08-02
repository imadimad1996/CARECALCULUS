import asyncio
import json
import re
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

async def crawl_drugs():
    print("Starting crawl for ICU Drug Reference...")
    
    # Target LitFL (Life in the Fast Lane) critical care drug pages
    urls = [
        "https://litfl.com/norepinephrine/",
        "https://litfl.com/epinephrine/",
        "https://litfl.com/vasopressin/",
        "https://litfl.com/dobutamine/",
        "https://litfl.com/amiodarone/",
        "https://litfl.com/propofol/",
        "https://litfl.com/ketamine/",
        "https://litfl.com/rocuronium/",
        "https://litfl.com/fentanyl/",
        "https://litfl.com/midazolam/",
        "https://litfl.com/dexmedetomidine/",
        "https://litfl.com/succinylcholine/",
        "https://litfl.com/atropine/",
        "https://litfl.com/adenosine/",
        "https://litfl.com/magnesium-sulfate/",
        "https://litfl.com/calcium-gluconate/",
        "https://litfl.com/sodium-bicarbonate/"
    ]
    
    browser_config = BrowserConfig(headless=True)
    crawler_config = CrawlerRunConfig(page_timeout=30000, remove_overlay_elements=True)
    
    drugs = []
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        results = await crawler.arun_many(urls=urls, config=crawler_config, max_concurrent=3)
        
        for result in results:
            if result.success:
                print(f"Successfully crawled: {result.url}")
                md = result.markdown
                
                # Drug name is usually the URL slug or Title
                name_match = re.search(r'#\s*([^\n]+)', md)
                name = name_match.group(1).strip() if name_match else result.url.split('/')[-2].replace('-', ' ').title()
                
                # Simple regex heuristics to extract dose and indications if available
                # LitFL usually has sections like "## Indications", "## Dose", etc.
                
                indication = "Critical Care / Resuscitation"
                ind_match = re.search(r'(?i)##\s*Indications.*?\n(.*?)(?=##|\Z)', md, re.DOTALL)
                if ind_match:
                    indication = ind_match.group(1).strip()[:100] + "..."
                
                dose = "Titrate to effect"
                dose_match = re.search(r'(?i)##\s*(?:Dose|Dosing).*?\n(.*?)(?=##|\Z)', md, re.DOTALL)
                if dose_match:
                    dose = dose_match.group(1).strip()[:80] + "..."
                    
                notes_match = re.search(r'(?i)##\s*Adverse [eE]ffects.*?\n(.*?)(?=##|\Z)', md, re.DOTALL)
                notes = notes_match.group(1).strip()[:100] + "..." if notes_match else "Monitor continuously."
                
                # Clean up markdown chars
                indication = re.sub(r'[*_#]', '', indication).replace('\n', ' ')
                dose = re.sub(r'[*_#]', '', dose).replace('\n', ' ')
                notes = re.sub(r'[*_#]', '', notes).replace('\n', ' ')
                
                # Determine class by name
                drug_class = "Critical Care"
                if "epinephrine" in name.lower() or "dobutamine" in name.lower() or "vasopressin" in name.lower():
                    drug_class = "Vasoactive"
                elif "amiodarone" in name.lower() or "adenosine" in name.lower():
                    drug_class = "Antiarrhythmic"
                elif "propofol" in name.lower() or "midazolam" in name.lower() or "dexmedetomidine" in name.lower():
                    drug_class = "Sedative"
                elif "fentanyl" in name.lower():
                    drug_class = "Analgesic"
                elif "rocuronium" in name.lower() or "succinylcholine" in name.lower():
                    drug_class = "Paralytic"
                elif "calcium" in name.lower() or "magnesium" in name.lower() or "sodium" in name.lower():
                    drug_class = "Electrolyte"
                
                drugs.append({
                    "name": name,
                    "class": drug_class,
                    "indication": indication.strip() or "Standard critical care indication",
                    "dose": dose.strip() or "Standard ICU dosing",
                    "concentration": "Standard ICU concentration", # Hard to parse from general text
                    "notes": notes.strip()
                })
            else:
                print(f"Failed to crawl {result.url}: {result.error_message}")
                
    # Save to JSON
    output_file = 'src/data/drugs_new.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(drugs, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(drugs)} drugs. Saved to {output_file}")

if __name__ == "__main__":
    asyncio.run(crawl_drugs())
