import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

async def crawl_mdcalc():
    browser_config = BrowserConfig(headless=True)
    crawler_config = CrawlerRunConfig(
        page_timeout=30000,
        wait_for="css:body"
    )

    urls = [
        "https://www.mdcalc.com/calc/43/creatinine-clearance-cockcroft-gault-equation"
    ]

    async with AsyncWebCrawler(config=browser_config) as crawler:
        results = await crawler.arun_many(
            urls=urls,
            config=crawler_config,
            max_concurrent=1
        )

        for i, result in enumerate(results):
            if result.success:
                filename = f"C:\\Users\\DeLL\\.gemini\\antigravity-ide\\brain\\ea640848-dff4-462c-b0ad-69c3d3055ec4\\scratch\\mdcalc_crawl_calc.md"
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(result.markdown)
                print(f"Successfully crawled {result.url} - saved to {filename}")
            else:
                print(f"Failed to crawl {urls[i]}")

if __name__ == "__main__":
    asyncio.run(crawl_mdcalc())
