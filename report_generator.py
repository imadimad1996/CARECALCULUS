import json
import os

def generate_report():
    print("Starting Phase 3: Competitive Intelligence Report Generation...")
    
    input_file = "evaluation_results.json"
    if not os.path.exists(input_file):
        print(f"⚠️ Could not find {input_file}. Please run evaluation_pipeline.py first.")
        return
        
    with open(input_file, "r", encoding="utf-8") as f:
        try:
            results = json.load(f)
        except json.JSONDecodeError:
            print(f"⚠️ Failed to parse {input_file}.")
            return
            
    report_lines = []
    report_lines.append("# Competitor Intelligence & Asset Report\n")
    report_lines.append("This massive report reveals the exact SEO keywords, content structures, and design systems used by top medical calculator competitors. Use this data to reverse-engineer and enhance CareCalculus.\n")
    
    competitor_data = {}
    for res in results:
        comp_name = res.get("competitor_name", "Unknown Competitor")
        if comp_name not in competitor_data:
            competitor_data[comp_name] = []
        competitor_data[comp_name].append(res)
        
    for comp_name, pages in competitor_data.items():
        report_lines.append(f"## 🏢 {comp_name}\n")
        
        for idx, page in enumerate(pages):
            url = page.get("url", "Unknown URL")
            report_lines.append(f"### Page {idx + 1}: [{url}]({url})\n")
            
            # --- SEO STEALING ---
            report_lines.append("#### 🕵️ SEO & Content Strategy")
            seo = page.get("seo", {})
            report_lines.append(f"- **Target Title:** `{seo.get('title', 'N/A')}`")
            report_lines.append(f"- **Meta Description:** `{seo.get('description', 'N/A')}`")
            report_lines.append(f"- **Target Keywords:** `{seo.get('keywords', 'None found')}`\n")
            
            report_lines.append("**Content Hierarchy (Headings):**")
            headings = seo.get("headings", {})
            for h1 in headings.get("h1", []):
                report_lines.append(f"- `# {h1}`")
            for h2 in headings.get("h2", []):
                report_lines.append(f"  - `## {h2}`")
            for h3 in headings.get("h3", []):
                report_lines.append(f"    - `### {h3}`")
            report_lines.append("")
                
            # --- DESIGN SYSTEM ---
            report_lines.append("#### 🎨 Design System Assets")
            design = page.get("design", {})
            colors = design.get("colors", [])
            report_lines.append("**Color Palette (Hex Codes):**")
            if colors:
                for c in colors[:10]: # Limit to top 10 colors to avoid clutter
                    report_lines.append(f"- `{c}`")
                if len(colors) > 10:
                    report_lines.append(f"- *(+ {len(colors) - 10} more colors)*")
            else:
                report_lines.append("- No inline hex colors detected.")
            report_lines.append("")
            
            fonts = design.get("fonts", [])
            report_lines.append("**Typography (Font Families):**")
            if fonts:
                for f in fonts[:5]:
                    report_lines.append(f"- `{f}`")
            else:
                report_lines.append("- No specific fonts detected.")
            
            report_lines.append("\n---\n")
            
    # Write the report
    output_file = "competitor_intelligence_report.md"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
        
    print(f"✅ Intelligence Report successfully generated at {output_file}")

if __name__ == "__main__":
    generate_report()
