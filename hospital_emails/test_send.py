"""
CareCalculus — Quick Test Send
================================
Sends a test email to your own inbox to verify Mailtrap + carecalculus.com domain.
Run: python test_send.py
"""
import mailtrap as mt
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / "scripts/hospital_email_crawler/.env")
except ImportError:
    pass

import os

TOKEN = os.getenv("SMTP_PASS", "d0ab5b75a4b40c2af0bd89f95f51f026")

mail = mt.Mail(
    sender=mt.Address(email="hello@carecalculus.com", name="CareCalculus Team"),
    to=[mt.Address(email="imad.kaoubaa.azizi@gmail.com")],
    subject="CareCalculus — Test Email ✅",
    text="Domain verified! CareCalculus email sending is working.",
    category="Integration Test",
)

client = mt.MailtrapClient(token=TOKEN)
response = client.send(mail)
print("✅ Test result:", response)
