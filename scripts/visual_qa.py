from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa'
OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    page=browser.new_page(viewport={'width':1672,'height':941},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    page.goto('http://127.0.0.1:5173',wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.wait_for_function("document.querySelectorAll('.service-art[data-model=\"blender\"]').length===4")
    page.screenshot(path=str(OUT/'desktop.png'),full_page=True)
    print(json.dumps({'desktop':page.evaluate('({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,sections:[...document.querySelectorAll("header,.hero,.work-section,.services-section,footer")].map(e=>({class:e.className,y:e.getBoundingClientRect().y,height:e.getBoundingClientRect().height}))})'),'errors':errors}))
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=str(OUT/'mobile.png'),full_page=True)
    print(json.dumps({'mobile':page.evaluate('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})')}))
    browser.close()
