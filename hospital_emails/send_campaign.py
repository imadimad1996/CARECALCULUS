"""
CareCalculus — Hospital Outreach Campaign
==========================================
Psychology-driven, human-written, beautifully designed email.

Usage:
    python send_campaign.py              # Dry run
    python send_campaign.py --send       # Send all
    python send_campaign.py --send --limit 10 --min-score 15
"""

import csv, time, argparse, logging
from pathlib import Path
from datetime import datetime
import mailtrap as mt

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / "scripts/hospital_email_crawler/.env")
except ImportError:
    pass
import os

MAILTRAP_TOKEN = os.getenv("SMTP_PASS", "d0ab5b75a4b40c2af0bd89f95f51f026")
FROM_NAME  = "Alex — CareCalculus"
FROM_EMAIL = "hello@carecalculus.com"
DELAY_SEC  = 3
MIN_SCORE  = 10

HERE     = Path(__file__).parent
CSV_FILE = HERE / "hospital_leads.csv"
SENT_LOG = HERE / "sent_log.csv"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(message)s",
    handlers=[
        logging.FileHandler(HERE / "campaign_log.txt", encoding="utf-8"),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger(__name__)

# ── Subject: personal, curiosity-driven, no spam words ──────────────
SUBJECT = "quick question for the clinical team at {hospital}"

# ── HTML: minimal, plain, personal — defeats Gmail Promotions filter ──
BODY_HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
             font-size:15px;line-height:1.7;color:#222;max-width:580px;margin:auto;padding:20px 16px;">

<p>Hi,</p>

<p>I hope this finds you well. I'm Alex, and I built a free clinical calculator platform called
<strong>CareCalculus</strong> that I think the team at <strong>{hospital}</strong> might find genuinely useful
at the bedside.</p>

<p>It's a collection of 88+ peer-reviewed calculators — things like qSOFA, Wells DVT, GCS, CURB-65,
APACHE II, Vancomycin dosing, and more — all in one place, no login required, works on any device.
No IT setup. No contract. Just open it and use it.</p>

<p>I built it because I kept seeing clinicians waste critical seconds hunting through PDFs and apps
that weren't designed for the pace of clinical work. This was my attempt to fix that.</p>

<p>→ <a href="https://www.carecalculus.com" style="color:#0369a1;">carecalculus.com</a>
&nbsp; (completely free, always)</p>

<p>If it's useful, feel free to share it with your ward team or whoever manages clinical tools.
That's genuinely all I'm asking.</p>

<p>For hospitals that want a bit more — there's an optional Pro tier that generates SOAP notes,
SBAR summaries, and EHR-ready DotPhrases from calculator results:
<a href="https://www.carecalculus.com/pricing" style="color:#0369a1;">see pricing</a>.
But the free version never goes away.</p>

<p>If you'd like a quick 10-minute call to see how it could fit {hospital}'s workflows,
I'm happy to set that up — just reply here.</p>

<p>Either way, I hope it's useful to your team.</p>

<p>Best,<br>
Alex<br>
Founder, CareCalculus<br>
<a href="https://www.carecalculus.com" style="color:#0369a1;">carecalculus.com</a></p>

<p style="margin-top:32px;font-size:12px;color:#888;">
You can reply <em>unsubscribe</em> at any time and I'll remove you immediately.
</p>

</body>
</html>
"""

# ── Plain text version ────────────────────────────────────────────────
BODY_TEXT = """\
Hi,

I hope this finds you well. I'm Alex, and I built a free clinical calculator platform
called CareCalculus that I think the team at {hospital} might find genuinely useful.

It's 88+ peer-reviewed calculators — qSOFA, Wells DVT, GCS, CURB-65, APACHE II,
Vancomycin dosing, and more — all in one place. No login, no IT setup, works on any device.

https://www.carecalculus.com  (completely free, always)

I built it because I kept seeing clinicians waste critical seconds during handovers
and assessments using tools that weren't designed for the pace of clinical work.

Feel free to share it with whoever manages clinical tools at {hospital}.

For hospitals that want more — there's an optional Pro tier (SOAP notes, SBAR summaries,
EHR DotPhrases): https://www.carecalculus.com/pricing

If you'd like a quick 10-minute call, just reply here.

Best,
Alex
Founder, CareCalculus
https://www.carecalculus.com

---
Reply "unsubscribe" to opt out.
"""




def load_leads(min_score):
    if not CSV_FILE.exists():
        log.error(f"No leads file: {CSV_FILE}")
        return []
    leads = []
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            email = row.get("email", "").lower()
            if "u003e" in email or email.startswith("//"):
                continue
            if int(row.get("score", 0)) >= min_score:
                leads.append(row)
    leads.sort(key=lambda x: -int(x.get("score", 0)))
    log.info(f"Loaded {len(leads)} clean leads (score >= {min_score})")
    return leads


def load_sent():
    sent = set()
    if SENT_LOG.exists():
        with open(SENT_LOG, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                sent.add(row.get("email", "").lower())
    return sent


def mark_sent(email, hospital, country, msg_id):
    is_new = not SENT_LOG.exists()
    with open(SENT_LOG, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if is_new:
            w.writerow(["email", "hospital", "country", "message_id", "sent_at"])
        w.writerow([email, hospital, country, msg_id, datetime.utcnow().isoformat()])


def send_one(to_email, hospital):
    client = mt.MailtrapClient(token=MAILTRAP_TOKEN)
    mail = mt.Mail(
        sender=mt.Address(email=FROM_EMAIL, name=FROM_NAME),
        to=[mt.Address(email=to_email)],
        subject=SUBJECT.format(hospital=hospital),
        text=BODY_TEXT.format(hospital=hospital),
        html=BODY_HTML.format(hospital=hospital),
    )
    resp = client.send(mail)
    if resp.get("success"):
        return resp["message_ids"][0]
    return None


def run(dry_run, limit, min_score):
    leads   = load_leads(min_score)
    already = load_sent()
    if not leads:
        log.error("No leads found.")
        return
    if limit:
        leads = leads[:limit]

    label = "[DRY RUN] " if dry_run else ""
    log.info(f"{label}Campaign — {len(leads)} leads targeted")
    log.info("=" * 65)

    ok = skip = fail = 0
    for lead in leads:
        email    = lead["email"].lower()
        hospital = lead["hospital"]
        country  = lead["country"]
        score    = int(lead.get("score", 0))

        if email in already:
            log.info(f"  ⏭  Already sent: {email}")
            skip += 1
            continue

        if dry_run:
            log.info(f"  📧 [{score:>3}] {email:48s} {hospital} ({country})")
            ok += 1
            continue

        try:
            msg_id = send_one(email, hospital)
            if msg_id:
                mark_sent(email, hospital, country, msg_id)
                ok += 1
                log.info(f"  ✅ [{score:>3}] → {email:45s} | {hospital}")
            else:
                fail += 1
                log.error(f"  ❌ Rejected: {email}")
            time.sleep(DELAY_SEC)
        except Exception as exc:
            fail += 1
            log.error(f"  ❌ Error ({email}): {exc}")

    log.info("=" * 65)
    log.info(f"{label}DONE — ✅ {ok} sent  ⏭ {skip} skipped  ❌ {fail} failed")
    if dry_run:
        log.info("  → Run with --send to actually deliver emails")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="CareCalculus Hospital Campaign")
    ap.add_argument("--send",      action="store_true")
    ap.add_argument("--limit",     type=int, default=0)
    ap.add_argument("--min-score", type=int, default=MIN_SCORE)
    args = ap.parse_args()
    run(dry_run=not args.send, limit=args.limit, min_score=args.min_score)
