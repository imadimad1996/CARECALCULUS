# CareCalculus — Hospital Email Harvester

A two-step pipeline that:
1. **Crawls** 55+ top hospital websites (USA, Canada, UK) to discover decision-maker emails
2. **Sends** personalized marketing emails to each lead with score-based filtering

---

## Quick Start

### Step 1 — Install dependencies

```bash
pip install crawl4ai openpyxl python-dotenv
crawl4ai-setup   # first-time browser setup
```

### Step 2 — Run the crawler

```bash
python crawler.py
```

Output files will appear in `output/`:
| File | Description |
|------|-------------|
| `hospital_leads.csv` | All discovered email leads |
| `hospital_leads.xlsx` | Color-coded Excel workbook |
| `run_log.txt` | Detailed crawl log |

### Step 3 — Configure email credentials

```bash
cp .env.example .env
# Edit .env with your Gmail App Password
```

> **Gmail setup:** Enable 2FA → [Generate App Password](https://myaccount.google.com/apppasswords)

### Step 4 — Preview emails (dry run)

```bash
python send_emails.py
```

### Step 5 — Send for real

```bash
python send_emails.py --send
```

---

## Flags

| Flag | Description |
|------|-------------|
| `--send` | Actually send emails (default is dry run) |
| `--limit 20` | Only send to the first 20 leads |
| `--min-score 25` | Only contact high-confidence leads |

---

## How Scoring Works

Each email gets a **relevance score**:

| Signal | Points |
|--------|--------|
| Valid email (base) | +10 |
| Keyword in address (`cmo`, `director`, `clinical`…) | +5 each |
| Decision-maker title near the email (`Chief Medical Officer`, `IT Director`…) | +10 |

Score ≥ 20 = high-value, CMO/Director-level contact  
Score 10–19 = general contact (still worth sending to)

---

## Hospital Coverage

- **USA** — 25 top hospitals (Mayo Clinic, Cleveland Clinic, Johns Hopkins, Stanford…)
- **Canada** — 12 major centres (UHN, McGill, Ottawa, Alberta Health…)
- **UK** — 18 NHS Trusts (Royal London, Guy's, UCL, Oxford, Cambridge…)

Each hospital contact page is crawled + up to 6 sub-pages (leadership, about, directory) are auto-discovered.

---

## Legal / Ethics Note

- Always include an **unsubscribe mechanism** in your emails (already included in the template)
- Respect `robots.txt` — the crawler uses polite delays
- This tool is for **B2B outreach only** — hospital administrators and decision-makers are a legitimate B2B audience
- Comply with CAN-SPAM (USA), CASL (Canada), and UK GDPR for commercial emails
