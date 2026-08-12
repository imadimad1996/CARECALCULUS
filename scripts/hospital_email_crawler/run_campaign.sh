#!/bin/bash
# run_campaign.sh
# Automates the CareCalculus hospital crawler and Mailtrap email outreach.

echo "========================================="
echo " CareCalculus B2B Email Campaign Pipeline "
echo "========================================="

# 1. Check for .env file
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in scripts/hospital_email_crawler/."
    echo "Please create one using .env.example and add your Mailtrap SMTP_PASS."
    exit 1
fi

# 2. Run Crawler
echo ""
echo "🚀 STEP 1: Running Crawl4AI Hospital Harvester..."
echo "This will scrape top hospital websites for CMO/Director emails."
python crawler.py

if [ $? -ne 0 ]; then
    echo "❌ Crawler encountered an error."
    exit 1
fi

# 3. Send Emails
echo ""
echo "📧 STEP 2: Sending Emails via Mailtrap..."
echo "Running in LIVE SEND mode..."
python send_emails.py --send

if [ $? -ne 0 ]; then
    echo "❌ Email sender encountered an error."
    exit 1
fi

echo ""
echo "✅ Campaign execution completed successfully!"
echo "Check output files in the /hospital_emails directory."
