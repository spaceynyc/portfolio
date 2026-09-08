"""Reconstruct the supplied mockup's custom lettering as resolution-independent SVG.

Contours become editable SVG paths. A clipped source texture preserves the
original's complex chrome highlights without recreating whole UI regions.
"""
from pathlib import Path
import cv2
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/assets'
OUT.mkdir(exist_ok=True)
source=cv2.imread(str(ROOT/'b69deb1a-eb8d-4114-9566-4c9de3312a73.png'))
regions={
    'hero-title':(85,166,645,120),
    'featured-work':(80,487,437,23),
    'what-we-do':(80,754,305,24),
    'orbital-title':(99,666,146,20),
    'chroma-title':(610,666,146,20),
    'nexus-title':(1124,666,116,20),
}
def trace(name,rect):
    x,y,w,h=rect
    crop=source[y:y+h,x:x+w]
    hi=cv2.resize(crop,None,fx=4,fy=4,interpolation=cv2.INTER_CUBIC)
    gray=cv2.cvtColor(hi,cv2.COLOR_BGR2GRAY)
    mask=(gray>95).astype(np.uint8)*255
    contours,hierarchy=cv2.findContours(mask,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
    paths=[]
    for i,c in enumerate(contours):
        if cv2.contourArea(c)<192:continue
        pts=cv2.approxPolyDP(c,.8,True)[:,0,:]/4
        paths.append('M'+'L'.join(f'{a:.2f},{b:.2f}' for a,b in pts)+'Z')
    stops=[]
    for j in range(0,h,2):
        row=crop[j]
        bright=cv2.cvtColor(row[None,:,:],cv2.COLOR_BGR2GRAY)[0]>125
        color=np.median(row[bright],axis=0) if np.any(bright) else np.array([195,194,203])
        b,g,r=[int(v) for v in color]
        stops.append(f'<stop offset="{j/max(1,h-1):.4f}" stop-color="rgb({r},{g},{b})"/>')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" aria-hidden="true"><defs><pattern id="metal-{name}" patternUnits="userSpaceOnUse" width="{w}" height="{h}"><image href="/assets/reference.png" x="{-x}" y="{-y}" width="1672" height="941"/></pattern></defs><path fill="url(#metal-{name})" fill-rule="evenodd" d="'+''.join(paths)+'"/></svg>'
    (OUT/(name+'.svg')).write_text(svg)
    print(name,len(paths),'contours',len(svg),'bytes')
for name,rect in regions.items():trace(name,rect)
for file in ['b69deb1a-eb8d-4114-9566-4c9de3312a73.png','qa/desktop.png']:
    im=cv2.imread(str(ROOT/file))
    print(file)
    for y in [307,330,352]:
        roi=cv2.cvtColor(im[y:y+15,85:640],cv2.COLOR_BGR2GRAY)
        xs=np.where(roi>100)[1]
        print(y, (int(xs.min())+85,int(xs.max())+85) if len(xs) else None)
