"""One-time import of the supplied Word draft; runtime build uses Markdown only.
Usage: python scripts/import-draft.py /path/to/draft.docx
Requires python-docx; not required to build or view the website.
"""
from pathlib import Path
from docx import Document
import re,sys
root=Path(__file__).resolve().parents[1]
paras=[p.text.strip() for p in Document(sys.argv[1]).paragraphs]
starts=[i for i,s in enumerate(paras) if re.match(r'^POST [1-7] – ',s)]
slugs=['01-hail-damage-and-strip-down','02-sanding-filler-bodywork','03-rust-repair-prep-primer','04-painting-the-e30','05-reassembly','06-finishing-the-paint','07-final-result-lessons']
titles=['Why I resprayed my E30','Repairing the hail damage','Rust repair, final prep & primer','Painting the E30','Putting the E30 back together','Finishing the paint','The finished E30']
for n,start in enumerate(starts):
 end=starts[n+1] if n+1<len(starts) else next(i for i in range(start,len(paras)) if paras[i].startswith('FACT-CHECK /'))
 lines=[]
 for s in paras[start+1:end]:
  if not s or s.startswith('=') or s.startswith('[') or s=='Series closing line:':continue
  if s.startswith('The scale of the storm made more sense later.'):continue
  if s.startswith('My current receipt tracker identifies'):continue
  if 'My receipt records currently identify' in s:
   s='Before I committed to DIY preparation, I remember getting full-job quotes in the ballpark of $12,000. Doing the prep myself brought the cash cost down dramatically. My recollection of the all-in figure, including paint, roughly $2,000 in painter labour and miscellaneous costs, is closer to $5,000.'
  if len(s)<95 and not re.search(r'[.!?]$',s):s='## '+s
  lines.append(s)
 text='# '+titles[n]+'\n\n'+'\n\n'.join(lines)+'\n'
 (root/'content/writing/e30-respray'/f'{slugs[n]}.md').write_text(text)
 print(slugs[n],len(text.split()),'words')
