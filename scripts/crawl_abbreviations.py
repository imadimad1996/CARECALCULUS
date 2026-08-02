import asyncio
import json
import re
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

async def crawl_abbreviations():
    print("Starting crawl for Medical Abbreviations...")
    
    # We will crawl a couple of Wikipedia pages for medical abbreviations as a reliable source.
    urls = [
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_A",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_B",
        "https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_C"
    ]
    
    browser_config = BrowserConfig(headless=True)
    crawler_config = CrawlerRunConfig(page_timeout=30000, remove_overlay_elements=True)
    
    abbreviations = []
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        results = await crawler.arun_many(urls=urls, config=crawler_config, max_concurrent=3)
        
        for result in results:
            if result.success:
                print(f"Successfully crawled: {result.url}")
                # Parse the markdown tables
                md = result.markdown
                # Wikipedia tables in markdown usually look like:
                # | Abbreviation | Meaning |
                # |---|---|
                # | AAA | Abdominal aortic aneurysm |
                
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
                            
                            # Clean up markdown links like [Abdominal aortic aneurysm](...)
                            meaning = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', meaning)
                            term = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', term)
                            
                            if term and meaning and term != 'Abbreviation' and len(term) < 15:
                                # Simple category assignment based on heuristics
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
                                
                                abbreviations.append({
                                    "term": term.strip(),
                                    "en": meaning.strip(),
                                    "fr": meaning.strip(), # Placeholder for translation
                                    "category": category
                                })
                    elif in_table and not line.startswith('|'):
                        in_table = False
            else:
                print(f"Failed to crawl {result.url}: {result.error_message}")
                
    # Save to JSON
    output_file = 'src/data/abbreviations_new.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(abbreviations, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(abbreviations)} abbreviations. Saved to {output_file}")

if __name__ == "__main__":
    asyncio.run(crawl_abbreviations())
