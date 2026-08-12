# run_campaign.ps1
# Automates the CareCalculus hospital crawler and Mailtrap email outreach.

Write-Host "========================================="
Write-Host " CareCalculus B2B Email Campaign Pipeline "
Write-Host "========================================="

# 1. Check for .env file
if (-Not (Test-Path -Path ".env")) {
    Write-Host "[X] Error: .env file not found in scripts/hospital_email_crawler/." -ForegroundColor Red
    Write-Host "Please create one using .env.example and add your Mailtrap SMTP_PASS."
    exit 1
}

# 2. Run Crawler
Write-Host "`n[STEP 1] Running Crawl4AI Hospital Harvester..." -ForegroundColor Cyan
Write-Host "This will scrape top hospital websites for CMO/Director emails."
python crawler.py

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Crawler encountered an error." -ForegroundColor Red
    exit 1
}

# 3. Send Emails
Write-Host "`n[STEP 2] Sending Emails via Mailtrap..." -ForegroundColor Cyan
Write-Host "Running in LIVE SEND mode..."
python send_emails.py --send

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Email sender encountered an error." -ForegroundColor Red
    exit 1
}

Write-Host "`n[OK] Campaign execution completed successfully!" -ForegroundColor Green
Write-Host "Check output files in the /hospital_emails directory."
