from pathlib import Path
import json
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa'
OUT.mkdir(exist_ok=True)
report={'checks':[],'pageErrors':[],'failedRequests':[]}
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    page=browser.new_page(viewport={'width':1672,'height':941},device_scale_factor=1)
    page.on('pageerror',lambda err:report['pageErrors'].append(str(err)))
    page.on('requestfailed',lambda req:report['failedRequests'].append({'url':req.url,'failure':req.failure}))
    page.goto('http://127.0.0.1:5173',wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    assert page.evaluate("document.fonts.check('16px Inter')")
    report['checks'].append('Local fonts loaded')
    expect(page.locator('.service-art[data-model="blender"]')).to_have_count(4,timeout=30000)
    for service in ('brand','digital','content','experience'):
        holder=page.locator(f'[data-service="{service}"] .service-art')
        before=float(holder.get_attribute('data-rotation'))
        page.locator(f'[data-service="{service}"]').hover()
        expect(holder).to_have_attribute('data-rotating','true')
        page.wait_for_function("([service,before])=>Number(document.querySelector(`[data-service=\"${service}\"] .service-art`).dataset.rotation)>before+.05",arg=[service,before])
        assert page.locator('.service-art[data-rotating="true"]').count()==1
        page.mouse.move(700,470)
        expect(holder).to_have_attribute('data-rotating','false')
        stopped=holder.get_attribute('data-rotation')
        page.wait_for_timeout(250)
        assert holder.get_attribute('data-rotation')==stopped
    report['checks'].append('All 4 Blender icons rotate only on hover and freeze immediately after exit')
    page.mouse.move(1120,150)
    page.wait_for_function("document.querySelector('.site-shell').dataset.cubesHovered==='true'")
    page.wait_for_function("parseFloat(getComputedStyle(document.querySelector('.hero-cube-glow')).opacity)>.3")
    assert float(page.evaluate("getComputedStyle(document.querySelector('.site-shell')).getPropertyValue('--cube-lift').replace('px','')")) < -2
    page.screenshot(path=str(OUT/'cube-hover.png'))
    page.mouse.move(700,470)
    page.wait_for_function("getComputedStyle(document.querySelector('.site-shell')).getPropertyValue('--cube-light')==='0'")
    assert float(page.locator('.hero-ring-glow').evaluate("el=>getComputedStyle(el).opacity"))>0
    report['checks'].append('Cube hover lifts and glows, returns to rest, and ring glow remains visible')
    for width in (320,390,600,768,900,1024,1440,1672,1920):
        page.set_viewport_size({'width':width,'height':941})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow at {width}'
    report['checks'].append('No horizontal overflow at 9 widths from 320 to 1920')
    page.set_viewport_size({'width':1672,'height':941})
    for key in ('orbital','chroma','nexus'):
        page.locator(f'.project-card[data-project="{key}"]').click()
        expect(page.locator('dialog')).to_be_visible()
        expect(page.locator('.viewer canvas')).to_be_visible(timeout=30000)
        expect(page.locator('.viewer-hint')).to_have_text('DRAG TO EXPLORE · SCROLL TO ZOOM')
        box=page.locator('.viewer canvas').bounding_box()
        page.mouse.move(box['x']+box['width']*.45,box['y']+box['height']*.5)
        page.mouse.down();page.mouse.move(box['x']+box['width']*.6,box['y']+box['height']*.55,steps=12);page.mouse.up()
        page.screenshot(path=str(OUT/f'{key}-detail.png'))
        page.keyboard.press('Escape')
        expect(page.locator('dialog')).not_to_be_visible()
        expect(page.locator(f'.project-card[data-project="{key}"]')).to_be_focused()
        report['checks'].append(f'{key.title()} project opens, 3D renders, drag works, Escape restores focus')
    page.get_by_role('button',name='VIEW ALL',exact=True).click()
    expect(page.locator('.modal-projects button')).to_have_count(3)
    page.locator('.dialog-close').click()
    report['checks'].append('View all opens all 3 projects')
    page.locator('.main-nav [data-modal="about"]').click()
    expect(page.locator('#dialog-title')).to_contain_text('Ideas without')
    page.keyboard.press('Escape')
    report['checks'].append('About dialog works')
    for service in ('brand','digital','content','experience'):
        page.locator(f'[data-service="{service}"]').click()
        page.locator('[data-inquire]').click()
        assert page.locator('select').input_value().lower()==service, {'expected':service,'actual':page.locator('select').input_value(),'html':page.locator('select').inner_html()}
        page.keyboard.press('Escape')
    report['checks'].append('All 4 service dialogs carry selected service into project brief')
    page.locator('.create-button').click()
    page.get_by_label('Your name').fill('Visual QA')
    page.get_by_label('Email address').fill('qa@example.com')
    page.get_by_label('Your idea').fill('A new visual identity and dimensional website.')
    with page.expect_download() as info:
        page.get_by_role('button',name='Create my project brief').click()
    download=info.value
    download.save_as(OUT/'test-project-brief.txt')
    assert 'Visual QA' in (OUT/'test-project-brief.txt').read_text()
    expect(page.locator('.form-status')).to_contain_text('ready')
    page.screenshot(path=str(OUT/'contact.png'))
    page.keyboard.press('Escape')
    report['checks'].append('Project brief validates and downloads correct content')
    page.set_viewport_size({'width':390,'height':844})
    page.locator('.menu-toggle').click()
    expect(page.locator('.main-nav')).to_be_visible()
    page.locator('.main-nav a[href="#services"]').click()
    expect(page.locator('.main-nav')).not_to_be_visible()
    expect(page.locator('.menu-toggle')).to_have_attribute('aria-expanded','false')
    report['checks'].append('Mobile menu opens, navigates and closes')
    page.emulate_media(reduced_motion='reduce')
    assert page.evaluate("getComputedStyle(document.documentElement).scrollBehavior")=='auto'
    page.locator('[data-service="brand"]').hover()
    holder=page.locator('[data-service="brand"] .service-art')
    expect(holder).to_have_attribute('data-rotating','false')
    stopped=holder.get_attribute('data-rotation')
    page.wait_for_timeout(250)
    assert holder.get_attribute('data-rotation')==stopped
    report['checks'].append('Reduced motion respected')
    assert not report['pageErrors'],report['pageErrors']
    assert not report['failedRequests'],report['failedRequests']
    browser.close()
(OUT/'interaction-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
