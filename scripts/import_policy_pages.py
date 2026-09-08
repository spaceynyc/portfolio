"""Preserve the existing portfolio's policy-page copy without rewriting it."""
from pathlib import Path
from html import escape
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page()
    for slug in ('hermes-sms', 'privacy', 'terms'):
        page.goto(f'https://spaceynyc.dev/{slug}', wait_until='networkidle')
        article = page.locator('article.compliance-copy')
        article.wait_for()
        title = page.locator('h1').inner_text()
        body = article.inner_html()
        text = article.inner_text()
        out = ROOT / slug
        out.mkdir(exist_ok=True)
        (out / 'index.html').write_text(f'''<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#050607" /><title>{escape(title)} — Spaceynyc</title><link rel="icon" type="image/png" href="/assets/logo.png" /><link rel="stylesheet" href="/src/policies.css" /></head>
<body class="policy-page"><a class="skip-link" href="#policy-content">Skip to content</a><header class="policy-header"><a class="brand" href="/" aria-label="Spaceynyc home"><img src="/assets/logo.png" alt="Spaceynyc" /></a><a href="/">← Back to portfolio</a></header><main id="policy-content"><p class="policy-eyebrow">SPACEYNYC / HERMES SMS</p><h1>{escape(title)}</h1><p class="policy-intro">spaceynyc is the personal technology identity of Steven Richardson and operates the spaceynyc Hermes SMS service.</p><article class="policy-copy">{body}</article><footer class="policy-footer"><a href="/hermes-sms/">Hermes SMS</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="mailto:srich7x@gmail.com">Support</a></footer></main></body></html>''', encoding='utf-8')
        results.append({'path': f'/{slug}', 'title': title, 'text': text, 'source': f'https://spaceynyc.dev/{slug}'})
    browser.close()
(ROOT / 'qa/policy-source.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
print('Preserved all three policy pages and their original text.')
