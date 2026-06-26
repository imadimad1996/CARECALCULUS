import asyncio
import json
import re
from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from urllib.parse import urlparse

async def evaluate_pages():
    print("Starting Phase 2: SEO & Design System Extraction...")
    
    with open("urls_to_crawl.json", "r", encoding="utf-8") as f:
        urls_dict = json.load(f)
        
    target_urls = []
    for domain, links in urls_dict.items():
        # Taking 5 links per domain for rapid testing/extraction
        target_urls.extend(links[:5])
        
    print(f"Loaded {len(target_urls)} URLs for intelligence extraction.")

    browser_config = BrowserConfig(
        headless=False,
        viewport_width=1920,
        viewport_height=1080
    )
    
    crawler_config = CrawlerRunConfig(
        page_timeout=60000,
        cache_mode=CacheMode.BYPASS,
        magic=True,
        js_code="await new Promise(r => setTimeout(r, 2000));"
    )
    
    results_data = []
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        results = await crawler.arun_many(
            urls=target_urls,
            config=crawler_config,
            max_concurrent=3
        )
        
        for result in results:
            if not result.success:
                print(f"❌ Failed extraction for {result.url}: {result.error_message}")
                continue
                
            print(f"✅ Extracted Assets from: {result.url}")
            domain = urlparse(result.url).netloc
            html = result.html
            
            if not html:
                continue
                
            soup = BeautifulSoup(html, "html.parser")
            
            # --- SEO STEALING ---
            seo_data = {
                "title": soup.title.string.strip() if soup.title and soup.title.string else "",
                "description": "",
                "keywords": "",
                "headings": {"h1": [], "h2": [], "h3": []},
            }
            
            meta_desc = soup.find("meta", attrs={"name": "description"})
            if meta_desc and meta_desc.get("content"):
                seo_data["description"] = meta_desc["content"].strip()
                
            meta_keys = soup.find("meta", attrs={"name": "keywords"})
            if meta_keys and meta_keys.get("content"):
                seo_data["keywords"] = meta_keys["content"].strip()
                
            for h in ["h1", "h2", "h3"]:
                for tag in soup.find_all(h):
                    text = tag.get_text(strip=True)
                    if text and text not in seo_data["headings"][h]:
                        seo_data["headings"][h].append(text)
                        
            # --- DESIGN SYSTEM REVERSE-ENGINEERING ---
            design_data = {
                "colors": [],
                "fonts": []
            }
            
            # Extract hex colors from inline styles and <style> tags
            hex_pattern = re.compile(r'#(?:[0-9a-fA-F]{3}){1,2}\b')
            style_texts = [s.get_text() for s in soup.find_all("style")]
            for tag in soup.find_all(style=True):
                style_texts.append(tag['style'])
                
            all_style_content = " ".join(style_texts)
            colors = set(hex_pattern.findall(all_style_content))
            design_data["colors"] = list(colors)
            
            # Extract font families
            font_pattern = re.compile(r'font-family\s*:\s*([^;]+)')
            fonts = set(font_pattern.findall(all_style_content))
            design_data["fonts"] = [f.strip().replace('"', '').replace("'", "") for f in fonts]
            
            results_data.append({
                "url": result.url,
                "competitor_name": domain,
                "seo": seo_data,
                "design": design_data
            })

    output_file = "evaluation_results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results_data, f, indent=4)
        
    print(f"\n✅ Phase 2 complete. Competitive Intelligence data saved to {output_file}")

if __name__ == "__main__":
    asyncio.run(evaluate_pages())
