from pathlib import Path
import urllib.request,re
from fontTools.ttLib import TTFont
req=urllib.request.Request('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',headers={'User-Agent':'Mozilla/5.0'})
css=urllib.request.urlopen(req).read().decode()
blocks=css.split('/* latin */')
latin=blocks[-1]
url=re.search(r'url\(([^)]+)\)',latin).group(1)
data=urllib.request.urlopen(url).read()
path=Path(__file__).resolve().parents[1]/'public/assets/Inter.woff2'
path.write_bytes(data)
font=TTFont(path)
font.flavor='woff2'
font.save(path)
print('Saved Inter latin:',len(data),'bytes')
