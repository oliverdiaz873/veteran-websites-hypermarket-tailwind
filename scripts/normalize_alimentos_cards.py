import re
from pathlib import Path
p = Path('pages/category/alimentos.html')
s = p.read_text(encoding='utf-8')
# 1) Add classes to article tags
s = re.sub(r'<article class="producto">', '<article class="producto product-card offer-card block shrink-0 snap-start">', s)
# 2) Ensure article with partial classes already handled
s = re.sub(r'<article class="producto product-card offer-card block shrink-0 snap-start">\s*<div class="producto-img-container">', '<article class="producto product-card offer-card block shrink-0 snap-start">\n                                  <div class="producto-img-container">', s)
# 3) Add producto-title to h3 if missing
s = re.sub(r'<h3>([^<]+)</h3>', r'<h3 class="producto-title">\1</h3>', s)
# 4) Add producto-price to price paragraphs starting with "Precio:"
s = re.sub(r'<p>\s*(Precio:[^<]+)</p>', r'<p class="producto-price">\1</p>', s)
# 5) Add product-card__add-btn to btn-agregar
s = re.sub(r'class="btn-agregar"', 'class="btn-agregar product-card__add-btn"', s)
# 6) Wrap direct <img ... loading="lazy"> that are immediate children of article (not already wrapped)
s = re.sub(r'(<article [^>]*>\s*)(<img [^>]*loading="lazy"[^>]*>)', r"\1                                  <div class=\"producto-img-container\">\n                                      \2\n                                  </div>", s)
# Avoid double-wrapping already wrapped images
s = s.replace('<div class="producto-img-container">\n                                      <div class="producto-img-container">', '<div class="producto-img-container">')

p.write_text(s, encoding='utf-8')
print('normalized')
