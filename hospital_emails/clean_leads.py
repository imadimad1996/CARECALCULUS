"""
CareCalculus Hospital Lead Cleaner & Sanitizer
===============================================
Cleans, normalizes, deduplicates, and scores hospital leads.
"""

import csv
import re
from pathlib import Path

HERE = Path(__file__).parent
CSV_FILE = HERE / "hospital_leads.csv"
CLEAN_CSV = HERE / "hospital_leads.csv"

def clean_email(email: str) -> str:
    if not email:
        return ""
    e = email.strip().lower()
    # Strip HTML / unicode artifacts
    e = re.sub(r'^(?:u003e|\\u003e|//|<|>|mailto:)+', '', e, flags=re.IGNORECASE)
    e = e.strip(".,;:()\"'<> \t\n\r")
    e = e.split("?")[0].split("&")[0]
    if "u003e" in e or e.startswith("//") or "@" not in e:
        return ""
    if any(b in e for b in ["example.com", "example@", "@xyz.com", "abc@xyz.com", "@email.com"]):
        return ""
    return e

def run_clean():
    if not CSV_FILE.exists():
        print("No leads file found.")
        return

    rows = []
    seen = set()
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for r in reader:
            cleaned_addr = clean_email(r.get("email", ""))
            if cleaned_addr and cleaned_addr not in seen:
                seen.add(cleaned_addr)
                r["email"] = cleaned_addr
                rows.append(r)

    rows.sort(key=lambda x: -int(x.get("score", 0)))

    with open(CLEAN_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.rows = rows
        writer.writerows(rows)

    print(f"Cleaned leads list: {len(rows)} valid, unique hospital emails.")

if __name__ == "__main__":
    run_clean()
