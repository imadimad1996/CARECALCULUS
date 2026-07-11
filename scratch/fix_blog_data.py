import re
with open('src/pages/Blog.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove titleAr fields from article objects
c = re.sub(r'\s*titleAr:\s*\'[^\']+\',', '', c)
c = re.sub(r'\s*titleAr:\s*"[^"]+",', '', c)
# Remove snippetAr fields
c = re.sub(r'\s*snippetAr:\s*\'[^\']+\',', '', c)
c = re.sub(r'\s*snippetAr:\s*"[^"]+",', '', c)
# Remove contentAr fields (might be multi-line - handle separately if needed)
c = re.sub(r'\s*contentAr:\s*\'[^\']+\',', '', c)
c = re.sub(r'\s*contentAr:\s*"[^"]+",', '', c)

# Fix the search line: a.titleAr.toLowerCase().includes(q)
c = re.sub(r'\s*a\.titleAr\.toLowerCase\(\)\.includes\(q\)\s*\|\|', '', c)
c = re.sub(r'\s*\|\|\s*a\.titleAr\.toLowerCase\(\)\.includes\(q\)', '', c)

with open('src/pages/Blog.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
print("Done")
