import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
import base64

async def main():
    print("Starting crawler for Wells DVT...")
    browser_config = BrowserConfig(
        headless=True,
        viewport_width=1920,
        viewport_height=1080,
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    
    crawler_config = CrawlerRunConfig(
        page_timeout=90000,
        magic=True, # Ultimate anti-bot stealth mode
        js_code="await new Promise(r => setTimeout(r, 5000));",
        remove_overlay_elements=True
    )
    
    url = "https://www.mdcalc.com/calc/362/wells-criteria-dvt"
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        print(f"Crawling {url}...")
        result = await crawler.arun(url=url, config=crawler_config)
        
        if result.success:
            print(f"Successfully crawled {url}! Markdown length: {len(result.markdown)}")
            with open("scratch/wells_dvt_crawl.md", "w", encoding="utf-8") as f:
                f.write(result.markdown)
            print("Saved markdown to scratch/wells_dvt_crawl.md")
        else:
            print(f"Failed to crawl {url}: {result.error_message}")

if __name__ == "__main__":
    asyncio.run(main())
