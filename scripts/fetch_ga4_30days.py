#!/usr/bin/env python3
"""
Comprehensive Google Analytics 4 (GA4) 30-Day Data Extractor
Fetches full metrics, daily trends, sources, pages, geography, devices, and events.
"""
import os
import sys
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List

try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
        OrderBy
    )
    from google.oauth2 import service_account
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)

# Force override with .env.local
load_dotenv(".env.local", override=True)
load_dotenv(".env", override=False)

PROPERTY_ID = os.environ.get("GOOGLE_ANALYTICS_PROPERTY_ID", "544473056")
CREDENTIALS_PATH = r"c:\Users\DeLL\CivicFlare\service-account-key.json"

if not os.path.exists(CREDENTIALS_PATH):
    alt_paths = [
        "service-account-key.json",
        r"c:\Users\DeLL\service-account-key.json",
        r"c:\Users\DeLL\CivicFlare\service-account-key.json"
    ]
    for p in alt_paths:
        if os.path.exists(p):
            CREDENTIALS_PATH = p
            break

print(f"Connecting to GA4 Property: {PROPERTY_ID}")
print(f"Using Credentials File: {CREDENTIALS_PATH}")

credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
client = BetaAnalyticsDataClient(credentials=credentials)
prop_resource = f"properties/{PROPERTY_ID}"

def run_query(dimensions: List[str], metrics: List[str], start_date: str = "30daysAgo", end_date: str = "yesterday", limit: int = 100, order_by_metric: str = None, desc: bool = True) -> List[Dict[str, Any]]:
    order_bys = []
    if order_by_metric:
        order_bys = [OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_by_metric), desc=desc)]
    
    req = RunReportRequest(
        property=prop_resource,
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=m) for m in metrics],
        order_bys=order_bys if order_bys else None,
        limit=limit
    )
    
    try:
        resp = client.run_report(req)
        results = []
        for row in resp.rows:
            item = {}
            for i, d in enumerate(dimensions):
                item[d] = row.dimension_values[i].value
            for i, m in enumerate(metrics):
                val_str = row.metric_values[i].value
                try:
                    if "." in val_str:
                        item[m] = round(float(val_str), 4)
                    else:
                        item[m] = int(val_str)
                except ValueError:
                    item[m] = val_str
            results.append(item)
        return results
    except Exception as e:
        print(f"Error querying dimensions={dimensions}, metrics={metrics}: {e}", file=sys.stderr)
        return []

