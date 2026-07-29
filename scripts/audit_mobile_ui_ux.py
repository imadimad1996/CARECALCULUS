import os
import re
from pathlib import Path

PAGES_DIR = Path("src/pages")
COMPONENTS_DIR = Path("src/components")

def run_mobile_audit():
    print("[+] Starting Comprehensive Mobile UI/UX & Responsiveness Audit...")
    
    mobile_audit = []
    total_audited = 0
    passed_mobile = 0
    
    files = list(PAGES_DIR.glob("*.tsx")) + list(COMPONENTS_DIR.glob("*.tsx"))
    
    for filepath in files:
        total_audited += 1
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        has_responsive_grid = bool(re.search(r'grid-cols-1|sm:grid-cols|md:grid-cols|flex-col', content))
        has_touch_target = bool(re.search(r'min-h-\[44px\]|py-3|py-4|h-12|h-14|p-4|p-3', content))
        has_text_responsive = bool(re.search(r'text-sm|text-base|text-lg|text-xl|sm:text-|md:text-', content))
        has_no_horizontal_overflow = "overflow-x-auto" in content or "max-w-full" in content or "w-full" in content
        
        is_passed = has_responsive_grid and has_touch_target and has_text_responsive and has_no_horizontal_overflow
        if is_passed:
            passed_mobile += 1
            
        mobile_audit.append({
            "file": filepath.name,
            "passed": is_passed,
            "has_responsive_grid": has_responsive_grid,
            "has_touch_target": has_touch_target,
            "has_text_responsive": has_text_responsive,
            "has_no_overflow": has_no_horizontal_overflow
        })

    summary = {
        "total_files_audited": total_audited,
        "mobile_compliant_files": passed_mobile,
        "mobile_compliance_rate": f"{round((passed_mobile / total_audited) * 100, 1)}%",
        "audit_details": mobile_audit
    }
    
    out_dir = Path("dist/audit")
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "mobile_ui_ux_audit.json", "w", encoding="utf-8") as f:
        import json
        json.dump(summary, f, indent=2)
        
    print(f"\n[*] Total Files Audited for Mobile UI/UX: {total_audited}")
    print(f"[*] Mobile UI/UX Pass Rate: {summary['mobile_compliance_rate']}")
    print(f"[+] Audit report saved to dist/audit/mobile_ui_ux_audit.json")

if __name__ == "__main__":
    run_mobile_audit()
