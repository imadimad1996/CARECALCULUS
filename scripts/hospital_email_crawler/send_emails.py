"""
CareCalculus — Marketing Email Sender (Mailtrap SDK)
=====================================================
Reads hospital_leads.csv and sends personalized outreach emails
using the Mailtrap Python SDK.

Setup:
    pip install mailtrap python-dotenv
    python send_emails.py          # dry run preview
    python send_emails.py --send   # send for real
"""

import csv
import time
import argparse
import logging
from pathlib import Path
from datetime import datetime

import mailtrap as mt

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

import os

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG — load from environment / .env file
# ─────────────────────────────────────────────────────────────────────────────
MAILTRAP_TOKEN = os.getenv("SMTP_PASS", "")   # reuse SMTP_PASS field from .env
FROM_NAME      = os.getenv("FROM_NAME", "CareCalculus Team")
FROM_EMAIL     = os.getenv("FROM_EMAIL", "hello@carecalculus.com")
DELAY_SEC      = float(os.getenv("SEND_DELAY_SEC", "3"))
MIN_SCORE      = int(os.getenv("MIN_SCORE", "10"))

OUTPUT_DIR   = Path(__file__).parent.parent.parent / "hospital_emails"
SENT_LOG     = OUTPUT_DIR / "sent_log.csv"
CSV_FILE     = OUTPUT_DIR / "hospital_leads.csv"

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# EMAIL TEMPLATE
# ─────────────────────────────────────────────────────────────────────────────
SUBJECT = "clinical calculators / workflow"

BODY_HTML = """\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
         line-height: 1.7; color: #1a1a1a; max-width: 620px; margin: auto; padding: 20px; }}
  .footer {{ margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;
             font-size: 12px; color: #6b7280; }}
</style>
</head>
<body>
<p>Hi,</p>

<p>I noticed {hospital} is actively improving clinical workflows and wanted to share a resource your bedside teams can use right away.</p>

<p>We built <a href="https://www.carecalculus.com">CareCalculus</a>—a free, peer-reviewed clinical calculator platform for busy clinicians. Unlike heavy EHR integrations, it requires zero IT setup, no login, and covers 90+ calculators (qSOFA, Wells, CHA2DS2-VASc, etc.).</p>

<p>We also offer a Pro Export Pass that generates SOAP notes and DotPhrases directly into your EHR format, saving hours of documentation.</p>

<p>Worth exploring for the clinical team?</p>

<p>Best,<br>
CareCalculus Team</p>

<div class="footer">
  You received this email because {hospital} provides clinical care. To unsubscribe, simply reply "unsubscribe".
</div>
</body>
</html>
"""

BODY_TEXT = """\
Hi,

I noticed {hospital} is actively improving clinical workflows and wanted to share a resource your bedside teams can use right away.

We built CareCalculus—a free, peer-reviewed clinical calculator platform for busy clinicians. Unlike heavy EHR integrations, it requires zero IT setup, no login, and covers 90+ calculators (qSOFA, Wells, CHA2DS2-VASc, etc.).

We also offer a Pro Export Pass that generates SOAP notes and DotPhrases directly into your EHR format, saving hours of documentation.

Worth exploring for the clinical team?

Best,
CareCalculus Team
https://www.carecalculus.com

---
Reply "unsubscribe" to opt out permanently.
"""


# ─────────────────────────────────────────────────────────────────────────────
# SENDER
# ─────────────────────────────────────────────────────────────────────────────
def send_one(to_email: str, hospital: str) -> bool:
    """Send a single email via Mailtrap SDK. Returns True on success."""
    client = mt.MailtrapClient(token=MAILTRAP_TOKEN)
    mail = mt.Mail(
        sender=mt.Address(email=FROM_EMAIL, name=FROM_NAME),
        to=[mt.Address(email=to_email)],
        subject=SUBJECT.format(hospital=hospital),
        text=BODY_TEXT.format(hospital=hospital),
        html=BODY_HTML.format(hospital=hospital),
        category="Hospital Outreach",
    )
    resp = client.send(mail)
    return resp.get("success", False)


def load_leads(min_score: int) -> list[dict]:
    if not CSV_FILE.exists():
        log.error(f"No leads file found at {CSV_FILE}")
        return []
    leads = []
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if int(row.get("score", 0)) >= min_score:
                leads.append(row)
    leads.sort(key=lambda x: -int(x.get("score", 0)))
    log.info(f"Loaded {len(leads)} leads with score ≥ {min_score}")
    return leads


def load_sent() -> set[str]:
    sent = set()
    if SENT_LOG.exists():
        with open(SENT_LOG, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                sent.add(row.get("email", "").lower())
    return sent


def log_sent(email: str, hospital: str, country: str):
    is_new = not SENT_LOG.exists()
    with open(SENT_LOG, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if is_new:
            writer.writerow(["email", "hospital", "country", "sent_at"])
        writer.writerow([email, hospital, country, datetime.utcnow().isoformat()])


def send_emails(dry_run: bool = True, limit: int = 0):
    leads   = load_leads(MIN_SCORE)
    already = load_sent()

    if not leads:
        log.error("No leads to send to. Run crawler.py first.")
        return

    if limit:
        leads = leads[:limit]

    log.info(f"{'[DRY RUN] ' if dry_run else ''}Sending to {len(leads)} leads…")

    if not dry_run and not MAILTRAP_TOKEN:
        log.error("SMTP_PASS (Mailtrap token) must be set in .env")
        return

    sent_count = 0
    skip_count = 0

    for lead in leads:
        email    = lead["email"].lower()
        hospital = lead["hospital"]
        country  = lead["country"]
        score    = lead.get("score", 0)

        if email in already:
            log.info(f"  ⏭ Already sent: {email}")
            skip_count += 1
            continue

        if dry_run:
            log.info(f"  [DRY] Would send to: {email:45s} [{score}] {hospital} ({country})")
            sent_count += 1
            continue

        try:
            ok = send_one(email, hospital)
            if ok:
                log_sent(email, hospital, country)
                sent_count += 1
                log.info(f"  ✅ Sent [{score}] → {email} | {hospital}")
            else:
                log.error(f"  ❌ Mailtrap rejected: {email}")
            time.sleep(DELAY_SEC)
        except Exception as e:
            log.error(f"  ❌ Failed {email}: {e}")

    log.info(f"\n{'[DRY RUN] ' if dry_run else ''}Done: {sent_count} sent, {skip_count} skipped.")
    if dry_run:
        log.info("  ↑ Run with --send to actually deliver emails.")


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CareCalculus Hospital Email Sender")
    parser.add_argument("--send",      action="store_true",  help="Send real emails (default: dry run)")
    parser.add_argument("--limit",     type=int, default=0,  help="Max emails to send (0 = no limit)")
    parser.add_argument("--min-score", type=int, default=MIN_SCORE, help=f"Min lead score (default: {MIN_SCORE})")
    args = parser.parse_args()

    MIN_SCORE = args.min_score
    send_emails(dry_run=not args.send, limit=args.limit)