def main():
    report_data = {
        "metadata": {
            "property_id": PROPERTY_ID,
            "generated_at": datetime.now().isoformat(),
            "date_range": "Last 30 Days (30daysAgo to yesterday)",
            "comparison_range": "Previous 30 Days (60daysAgo to 31daysAgo)"
        }
    }

    # 1. Overall Summary (Last 30 Days vs Previous 30 Days)
    overview_metrics = [
        "sessions", "totalUsers", "activeUsers", "newUsers",
        "screenPageViews", "engagementRate", "bounceRate",
        "averageSessionDuration", "eventCount"
    ]
    print("1. Fetching overview for last 30 days...")
    curr_overview = run_query([], overview_metrics, start_date="30daysAgo", end_date="yesterday")
    print("   Fetching overview for previous 30 days...")
    prev_overview = run_query([], overview_metrics, start_date="60daysAgo", end_date="31daysAgo")
    
    c_data = curr_overview[0] if curr_overview else {}
    p_data = prev_overview[0] if prev_overview else {}

    overview_comparison = {}
    for m in overview_metrics:
        curr_val = c_data.get(m, 0)
        prev_val = p_data.get(m, 0)
        change = round(curr_val - prev_val, 4)
        pct_change = round(((curr_val - prev_val) / prev_val * 100), 2) if prev_val != 0 else (100.0 if curr_val > 0 else 0.0)
        overview_comparison[m] = {
            "current_30d": curr_val,
            "previous_30d": prev_val,
            "absolute_change": change,
            "percentage_change": pct_change
        }

    report_data["overview"] = overview_comparison

    # 2. Daily Trends
    print("2. Fetching daily trends (last 30 days)...")
    daily = run_query(["date", "dayOfWeekName"], ["sessions", "activeUsers", "screenPageViews", "engagementRate", "averageSessionDuration"], 
                      start_date="30daysAgo", end_date="yesterday", limit=35)
    daily = sorted(daily, key=lambda x: x.get("date", ""))
    report_data["daily_trends"] = daily

    # 3. Traffic Acquisition Channels
    print("3. Fetching channel groupings...")
    channels = run_query(["sessionDefaultChannelGrouping"], ["sessions", "activeUsers", "newUsers", "engagementRate", "averageSessionDuration"],
                         start_date="30daysAgo", end_date="yesterday", limit=50, order_by_metric="sessions")
    report_data["channels"] = channels

    print("   Fetching source / medium...")
    source_medium = run_query(["sessionSourceMedium"], ["sessions", "activeUsers", "engagementRate", "bounceRate", "averageSessionDuration"],
                              start_date="30daysAgo", end_date="yesterday", limit=50, order_by_metric="sessions")
    report_data["source_medium"] = source_medium

    # 4. Content & Top Pages
    print("4. Fetching top pages...")
    top_pages = run_query(["pagePath", "pageTitle"], ["screenPageViews", "activeUsers", "averageSessionDuration", "bounceRate"],
                          start_date="30daysAgo", end_date="yesterday", limit=50, order_by_metric="screenPageViews")
    report_data["top_pages"] = top_pages

    print("   Fetching landing pages...")
    landing_pages = run_query(["landingPagePlusQueryString"], ["sessions", "activeUsers", "newUsers", "bounceRate", "averageSessionDuration"],
                              start_date="30daysAgo", end_date="yesterday", limit=50, order_by_metric="sessions")
    report_data["landing_pages"] = landing_pages

    # 5. Geographic Demographics
    print("5. Fetching geographic distribution...")
    countries = run_query(["country"], ["sessions", "activeUsers", "screenPageViews", "engagementRate"],
                          start_date="30daysAgo", end_date="yesterday", limit=30, order_by_metric="sessions")
    report_data["countries"] = countries

    cities = run_query(["city", "country"], ["sessions", "activeUsers", "screenPageViews"],
                       start_date="30daysAgo", end_date="yesterday", limit=30, order_by_metric="sessions")
    report_data["cities"] = cities

    # 6. Device, OS, Browser
    print("6. Fetching device & tech specs...")
    devices = run_query(["deviceCategory"], ["sessions", "activeUsers", "engagementRate", "averageSessionDuration"],
                        start_date="30daysAgo", end_date="yesterday", limit=10, order_by_metric="sessions")
    report_data["devices"] = devices

    browsers = run_query(["browser"], ["sessions", "activeUsers", "engagementRate"],
                         start_date="30daysAgo", end_date="yesterday", limit=15, order_by_metric="sessions")
    report_data["browsers"] = browsers

    operating_systems = run_query(["operatingSystem"], ["sessions", "activeUsers", "engagementRate"],
                                  start_date="30daysAgo", end_date="yesterday", limit=15, order_by_metric="sessions")
    report_data["operating_systems"] = operating_systems

    # 7. User Retention / New vs Returning
    print("7. Fetching new vs returning users...")
    user_types = run_query(["newVsReturning"], ["sessions", "activeUsers", "averageSessionDuration", "engagementRate"],
                           start_date="30daysAgo", end_date="yesterday", limit=10, order_by_metric="sessions")
    report_data["user_types"] = user_types

    # 8. User Events & Key Interactions
    print("8. Fetching events...")
    events = run_query(["eventName"], ["eventCount", "totalUsers"],
                       start_date="30daysAgo", end_date="yesterday", limit=50, order_by_metric="eventCount")
    report_data["events"] = events

    # Save to JSON
    os.makedirs("reports", exist_ok=True)
    out_file = "reports/analytics_last_30_days.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)
    print(f"\n[DONE] All analytics data successfully retrieved and written to {out_file}")

if __name__ == "__main__":
    main()
