import asyncio
import json
import os
from datetime import datetime
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.extraction_strategy import LLMExtractionStrategy

async def monitor_competitors():
    # Setup the crawler config
    browser_config = BrowserConfig(
        headless=True,
        viewport_width=1920,
        viewport_height=1080
    )
    
    # We will use an LLM extraction strategy to extract the clinical references and formula from MDCalc or ClinCalc
    # NOTE: You will need your OPENAI_API_KEY or another supported provider set in your environment
    extraction_strategy = LLMExtractionStrategy(
        provider="openai/gpt-4o-mini",
        instruction="Extract the clinical formula, interpretation thresholds, and a list of literature references from this medical calculator page."
    )
    
    crawler_config = CrawlerRunConfig(
        page_timeout=30000,
        extraction_strategy=extraction_strategy,
        remove_overlay_elements=True
    )
    
    competitor_urls = [
        "https://www.mdcalc.com/calc/100/glasgow-coma-scale-gcs",
        "https://clincalc.com/Cardiology/MAP.aspx"
    ]
    
    print(f"[{datetime.now().isoformat()}] Starting competitor monitoring crawl...")
    
    results_data = {}
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        for url in competitor_urls:
            print(f"Crawling: {url}")
            result = await crawler.arun(url=url, config=crawler_config)
            
            if result.success:
                try:
                    # Parse the extracted JSON
                    if result.extracted_content:
                        extracted = json.loads(result.extracted_content)
                        results_data[url] = extracted
                        print(f"✅ Successfully extracted data from {url}")
                    else:
                        print(f"⚠️ No extracted content for {url}")
                        results_data[url] = {"error": "No extracted content"}
                except Exception as e:
                    print(f"⚠️ Failed to parse extracted content for {url}: {e}")
                    results_data[url] = {"error": "Failed to parse content", "raw": result.extracted_content}
            else:
                print(f"❌ Failed to crawl {url}")
                results_data[url] = {"error": "Failed to crawl"}
                
    # Save the results to a file
    output_file = "competitor_monitoring_results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results_data, f, indent=2, ensure_ascii=False)
        
    print(f"\nMonitoring complete. Results saved to {output_file}")

if __name__ == "__main__":
    asyncio.run(monitor_competitors())
