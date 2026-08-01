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
FROM_EMAIL     = os.getenv("FROM_EMAIL", "hello@demomailtrap.co")
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
SUBJECT = "Free Clinical Calculator Suite for {hospital} — No IT Setup Required"

BODY_HTML = """\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
         line-height: 1.7; color: #1a1a1a; max-width: 620px; margin: auto; padding: 20px; }}
  .logo {{ font-weight: 900; font-size: 22px; color: #0ea5e9; letter-spacing: -0.5px; }}
  .highlight {{ background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px 18px;
                border-radius: 0 8px 8px 0; margin: 18px 0; }}
  .cta {{ display: inline-block; background: #0ea5e9; color: white; padding: 12px 28px;
          border-radius: 8px; text-decoration: none; font-weight: 700; margin: 8px 0; }}
  .calc-list {{ columns: 2; list-style: none; padding: 0; margin: 10px 0; }}
  .calc-list li::before {{ content: "✓ "; color: #0ea5e9; font-weight: 700; }}
  .footer {{ margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;
             font-size: 12px; color: #6b7280; }}
</style>
</head>
<body>
<p class="logo">CareCalculus</p>

<p>Hi,</p>

<p>I'm reaching out because <strong>{hospital}</strong> deserves the best bedside decision tools — and I wanted to share something your clinical team can start using <em>today, for free</em>.</p>

<div class="highlight">
  <strong>CareCalculus</strong> is a free, peer-reviewed clinical calculator platform built for busy clinicians —
  not hospital administrators. No EHR login, no IT tickets, no waiting.
</div>

<p><strong>What's included (100% free):</strong></p>
<ul class="calc-list">
  <li>qSOFA / SOFA / SIRS</li>
  <li>GCS &amp; Pediatric GCS</li>
  <li>Wells DVT &amp; PE Score</li>
  <li>CURB-65 Pneumonia</li>
  <li>MELD &amp; Child-Pugh</li>
  <li>Creatinine Clearance</li>
  <li>CHA₂DS₂-VASc</li>
  <li>NIH Stroke Scale</li>
  <li>APACHE II / SAPS II</li>
  <li>Vancomycin Dosing</li>
  <li>Drug Interactions</li>
  <li>88+ more calculators</li>
</ul>

<p>
  <a href="https://www.carecalculus.com" class="cta">Try CareCalculus Free →</a>
</p>

<p>
  For hospitals and health systems, we also offer a <strong>Pro Export Pass</strong> that lets your team
  generate SOAP notes, SBAR summaries, and EHR-ready DotPhrases in one click —
  <a href="https://www.carecalculus.com/pricing">learn more</a>.
</p>

<p>Would it be appropriate for me to connect with your CMO or Medical Informatics team for a brief 15-minute call?
I'd love to explore how CareCalculus can support <strong>{hospital}</strong>'s clinical workflows.</p>

<p>Best regards,<br>
<strong>CareCalculus Team</strong><br>
<a href="https://www.carecalculus.com">carecalculus.com</a></p>

<div class="footer">
  You received this email because {hospital} provides clinical care and we believe CareCalculus
  could support your team. To unsubscribe, simply reply "unsubscribe" and we will remove you immediately.
</div>
</body>
</html>
"""

BODY_TEXT = """\
Hi,

I'm reaching out because {hospital} deserves the best bedside decision tools.

CareCalculus is a free, peer-reviewed clinical calculator platform built for busy clinicians.
No EHR login. No IT tickets. Start in 30 seconds.

Free calculators include: qSOFA, SOFA, SIRS, GCS, Wells DVT/PE, CURB-65, MELD,
Child-Pugh, Creatinine Clearance, CHA2DS2-VASc, NIHSS, APACHE II, and 80+ more.

Try it free: https://www.carecalculus.com

For hospitals, we offer a Pro Export Pass with SOAP/SBAR/DotPhrase generation:
https://www.carecalculus.com/pricing

Would it be appropriate to connect with your CMO or Medical Informatics team for 15 minutes?

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
