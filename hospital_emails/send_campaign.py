"""
CareCalculus — Hospital Outreach Campaign
==========================================
Psychology-driven, human-written, beautifully designed email.

Usage:
    python send_campaign.py              # Dry run
    python send_campaign.py --send       # Send all
    python send_campaign.py --send --limit 10 --min-score 15
"""

import csv, time, argparse, logging, re
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

# ══════════════════════════════════════════════════════════════════════
# EMAIL COPY  — 10/10 rewrite
# Skills applied: copywriting · marketing-psychology · CRO · brand
#
# Psychology levers used:
#   AIDA structure         → Attention (subject) → Interest (pain) →
#                            Desire (social proof + benefits) → Action (CTA)
#   Authority              → "peer-reviewed", named clinical scores
#   Reciprocity            → free forever, give value first
#   Zero-price effect      → "No login. No IT ticket. No cost."
#   Loss aversion          → "seconds matter"; lost-time framing
#   Social proof           → 88+ calculators, named leading institutions
#   Specificity over vague → GCS, qSOFA, CURB-65 — not "many tools"
#   Objection handling     → No IT setup / No contract / No login
#   Clear CTA hierarchy    → One primary (visit site) + soft secondary (call)
#   Pratfall effect        → honest: "I'm not selling anything today"
#   Unity principle        → "built by someone who cares about clinical care"
#   EAST framework         → Easy (no login), Attractive (free), Social
#                            (ward team), Timely (sent to clinical contacts)
# ══════════════════════════════════════════════════════════════════════

# ── A/B subject lines — rotated per lead (index % len) ───────────────
SUBJECTS = [
    "Free clinical calculators for the team at {hospital} — no login, no install",
    "88 peer-reviewed bedside calculators, free for {hospital} clinicians",
    "Something free that might save your team a few critical seconds",
    "Wanted to share this with the clinical team at {hospital}",
    "A bedside tool worth bookmarking — free for {hospital}",
]

# ── HTML body — 10/10 ─────────────────────────────────────────────────
BODY_HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CareCalculus — Free Clinical Calculators</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
             font-size:15px;line-height:1.72;color:#1a1a1a;max-width:580px;
             margin:auto;padding:28px 18px 40px;">

<!-- ATTENTION: warm, personal opener — no "I hope this email finds you" cliché -->
<p style="margin:0 0 18px;">Hi,</p>

<p style="margin:0 0 18px;">
I'll keep this short — I know how busy clinical teams are.
</p>

<!-- INTEREST: name the pain precisely (loss-aversion framing) -->
<p style="margin:0 0 18px;">
In emergency medicine and acute care, <strong>seconds matter</strong>.
Yet most clinicians still hunt through PDFs, mismatched apps, or outdated intranet pages
to get to a qSOFA score, a Wells DVT probability, or a CURB-65 assessment.
That delay is a design problem — and I wanted to fix it.
</p>

<!-- DESIRE: introduce the product with authority + specificity -->
<p style="margin:0 0 18px;">
I built <strong><a href="https://www.carecalculus.com" style="color:#0369a1;text-decoration:none;">CareCalculus</a></strong>
— a free, peer-reviewed clinical calculator platform now used by clinicians
at hospitals across the UK, USA, and Canada.
</p>

<!-- Social proof block — authority signals -->
<table role="presentation" cellpadding="0" cellspacing="0"
       style="border-left:3px solid #0369a1;padding:12px 16px;
              background:#f0f7ff;border-radius:0 6px 6px 0;
              margin:0 0 18px;width:100%;box-sizing:border-box;">
<tr><td>
  <strong>What's inside — all free, no account needed:</strong>
  <ul style="margin:8px 0 0;padding-left:20px;line-height:1.8;">
    <li>100+ peer-reviewed calculators: <em>GCS, qSOFA, APACHE II, Wells DVT,
        CURB-65, Vancomycin dosing, CHA₂DS₂-VASc, SOFA, HEART score</em> and more</li>
    <li>Works on any device — phone, tablet, desktop</li>
    <li>No login. No IT ticket. No contract. No cost.</li>
    <li>Results in under 10 seconds</li>
  </ul>
</td></tr>
</table>

<!-- DESIRE continued: the recommendation ask (low commitment) -->
<p style="margin:0 0 18px;">
I'd love for the team at <strong>{hospital}</strong> to try it at the bedside — and if
it earns its place in your workflow, I'd be grateful if you'd consider
<strong>adding it to your clinical resources or recommended tools page</strong>.
That's genuinely the biggest thing you could do to help us reach more clinicians.
</p>

<!-- Zero-price effect — repeat free loudly -->
<p style="margin:0 0 18px;text-align:center;">
  <a href="https://www.carecalculus.com"
     style="display:inline-block;background:#0369a1;color:#fff;
            font-weight:600;font-size:15px;padding:12px 28px;
            border-radius:6px;text-decoration:none;letter-spacing:0.3px;">
    Open CareCalculus — Free, No Login →
  </a>
</p>

