from pypdf import PdfReader

input_path = r"c:\Users\DeLL\CARECALCULUS\public\pdf\fmp\livre iECN orthopédie traumatologie v2.pdf"
reader = PdfReader(input_path)
print("Number of pages:", len(reader.pages))
