import os
from pypdf import PdfReader, PdfWriter

input_path = r"c:\Users\DeLL\CARECALCULUS\public\pdf\fmp\livre iECN orthopédie traumatologie v2.pdf"
reader = PdfReader(input_path)
total_pages = len(reader.pages)

# Part 1 (1 to 128)
writer1 = PdfWriter()
for i in range(128):
    writer1.add_page(reader.pages[i])
part1_path = r"c:\Users\DeLL\CARECALCULUS\public\pdf\fmp\livre iECN orthopédie traumatologie v2 - Partie 1.pdf"
with open(part1_path, "wb") as f:
    writer1.write(f)

# Part 2 (129 to 256)
writer2 = PdfWriter()
for i in range(128, 256):
    writer2.add_page(reader.pages[i])
part2_path = r"c:\Users\DeLL\CARECALCULUS\public\pdf\fmp\livre iECN orthopédie traumatologie v2 - Partie 2.pdf"
with open(part2_path, "wb") as f:
    writer2.write(f)

# Part 3 (257 to 384)
writer3 = PdfWriter()
for i in range(256, total_pages):
    writer3.add_page(reader.pages[i])
part3_path = r"c:\Users\DeLL\CARECALCULUS\public\pdf\fmp\livre iECN orthopédie traumatologie v2 - Partie 3.pdf"
with open(part3_path, "wb") as f:
    writer3.write(f)

print("Part 1 size:", os.path.getsize(part1_path))
print("Part 2 size:", os.path.getsize(part2_path))
print("Part 3 size:", os.path.getsize(part3_path))
