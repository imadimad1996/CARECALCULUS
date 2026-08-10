import asyncio
import json
import os
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.content_filter_strategy import BM25ContentFilter
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

async def crawl_mdcalc():
    print("Crawling MDCalc...")
    browser_config = BrowserConfig(headless=True, viewport_width=1920, viewport_height=1080)
    
    bm25_filter = BM25ContentFilter(user_query="calculator clinical tool score formula", bm25_threshold=1.0)
    md_generator = DefaultMarkdownGenerator(content_filter=bm25_filter)
    
    crawler_config = CrawlerRunConfig(
        page_timeout=30000,
        markdown_generator=md_generator
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url="https://www.mdcalc.com/all", config=crawler_config)
        with open("mdcalc_audit.md", "w", encoding="utf-8") as f:
            f.write(result.markdown)
            
        print(f"MDCalc Crawl Success: {result.success}, Markdown length: {len(result.markdown)}")

async def crawl_clincalc():
    print("Crawling ClinCalc...")
    browser_config = BrowserConfig(headless=True, viewport_width=1920, viewport_height=1080)
    
    bm25_filter = BM25ContentFilter(user_query="calculator clinical tool score formula", bm25_threshold=1.0)
    md_generator = DefaultMarkdownGenerator(content_filter=bm25_filter)
    
    crawler_config = CrawlerRunConfig(
        page_timeout=30000,
        markdown_generator=md_generator
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url="https://clincalc.com/", config=crawler_config)
        with open("clincalc_audit.md", "w", encoding="utf-8") as f:
            f.write(result.markdown)
            
        print(f"ClinCalc Crawl Success: {result.success}, Markdown length: {len(result.markdown)}")

async def crawl_nurseslabs():
    print("Crawling NursesLabs...")
    browser_config = BrowserConfig(headless=True, viewport_width=1920, viewport_height=1080)
    
    bm25_filter = BM25ContentFilter(user_query="calculator nursing tool IV drip rate formula", bm25_threshold=1.0)
    md_generator = DefaultMarkdownGenerator(content_filter=bm25_filter)
    
    crawler_config = CrawlerRunConfig(
        page_timeout=30000,
        markdown_generator=md_generator
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url="https://nurseslabs.com/medical-calculators-for-nurses/", config=crawler_config)
        with open("nurseslabs_audit.md", "w", encoding="utf-8") as f:
            f.write(result.markdown)
            
        print(f"NursesLabs Crawl Success: {result.success}, Markdown length: {len(result.markdown)}")

async def main():
    await crawl_mdcalc()
    await crawl_clincalc()
    await crawl_nurseslabs()

if __name__ == "__main__":
    asyncio.run(main())
