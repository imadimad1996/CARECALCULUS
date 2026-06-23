import os
from pypdf import PdfReader, PdfWriter

input_path = r"c:\Users\DeLL\CARECALCULUS\public\pdf\fmp\livre iECN orthopédie traumatologie v2.pdf"
output_path = r"c:\Users\DeLL\CARECALCULUS\public\pdf\fmp\livre iECN orthopédie traumatologie v2_compressed.pdf"

print("Original size:", os.path.getsize(input_path))

reader = PdfReader(input_path)
writer = PdfWriter()

for page in reader.pages:
    page.compress_content_streams()
    writer.add_page(page)

with open(output_path, "wb") as f:
    writer.write(f)

print("Compressed size:", os.path.getsize(output_path))
