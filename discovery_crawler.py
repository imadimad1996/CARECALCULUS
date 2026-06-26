import asyncio
import json
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from urllib.parse import urlparse

# Target competitor URLs
COMPETITORS = [
    "https://www.mdcalc.com/",
    "https://qxmd.com/calculate",
    "https://clincalc.com/",
    "https://reference.medscape.com/calculators",
    "https://www.uptodate.com/contents/table-of-contents/calculators",
    "https://www.epocrates.com/",
    "https://clinicomp.com/"
]

async def discover_links():
    print("Starting Deep Crawling & Sub-Link Discovery Phase...")
    
    browser_config = BrowserConfig(
        headless=False, # Visible browsing to bypass bot detection
        viewport_width=1920,
        viewport_height=1080,
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    
    crawler_config = CrawlerRunConfig(
        page_timeout=60000,
        screenshot=False,
        magic=True, # Ultimate anti-bot stealth mode
        js_code="await new Promise(r => setTimeout(r, 5000));", # Delay to let JS/Bot challenges resolve
        remove_overlay_elements=True
    )
    
    all_discovered_links = {}
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        for root_url in COMPETITORS:
            print(f"\nCrawling root domain: {root_url}")
            domain = urlparse(root_url).netloc
            all_discovered_links[domain] = []
            
            try:
                result = await crawler.arun(url=root_url, config=crawler_config)
                
                if result.success:
                    # Extract internal links from the result
                    internal_links = result.links.get("internal", [])
                    print(f"✅ Discovered {len(internal_links)} internal links for {domain}")
                    
                    for link in internal_links:
                        # crawl4ai link object usually has a 'href' key
                        link_url = link.get('href', '') if isinstance(link, dict) else str(link)
                        if link_url and link_url not in all_discovered_links[domain]:
                            all_discovered_links[domain].append(link_url)
                else:
                    print(f"❌ Failed to crawl {root_url}: {result.error_message}")
                    
            except Exception as e:
                print(f"⚠️ Error crawling {root_url}: {e}")
                
            # Sleep between requests to avoid rate limits
            await asyncio.sleep(5)
            
    # Save the aggregated links to a JSON file
    output_file = "urls_to_crawl.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_discovered_links, f, indent=4)
        
    print(f"\n✅ Discovery phase complete. Sub-links saved to {output_file}")

if __name__ == "__main__":
    asyncio.run(discover_links())
