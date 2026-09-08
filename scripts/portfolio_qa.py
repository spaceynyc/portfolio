from pathlib import Path
import hashlib
import json
import os
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa'
BASE = 'http://127.0.0.1:4173'
source = Path(os.environ['TEMP']) / 'spaceynyc-portfolio-source-20260908'
data_text = (ROOT / 'src/portfolio-data.js').read_text(encoding='utf-8')
projects = json.loads(data_text.split('export const projects = ', 1)[1].split(';\nexport const technologies', 1)[0])
report = {'checks': [], 'viewports': [], 'errors': [], 'failed_requests': []}
def record(name, value=True):
    assert value, name
    report['checks'].append(name)
def same_file(a, b):
    return hashlib.sha256(a.read_bytes()).digest() == hashlib.sha256(b.read_bytes()).digest()

record('User logo is unchanged', same_file(ROOT / 'logo.png', ROOT / 'public/assets/logo.png'))
for p in projects:
    if p.get('image'):
        record(f"Original thumbnail unchanged: {p['title']}", same_file(ROOT / 'public' / p['image'].lstrip('/'), source / 'public' / p['image'].lstrip('/')))

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page(viewport={'width': 1672, 'height': 941}, device_scale_factor=1)
    page.on('pageerror', lambda e: report['errors'].append(str(e)))
    page.on('requestfailed', lambda r: report['failed_requests'].append({'url': r.url, 'failure': r.failure}))
    page.goto(BASE, wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.wait_for_function("document.querySelectorAll('.service-art[data-model=blender]').length === 4")
    for selector, file in [('h1', 'hero-title.svg'), ('#work-title', 'featured-work.svg'), ('#services-title', 'what-we-do.svg')]:
        expected = (ROOT / 'src/assets' / file).read_text(encoding='utf-8')
        actual = page.locator(selector + ' svg').evaluate('(svg) => [...svg.querySelectorAll("path")].map(p=>p.getAttribute("d"))')
        expected_paths = re.findall(r'<path\b[^>]*\bd="([^"]*)"', expected)
        record(f'Exact original lettering: {selector}', actual == expected_paths and len(actual) > 0)
    record('All 11 projects rendered', page.locator('.carousel-slide').count() == 11)
    record('ILE mention removed from portfolio copy', not re.search(r'\bILE\b', page.locator('body').inner_text()))
    record('Contact social links use icons instead of text', page.locator('.contact-socials a svg').count() == 2 and all(not a.inner_text().strip() for a in page.locator('.contact-socials a').all()))
    record('Original tagline retained twice', page.locator('.hero-motto').inner_text().replace('\n', ' ').startswith('A BRIGHTER TOMORROW.') and 'A BRIGHTER TOMORROW.' in page.locator('.footer-motto').inner_text())
    record('Initial carousel range', page.locator('#carousel-status').inner_text() == '01–03 / 11')
    for expected in ['04–06 / 11', '07–09 / 11', '09–11 / 11']:
        page.locator('[data-carousel=next]').click()
        page.wait_for_function('(s) => document.querySelector("#carousel-status").textContent === s', arg=expected)
        page.wait_for_timeout(400)
    record('Carousel reaches final projects', page.locator('[data-carousel=next]').is_disabled())
    page.locator('[data-carousel=previous]').click()
    page.wait_for_function('document.querySelector("#carousel-status").textContent === "07–09 / 11"')
    page.locator('#project-track').focus()
    page.keyboard.press('Home')
    page.wait_for_function('document.querySelector("#carousel-status").textContent === "01–03 / 11"')
    page.wait_for_timeout(400)
    page.keyboard.press('End')
    page.wait_for_function('document.querySelector("#carousel-status").textContent === "09–11 / 11"')
    page.wait_for_timeout(400)
    page.keyboard.press('ArrowLeft')
    page.wait_for_function('document.querySelector("#carousel-status").textContent === "07–09 / 11"')
    record('Carousel supports Previous, Home, End, and arrow keys')
    page.locator('.carousel-dots button').first.click()
    page.wait_for_function('document.querySelector("#carousel-status").textContent === "01–03 / 11"')
    page.wait_for_timeout(400)
    record('Carousel dot navigation works', page.locator('.carousel-dots button').first.get_attribute('aria-current') == 'true')
    page.screenshot(path=str(OUT / 'portfolio-carousel.png'))
    for p in projects:
        page.locator('[data-modal=work]').click()
        page.locator(f'#detail-dialog [data-project="{p["id"]}"]').click()
        record(f"Project details render: {p['title']}", page.locator('#dialog-title').text_content() == p['title'] and page.locator('.dialog-text').text_content() == p['blurb'])
        if p.get('image'):
            page.locator('.portfolio-detail-image img').wait_for()
            page.wait_for_function('document.querySelector(".portfolio-detail-image img").naturalWidth > 0')
        for key in ('link', 'github'):
            if p.get(key):
                record(f"Project {key} preserved: {p['title']}", page.locator(f'#detail-dialog a[href="{p[key]}"]').count() == 1)
        if p['id'] == 'socionics-research-lab':
            page.screenshot(path=str(OUT / 'portfolio-project-detail.png'))
        page.keyboard.press('Escape')
        record(f"Dialog focus restored: {p['title']}", page.locator('[data-modal=work]').evaluate('(el) => el === document.activeElement'))
    page.locator('[data-modal=work]').click()
    record('All-project directory contains 11 projects', page.locator('.project-directory button').count() == 11)
    page.screenshot(path=str(OUT / 'portfolio-directory.png'))
    page.keyboard.press('Escape')
    for key in ['brand', 'digital', 'content', 'experience']:
        button = page.locator(f'[data-service={key}]')
        button.scroll_into_view_if_needed()
        page.mouse.move(5, 5)
        icon = button.locator('.service-art')
        before = float(icon.get_attribute('data-rotation'))
        page.wait_for_timeout(180)
        record(f'Icon is still before hover: {key}', float(icon.get_attribute('data-rotation')) == before)
        button.hover()
        page.wait_for_timeout(550)
        after = float(icon.get_attribute('data-rotation'))
        record(f'Icon rotates on hover: {key}', after > before + 0.05)
        page.mouse.move(5, 5)
        stopped = icon.get_attribute('data-rotation')
        page.wait_for_timeout(150)
        record(f'Icon stops after hover: {key}', icon.get_attribute('data-rotation') == stopped)
        button.click()
        record(f'Service links to real projects: {key}', page.locator('.related-projects button').count() >= 2)
        page.locator('.related-projects button').first.click()
        record(f'Service project opens: {key}', page.locator('.portfolio-detail-image').count() == 1)
        page.keyboard.press('Escape')
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(450)
    page.mouse.move(1130, 180)
    page.wait_for_timeout(300)
    record('Hero cubes still glow on hover', page.locator('.site-shell').get_attribute('data-cubes-hovered') == 'true')
    page.mouse.move(20, 100)
    page.wait_for_timeout(350)
    record('Real email and social links', page.locator('a[href="mailto:srich7x@gmail.com"]').count() >= 2 and page.locator('a[href="https://github.com/spaceynyc"]').count() >= 2 and page.locator('a[href="https://x.com/spaceynyc"]').count() >= 2)
    for width in [320, 375, 390, 600, 768, 900, 1024, 1280, 1672, 1920]:
        page.set_viewport_size({'width': width, 'height': 941 if width > 900 else 844})
        page.wait_for_timeout(120)
        size = page.evaluate('({width:innerWidth, scrollWidth:document.documentElement.scrollWidth, slides:getComputedStyle(document.querySelector("#project-track")).getPropertyValue("--visible-projects").trim()})')
        record(f'No horizontal page overflow at {width}px', size['scrollWidth'] <= width)
        record(f'Portfolio sections do not overlap at {width}px', page.evaluate('document.querySelector("#work").getBoundingClientRect().bottom <= document.querySelector("#services").getBoundingClientRect().top + 1 && document.querySelector("#services").getBoundingClientRect().bottom <= document.querySelector("#about").getBoundingClientRect().top + 1'))
        report['viewports'].append(size)
        if width in [390, 768, 1672]:
            page.evaluate('document.activeElement.blur(); document.querySelector("#project-track").scrollTo({left:0,behavior:"instant"}); window.scrollTo({top:0,behavior:"instant"})')
            page.wait_for_timeout(200)
            page.screenshot(path=str(OUT / f'portfolio-{width}.png'), full_page=True)
    page.set_viewport_size({'width': 390, 'height': 844})
    page.locator('.menu-toggle').click()
    page.locator('.main-nav a[href="#about"]').click()
    record('Mobile navigation closes after selection', page.locator('.menu-toggle').get_attribute('aria-expanded') == 'false' and page.url.endswith('#about'))
    page.emulate_media(reduced_motion='reduce')
    page.locator('[data-service=brand]').hover()
    value = page.locator('[data-service=brand] .service-art').get_attribute('data-rotation')
    page.wait_for_timeout(300)
    record('Reduced motion disables icon rotation', page.locator('[data-service=brand] .service-art').get_attribute('data-rotation') == value)
    page.locator('.carousel-dots button').last.click()
    page.wait_for_function('document.querySelector("#carousel-status").textContent === "11–11 / 11"')
    record('Mobile carousel reaches project 11')
    policy_source = json.loads((OUT / 'policy-source.json').read_text(encoding='utf-8'))
    for policy in policy_source:
        response = page.goto(BASE + policy['path'], wait_until='networkidle')
        record(f"Policy route preserved: {policy['path']}", response.status == 200 and page.locator('h1').text_content() == policy['title'])
        record(f"Policy wording preserved: {policy['path']}", page.locator('article').inner_text().casefold().split() == policy['text'].casefold().split())
        record(f"Policy has no mobile overflow: {policy['path']}", page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
    page.screenshot(path=str(OUT / 'portfolio-policy-mobile.png'), full_page=True)
    touch_context = browser.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    touch = touch_context.new_page()
    touch.goto(BASE, wait_until='networkidle')
    touch.locator('#project-track').scroll_into_view_if_needed()
    box = touch.locator('#project-track').bounding_box()
    cdp = touch_context.new_cdp_session(touch)
    x, y = box['x'] + box['width'] - 25, box['y'] + 65
    cdp.send('Input.dispatchTouchEvent', {'type':'touchStart', 'touchPoints':[{'x':x, 'y':y}]})
    for step in range(1, 11):
        cdp.send('Input.dispatchTouchEvent', {'type':'touchMove', 'touchPoints':[{'x':x - step * 27, 'y':y}]})
        touch.wait_for_timeout(25)
    cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd', 'touchPoints':[]})
    touch.wait_for_timeout(600)
    record('Native mobile touch swipe advances the carousel', touch.locator('#project-track').evaluate('(el) => el.scrollLeft') > 150)
    touch_context.close()
    record('No browser runtime errors', not report['errors'])
    record('No failed network requests', not report['failed_requests'])
    browser.close()
(OUT / 'portfolio-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({'checks_passed': len(report['checks']), 'viewports': len(report['viewports']), 'errors': report['errors'], 'failed_requests': report['failed_requests']}))
