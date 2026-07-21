#!/usr/bin/env python3
import os
import sys
import json
import csv
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple

try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
        OrderBy,
    )
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Error: Required package not installed: {e}", file=sys.stderr)
    print("Install with: pip install google-analytics-data python-dotenv", file=sys.stderr)
    sys.exit(1)


class GADataExporter:
    def __init__(self, property_id: str, credentials_path: str, output_dir: str):
        self.property_id = property_id
        self.credentials_path = credentials_path
        self.output_dir = output_dir
        
        # Configure credentials environment variable for GA client
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = self.credentials_path
        
        try:
            self.client = BetaAnalyticsDataClient()
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Google Analytics client: {e}")

        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)

    def find_earliest_traffic_date(self) -> str:
        """Finds the first date with non-zero sessions starting from 2020-01-01."""
        print("Finding earliest recorded traffic date...")
        request = RunReportRequest(
            property=f"properties/{self.property_id}",
            date_ranges=[DateRange(start_date="2020-01-01", end_date="yesterday")],
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="sessions")],
            order_bys=[OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name="date"), desc=False)],
            limit=5000
        )
        
        try:
            response = self.client.run_report(request)
            for row in response.rows:
                sessions = int(row.metric_values[0].value)
                if sessions > 0:
                    raw_date = row.dimension_values[0].value
                    parsed_date = datetime.strptime(raw_date, "%Y%m%d").strftime("%Y-%m-%d")
                    print(f"Found earliest traffic on: {parsed_date} ({sessions} sessions)")
                    return parsed_date
        except Exception as e:
            print(f"Warning: Failed to auto-detect earliest traffic date ({e}). Defaulting to 2026-07-07.", file=sys.stderr)
        
        return "2026-07-07"

    def run_paginated_report(
        self,
        start_date: str,
        end_date: str,
        dimensions: List[str],
        metrics: List[str],
        sort_by: str = None
    ) -> Tuple[List[str], List[str], List[Dict[str, Any]]]:
        """Runs a report query, handling pagination if there are many rows."""
        all_rows = []
        limit = 1000
        offset = 0
        
        dims = [Dimension(name=d) for d in dimensions]
        mets = [Metric(name=m) for m in metrics]
        
        order_bys = []
        if sort_by:
            desc = True
            if sort_by.startswith("+"):
                desc = False
                sort_by = sort_by[1:]
            elif sort_by.startswith("-"):
                sort_by = sort_by[1:]
                
            if sort_by in metrics:
                order_bys = [OrderBy(metric=OrderBy.MetricOrderBy(metric_name=sort_by), desc=desc)]
            elif sort_by in dimensions:
                order_bys = [OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name=sort_by), desc=desc)]

        metric_headers = []
        dimension_headers = []

        while True:
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
                dimensions=dims,
                metrics=mets,
                limit=limit,
                offset=offset,
                order_bys=order_bys
            )
            
            response = self.client.run_report(request)
            
            if not metric_headers:
                metric_headers = [m.name for m in response.metric_headers]
                dimension_headers = [d.name for d in response.dimension_headers]
                
            if not response.rows:
                break
                
            for row in response.rows:
                row_data = {
                    "dimensions": {dimension_headers[i]: val.value for i, val in enumerate(row.dimension_values)},
                    "metrics": {metric_headers[i]: float(val.value) if "." in val.value or metric_headers[i] in ["bounceRate", "averageSessionDuration", "engagementRate"] else int(val.value) for i, val in enumerate(row.metric_values)}
                }
                all_rows.append(row_data)
                
            if len(response.rows) < limit:
                break
                
            offset += limit
            print(f"  Fetched {len(all_rows)} rows so far...")
            
        return dimension_headers, metric_headers, all_rows

    def export_report(
        self,
        name: str,
        start_date: str,
        end_date: str,
        dimensions: List[str],
        metrics: List[str],
        sort_by: str = None
    ) -> List[Dict[str, Any]]:
        """Fetch report and write to JSON and CSV formats."""
        print(f"\nFetching report: {name} ({start_date} to {end_date})...")
        dim_headers, met_headers, rows = self.run_paginated_report(
            start_date=start_date,
            end_date=end_date,
            dimensions=dimensions,
            metrics=metrics,
            sort_by=sort_by
        )
        
        # Save JSON
        json_path = os.path.join(self.output_dir, f"{name}.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump({
                "report_name": name,
                "start_date": start_date,
                "end_date": end_date,
                "dimension_headers": dim_headers,
                "metric_headers": met_headers,
                "row_count": len(rows),
                "data": rows
            }, f, indent=2)
            
        # Save CSV
        csv_path = os.path.join(self.output_dir, f"{name}.csv")
        with open(csv_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(dim_headers + met_headers)
            for r in rows:
                row_values = [r["dimensions"][d] for d in dim_headers] + [r["metrics"][m] for m in met_headers]
                writer.writerow(row_values)
                
        print(f"Saved {len(rows)} rows to {json_path} and {csv_path}")
        return rows


def generate_summary_markdown(output_dir: str, start_date: str, end_date: str, summaries: Dict[str, Any]):
    summary_path = os.path.join(output_dir, "summary.md")
    
    daily_rows = summaries.get("daily", [])
    channel_rows = summaries.get("channels", [])
    source_medium_rows = summaries.get("source_medium", [])
    device_rows = summaries.get("devices", [])
    country_rows = summaries.get("countries", [])
    city_rows = summaries.get("cities", [])
    page_rows = summaries.get("pages", [])
    landing_rows = summaries.get("landing_pages", [])
    event_rows = summaries.get("events", [])
    browser_rows = summaries.get("browsers", [])
    lang_rows = summaries.get("languages", [])
    user_type_rows = summaries.get("user_types", [])
    
    # Calculate overall aggregates
    total_sessions = sum(r["metrics"]["sessions"] for r in daily_rows)
    total_pageviews = sum(r["metrics"]["screenPageViews"] for r in daily_rows)
    total_events = sum(r["metrics"]["eventCount"] for r in daily_rows)
    
    # Average bounce rate and session duration weighted by sessions
    weighted_bounce_sum = sum(r["metrics"]["bounceRate"] * r["metrics"]["sessions"] for r in daily_rows)
    weighted_duration_sum = sum(r["metrics"]["averageSessionDuration"] * r["metrics"]["sessions"] for r in daily_rows)
    
    overall_bounce_rate = (weighted_bounce_sum / total_sessions) if total_sessions > 0 else 0
    overall_duration = (weighted_duration_sum / total_sessions) if total_sessions > 0 else 0
    
    content = f"""# Google Analytics Data Export Summary (CareCalculus)

**GA4 Property ID:** `544473056`
**Export Date Range:** `{start_date}` to `{end_date}`
**Total Days:** {len(daily_rows)} days

## Overall Performance Metrics
* **Total Sessions:** {total_sessions:,}
* **Total Page Views:** {total_pageviews:,}
* **Total Tracked Events:** {total_events:,}
* **Average Bounce Rate:** {overall_bounce_rate:.2f}%
* **Average Session Duration:** {overall_duration:.1f} seconds ({overall_duration/60:.2f} mins)

---

## 1. Custom Events Tracked
| Event Name | Event Count | Active Users |
| :--- | :--- | :--- |
"""
    for r in sorted(event_rows, key=lambda x: x["metrics"]["eventCount"], reverse=True):
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| `{dims.get('eventName', 'Unknown')}` | {mets.get('eventCount', 0):,} | {mets.get('activeUsers', 0):,} |\n"

    content += """
---

## 2. Traffic Source & Medium
| Source / Medium | Sessions | Active Users | Page Views | Bounce Rate |
| :--- | :--- | :--- | :--- | :--- |
"""
    for r in sorted(source_medium_rows, key=lambda x: x["metrics"]["sessions"], reverse=True):
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| {dims.get('sessionSourceMedium', 'Unknown')} | {mets.get('sessions', 0):,} | {mets.get('activeUsers', 0):,} | {mets.get('screenPageViews', 0):,} | {mets.get('bounceRate', 0):.2f}% |\n"

    content += """
---

## 3. All Pages (Ranked by Views)
| Page Path | Sessions | Active Users | Page Views | Avg Duration (s) |
| :--- | :--- | :--- | :--- | :--- |
"""
    for r in sorted(page_rows, key=lambda x: x["metrics"]["screenPageViews"], reverse=True):
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| `{dims.get('pagePath', 'Unknown')}` | {mets.get('sessions', 0):,} | {mets.get('activeUsers', 0):,} | {mets.get('screenPageViews', 0):,} | {mets.get('averageSessionDuration', 0):.1f} |\n"

    content += """
---

## 4. Landing Pages (Entry Points)
| Landing Page | Sessions | Active Users | Page Views | Bounce Rate |
| :--- | :--- | :--- | :--- | :--- |
"""
    for r in sorted(landing_rows, key=lambda x: x["metrics"]["sessions"], reverse=True):
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| `{dims.get('landingPagePlusQueryString', 'Unknown')}` | {mets.get('sessions', 0):,} | {mets.get('activeUsers', 0):,} | {mets.get('screenPageViews', 0):,} | {mets.get('bounceRate', 0):.2f}% |\n"

    content += """
---

## 5. User Type (New vs Returning)
| User Type | Sessions | Active Users |
| :--- | :--- | :--- |
"""
    for r in sorted(user_type_rows, key=lambda x: x["metrics"]["sessions"], reverse=True):
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| {dims.get('newVsReturning', 'Unknown')} | {mets.get('sessions', 0):,} | {mets.get('activeUsers', 0):,} |\n"

    content += """
---

## 6. Devices & Browsers
| Device / OS / Browser | Sessions | Active Users | Page Views |
| :--- | :--- | :--- | :--- |
"""
    for r in sorted(browser_rows, key=lambda x: x["metrics"]["sessions"], reverse=True):
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| {dims.get('operatingSystem', 'Unknown')} ({dims.get('browser', 'Unknown')}) | {mets.get('sessions', 0):,} | {mets.get('activeUsers', 0):,} | {mets.get('screenPageViews', 0):,} |\n"

    content += """
---

## 7. Languages
| Language | Sessions | Active Users |
| :--- | :--- | :--- |
"""
    for r in sorted(lang_rows, key=lambda x: x["metrics"]["sessions"], reverse=True):
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| {dims.get('language', 'Unknown')} | {mets.get('sessions', 0):,} | {mets.get('activeUsers', 0):,} |\n"

    content += """
---

## 8. Cities & Locations
| Country | City | Sessions | Active Users |
| :--- | :--- | :--- | :--- |
"""
    for r in sorted(city_rows, key=lambda x: x["metrics"]["sessions"], reverse=True)[:15]:
        dims = r["dimensions"]
        mets = r["metrics"]
        content += f"| {dims.get('country', 'Unknown')} | {dims.get('city', 'Unknown')} | {mets.get('sessions', 0):,} | {mets.get('activeUsers', 0):,} |\n"

    content += f"""
---

## Export Files
The full, raw data has been successfully fetched and saved to the following paths in your workspace:
* **Daily Time Series:** [daily_overview.csv](file:///{output_dir.replace('\\', '/')}/daily_overview.csv) / [daily_overview.json](file:///{output_dir.replace('\\', '/')}/daily_overview.json)
* **Events:** [events.csv](file:///{output_dir.replace('\\', '/')}/events.csv) / [events.json](file:///{output_dir.replace('\\', '/')}/events.json)
* **Source & Medium:** [source_medium.csv](file:///{output_dir.replace('\\', '/')}/source_medium.csv) / [source_medium.json](file:///{output_dir.replace('\\', '/')}/source_medium.json)
* **Pages Data (All):** [pages.csv](file:///{output_dir.replace('\\', '/')}/pages.csv) / [pages.json](file:///{output_dir.replace('\\', '/')}/pages.json)
* **Landing Pages:** [landing_pages.csv](file:///{output_dir.replace('\\', '/')}/landing_pages.csv) / [landing_pages.json](file:///{output_dir.replace('\\', '/')}/landing_pages.json)
* **Devices & Browsers:** [browsers.csv](file:///{output_dir.replace('\\', '/')}/browsers.csv) / [browsers.json](file:///{output_dir.replace('\\', '/')}/browsers.json)
* **Countries & Cities:** [cities.csv](file:///{output_dir.replace('\\', '/')}/cities.csv) / [cities.json](file:///{output_dir.replace('\\', '/')}/cities.json)
* **User Types:** [user_types.csv](file:///{output_dir.replace('\\', '/')}/user_types.csv) / [user_types.json](file:///{output_dir.replace('\\', '/')}/user_types.json)
* **Languages:** [languages.csv](file:///{output_dir.replace('\\', '/')}/languages.csv) / [languages.json](file:///{output_dir.replace('\\', '/')}/languages.json)
"""
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\nGenerated summary markdown at: {summary_path}")


def main():
    property_id = "544473056"
    credentials_path = "c:\\Users\\DeLL\\CivicFlare\\service-account-key.json"
    output_dir = "c:\\Users\\DeLL\\CARECALCULUS\\scratch\\ga_export"

    print("Starting Comprehensive Google Analytics Exporter for CareCalculus...")
    try:
        exporter = GADataExporter(property_id, credentials_path, output_dir)
        
        start_date = exporter.find_earliest_traffic_date()
        end_date = "yesterday"
        
        metrics = ["sessions", "activeUsers", "screenPageViews", "bounceRate", "averageSessionDuration", "eventCount", "conversions"]
        
        # 1. Daily overview (ordered by date ascending)
        daily_rows = exporter.export_report(
            name="daily_overview",
            start_date=start_date,
            end_date=end_date,
            dimensions=["date"],
            metrics=metrics,
            sort_by="+date"
        )
        
        # 2. Channels
        channel_rows = exporter.export_report(
            name="channels",
            start_date=start_date,
            end_date=end_date,
            dimensions=["sessionDefaultChannelGroup"],
            metrics=["sessions", "activeUsers", "screenPageViews", "bounceRate", "conversions"],
            sort_by="-sessions"
        )

        # 3. Source / Medium
        source_medium_rows = exporter.export_report(
            name="source_medium",
            start_date=start_date,
            end_date=end_date,
            dimensions=["sessionSourceMedium"],
            metrics=["sessions", "activeUsers", "screenPageViews", "bounceRate", "conversions"],
            sort_by="-sessions"
        )
        
        # 4. Pages (All)
        page_rows = exporter.export_report(
            name="pages",
            start_date=start_date,
            end_date=end_date,
            dimensions=["pagePath"],
            metrics=["sessions", "activeUsers", "screenPageViews", "averageSessionDuration"],
            sort_by="-screenPageViews"
        )

        # 5. Landing Pages
        landing_rows = exporter.export_report(
            name="landing_pages",
            start_date=start_date,
            end_date=end_date,
            dimensions=["landingPagePlusQueryString"],
            metrics=["sessions", "activeUsers", "screenPageViews", "bounceRate", "averageSessionDuration"],
            sort_by="-sessions"
        )
        
        # 6. Events
        event_rows = exporter.export_report(
            name="events",
            start_date=start_date,
            end_date=end_date,
            dimensions=["eventName"],
            metrics=["eventCount", "activeUsers"],
            sort_by="-eventCount"
        )

        # 7. Devices & Categories
        device_rows = exporter.export_report(
            name="devices",
            start_date=start_date,
            end_date=end_date,
            dimensions=["deviceCategory"],
            metrics=["sessions", "activeUsers", "screenPageViews"],
            sort_by="-sessions"
        )

        # 8. OS and Browsers
        browser_rows = exporter.export_report(
            name="browsers",
            start_date=start_date,
            end_date=end_date,
            dimensions=["operatingSystem", "browser"],
            metrics=["sessions", "activeUsers", "screenPageViews"],
            sort_by="-sessions"
        )
        
        # 9. Countries
        country_rows = exporter.export_report(
            name="countries",
            start_date=start_date,
            end_date=end_date,
            dimensions=["country"],
            metrics=["sessions", "activeUsers", "screenPageViews"],
            sort_by="-sessions"
        )

        # 10. Cities
        city_rows = exporter.export_report(
            name="cities",
            start_date=start_date,
            end_date=end_date,
            dimensions=["country", "city"],
            metrics=["sessions", "activeUsers"],
            sort_by="-sessions"
        )

        # 11. Languages
        lang_rows = exporter.export_report(
            name="languages",
            start_date=start_date,
            end_date=end_date,
            dimensions=["language"],
            metrics=["sessions", "activeUsers"],
            sort_by="-sessions"
        )

        # 12. User Types
        user_type_rows = exporter.export_report(
            name="user_types",
            start_date=start_date,
            end_date=end_date,
            dimensions=["newVsReturning"],
            metrics=["sessions", "activeUsers"],
            sort_by="-sessions"
        )
        
        # Generate summary MD
        summaries = {
            "daily": daily_rows,
            "channels": channel_rows,
            "source_medium": source_medium_rows,
            "pages": page_rows,
            "landing_pages": landing_rows,
            "events": event_rows,
            "devices": device_rows,
            "browsers": browser_rows,
            "countries": country_rows,
            "cities": city_rows,
            "languages": lang_rows,
            "user_types": user_type_rows
        }
        generate_summary_markdown(output_dir, start_date, (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"), summaries)
        print("\nExhaustive Google Analytics data successfully fetched and exported!")
        
    except Exception as e:
        print(f"Error running data export: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
