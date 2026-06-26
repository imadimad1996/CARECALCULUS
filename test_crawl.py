import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
import base64

async def main():
    print("Starting crawler...")
    browser_config = BrowserConfig(
        headless=False, # Visible browsing often bypasses bot detection
        viewport_width=1920,
        viewport_height=1080,
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    
    crawler_config = CrawlerRunConfig(
        page_timeout=90000,
        screenshot=True,
        magic=True, # Ultimate anti-bot stealth mode
        # Wait a bit longer for JS challenges to clear
        js_code="await new Promise(r => setTimeout(r, 5000));",
        remove_overlay_elements=True
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        print("Crawling https://www.mdcalc.com/...")
        result = await crawler.arun(
            url="https://www.mdcalc.com/",
            config=crawler_config
        )
        
        if result.success:
            print(f"Successfully crawled! HTML length: {len(result.html)}")
            print(f"Markdown length: {len(result.markdown)}")
            
            with open("mdcalc_crawl_result.md", "w", encoding="utf-8") as f:
                f.write(result.markdown)
            print("Saved markdown to mdcalc_crawl_result.md")
            
            if result.screenshot:
                try:
                    # Depending on crawl4ai version, screenshot is typically a base64 string
                    image_data = base64.b64decode(result.screenshot)
                    with open("mdcalc_screenshot.png", "wb") as f:
                        f.write(image_data)
                    print("Saved screenshot to mdcalc_screenshot.png")
                except Exception as e:
                    print(f"Failed to save screenshot: {e}")
        else:
            print("Failed to crawl the website.")

if __name__ == "__main__":
    asyncio.run(main())
