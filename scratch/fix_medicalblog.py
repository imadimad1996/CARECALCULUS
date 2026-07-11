import re
with open('src/pages/MedicalBlog.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'blog\.multilingualTitle\.ar\.toLowerCase\(\)\.includes\(query\)\s*\|\|\s*', '', c)
c = re.sub(r'\?\s*\(\s*lang\s*===\s*[\'"]fr[\'"]\s*\?\s*([a-zA-Z0-9_.]+)\.fr\s*:\s*[a-zA-Z0-9_.]+\.ar\s*\)', r'? \1.fr', c)

with open('src/pages/MedicalBlog.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