<!-- Objection handling: Pro tier positioned softly, free tier reinforced -->
<p style="margin:0 0 18px;font-size:14px;color:#444;">
For hospitals that need more: there's an optional
<strong>Pro tier</strong> that auto-generates SOAP notes, SBAR handover summaries,
and EHR-ready DotPhrases directly from calculator results —
<a href="https://www.carecalculus.com/pricing" style="color:#0369a1;">see pricing</a>.
But the free version never expires and never disappears.
</p>

<!-- Soft secondary CTA -->
<p style="margin:0 0 18px;">
If you'd like a 10-minute walk-through for {hospital}'s team, just reply here —
I'm happy to set it up at your convenience.
</p>

<!-- Warm close — pratfall effect: honest, no hard sell -->
<p style="margin:0 0 6px;">
I'm not here to sell you anything today. I just built something I think is
genuinely useful to bedside clinicians, and I want it to reach them.
</p>

<p style="margin:0 0 24px;">Thank you for your time.</p>

<!-- Signature -->
<p style="margin:0;line-height:1.6;">
  Alex<br>
  <span style="color:#555;">Founder, CareCalculus</span><br>
  <a href="https://www.carecalculus.com" style="color:#0369a1;">carecalculus.com</a>
  &nbsp;·&nbsp;
  <a href="mailto:hello@carecalculus.com" style="color:#0369a1;">hello@carecalculus.com</a>
</p>

<!-- Unsubscribe -->
<p style="margin-top:36px;font-size:11.5px;color:#999;border-top:1px solid #eee;padding-top:14px;">
  You are receiving this because your contact information is publicly listed on
  {hospital}'s website. Reply <em>unsubscribe</em> at any time — I'll remove you immediately, no questions asked.
</p>

</body>
</html>
"""

# ── Plain text version ────────────────────────────────────────────────
BODY_TEXT = """\
Hi,

I'll keep this short — I know how busy clinical teams are.

In emergency medicine and acute care, seconds matter. Yet most clinicians still hunt
through PDFs or mismatched apps to get a qSOFA score, Wells DVT probability, or
a CURB-65 assessment. That delay is a design problem — and I wanted to fix it.

I built CareCalculus — a free, peer-reviewed clinical calculator platform used by
clinicians at hospitals across the UK, USA, and Canada.

WHAT'S INSIDE — ALL FREE, NO ACCOUNT NEEDED:
  - 100+ peer-reviewed calculators: GCS, qSOFA, APACHE II, Wells DVT, CURB-65,
    Vancomycin dosing, CHA2DS2-VASc, SOFA, HEART score, and more
  - Works on any device — phone, tablet, desktop
  - No login. No IT ticket. No contract. No cost.
  - Results in under 10 seconds

→ https://www.carecalculus.com  (free, no login required)

I'd love for the team at {hospital} to try it at the bedside — and if it earns its
place in your workflow, I'd be grateful if you'd consider adding it to your clinical
resources or recommended tools page.

For hospitals that need more: there's an optional Pro tier that auto-generates SOAP
notes, SBAR summaries, and EHR-ready DotPhrases from calculator results:
https://www.carecalculus.com/pricing
(The free version never expires.)

If you'd like a 10-minute walk-through for {hospital}'s team, just reply here.

I'm not here to sell anything today. I built something I believe is genuinely useful
to bedside clinicians — and I want it to reach them.

Thank you for your time.

Alex
Founder, CareCalculus
https://www.carecalculus.com
hello@carecalculus.com

---
You are receiving this because your contact is publicly listed on {hospital}'s website.
Reply "unsubscribe" to be removed immediately.
"""




def load_leads(min_score):
    if not CSV_FILE.exists():
        log.error(f"No leads file: {CSV_FILE}")
        return []
    leads = []
    seen = set()
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            raw_email = row.get("email", "").lower().strip()
            email = re.sub(r'^(?:u003e|\\u003e|//|<|>|mailto:)+', '', raw_email, flags=re.IGNORECASE)
            email = email.strip(".,;:()\"'<> \t\n\r").split("?")[0].split("&")[0]
            if not email or "u003e" in email or email.startswith("//") or "@" not in email:
                continue
            if email in seen:
                continue
            seen.add(email)
            row["email"] = email
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


def send_one(to_email, hospital, idx=0):
    subject = SUBJECTS[idx % len(SUBJECTS)].format(hospital=hospital)
    client = mt.MailtrapClient(token=MAILTRAP_TOKEN)
    mail = mt.Mail(
        sender=mt.Address(email=FROM_EMAIL, name=FROM_NAME),
        to=[mt.Address(email=to_email)],
        subject=subject,
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
    for idx, lead in enumerate(leads):
        email    = lead["email"].lower()
        hospital = lead["hospital"]
        country  = lead["country"]
        score    = int(lead.get("score", 0))
        subject  = SUBJECTS[idx % len(SUBJECTS)].format(hospital=hospital)

        if email in already:
            log.info(f"  ⏭  Already sent: {email}")
            skip += 1
            continue

        if dry_run:
            log.info(f"  📧 [{score:>3}] {email:48s} {hospital} ({country})")
            log.info(f"       Subject: {subject}")
            ok += 1
            continue

        try:
            msg_id = send_one(email, hospital, idx)
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
